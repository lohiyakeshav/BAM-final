import { useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Send, Bot, Sparkles } from "lucide-react";
import { useChat, Message } from "@/lib/contexts/ChatContext";
import { apiRequest, API_ENDPOINTS, API_BASE_URL } from "@/lib/utils/api";

interface ChatResponse {
  answer: string;
  sources: string[];
  timestamp: string;
  status?: string;
  message?: string;
}

// Function to generate financial advisor response
const fetchFinancialResponse = async (query: string): Promise<string> => {
  try {
    // Use the apiRequest utility
    const response = await apiRequest<ChatResponse>(
      API_ENDPOINTS.CHAT,
      'POST',
      { query: query }
    );
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Failed to get response from financial advisor');
    }
    
    return response.data.answer;
  } catch (error) {
    console.error('Error fetching response:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch response');
  }
};

export default function BAMAI() {
  // Using global chat context instead of local state
  const { 
    messages, 
    setMessages, 
    input, 
    setInput,
    isGenerating,
    setIsGenerating 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);
    
    try {
      // Create a "Generating..." message
      const generatingId = (Date.now() + 1).toString();
      const generatingMessage: Message = {
        id: generatingId,
        content: "Generating...",
        sender: "bot",
        timestamp: new Date()
      };
      
      // Add temporary generating message
      setMessages(prev => [...prev, generatingMessage]);
      
      // Get response from financial advisor
      const response = await fetchFinancialResponse(input);
      
      // Replace the generating message with the actual response
      setMessages(prev => prev.map(msg => 
        msg.id === generatingId
          ? { ...msg, content: response }
          : msg
      ));
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm having trouble connecting to the financial advisor service. Please try again later. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            BAM AI Assistant
          </CardTitle>
          <CardDescription>
            Get personalized financial advice and guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md border p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "bot" && (
                        <Avatar className="h-6 w-6">
                          <Bot className="h-4 w-4" />
                        </Avatar>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {message.content === "Generating..." ? (
                        <div className="flex items-center gap-2">
                          <span>Generating</span>
                          <Loader className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isGenerating && !messages.some(msg => msg.content === "Generating...") && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span>Generating</span>
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your financial advisor..."
              className="flex-1"
            />
            <Button type="submit" disabled={isGenerating}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
} 