import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { AUTH_EVENTS } from './AuthContext';

// Message interface
export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Context interface
interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  clearMessages: () => void;
}

// Create context with default values
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider props interface
interface ChatProviderProps {
  children: ReactNode;
}

// Sample greeting messages
const greetings = [
  "Hello! I'm your financial advisor. How can I help you with your financial planning today?",
  "Welcome! I'm here to provide personalized financial advice. What would you like to discuss?",
  "Hi there! I'm your financial planning assistant. Feel free to ask me about investments, savings, or any financial concerns."
];

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // State that will be shared across components
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { user } = useAuth();
  
  // Initialize with greeting when context is first created or when user changes
  useEffect(() => {
    // Check if messages already exist in localStorage
    const savedMessages = localStorage.getItem('chat-messages');
    
    if (savedMessages && user) {
      try {
        // Parse the saved messages, ensuring dates are properly converted back from strings
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        initializeWithGreeting();
      }
    } else {
      initializeWithGreeting();
    }
  }, [user]);
  
  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      initializeWithGreeting();
    };
    
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    };
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && user) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages, user]);
  
  // Initialize with a random greeting
  const initializeWithGreeting = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setMessages([
      {
        id: "greeting",
        content: randomGreeting,
        sender: "bot",
        timestamp: new Date()
      }
    ]);
  };

  // Function to clear messages
  const clearMessages = () => {
    initializeWithGreeting();
  };

  // Value to be provided to consumers
  const contextValue: ChatContextType = {
    messages,
    setMessages,
    input,
    setInput,
    isGenerating,
    setIsGenerating,
    clearMessages
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 