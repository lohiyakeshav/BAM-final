
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, LineChart, AlertTriangle, Lightbulb, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockInsights = [
  {
    id: "insight-1",
    title: "Portfolio Diversification Recommendation",
    description: 
      "Your portfolio is heavily concentrated in the financial sector (45% allocation). Consider diversifying into healthcare and technology sectors to reduce risk and potentially increase returns.",
    type: "recommendation",
    date: "April 7, 2025",
  },
  {
    id: "insight-2",
    title: "Market Volatility Alert",
    description: 
      "Based on current market indicators, we're anticipating increased volatility in the next 2-3 weeks. Consider holding cash positions or implementing hedging strategies for protection.",
    type: "alert",
    date: "April 6, 2025",
  },
  {
    id: "insight-3",
    title: "Dividend Optimization",
    description: 
      "Your portfolio's dividend yield (1.8%) is below the market average. Adding select dividend aristocrats could increase your income while maintaining growth potential.",
    type: "optimization",
    date: "April 5, 2025",
  },
  {
    id: "insight-4",
    title: "Tax-Loss Harvesting Opportunity",
    description: 
      "We've identified 3 positions in your portfolio that could be used for tax-loss harvesting before the end of the financial year, potentially saving you ₹24,500 in taxes.",
    type: "optimization",
    date: "April 4, 2025",
  },
];

const marketNews = [
  {
    id: "news-1",
    title: "RBI Maintains Repo Rate at 6.5% in Latest Policy",
    summary: "The Reserve Bank of India has kept the repo rate unchanged at 6.5% for the seventh consecutive time, while maintaining its 'withdrawal of accommodation' stance.",
    source: "Economic Times",
    date: "April 7, 2025",
    impact: "neutral",
  },
  {
    id: "news-2",
    title: "IT Sector Expected to See 15% Growth in FY26",
    summary: "Industry analysts project India's IT sector to grow at 15% in FY26, driven by increased global spending on digital transformation and AI integration.",
    source: "Business Standard",
    date: "April 6, 2025",
    impact: "positive",
  },
  {
    id: "news-3",
    title: "Global Oil Prices Surge 5% on Supply Constraints",
    summary: "Crude oil prices jumped 5% following production cuts announced by major oil-producing nations, potentially impacting inflation and energy-dependent sectors.",
    source: "Reuters",
    date: "April 5, 2025",
    impact: "negative",
  },
];

const Insights = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
      
      <Tabs defaultValue="insights">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Portfolio Insights</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="ask">Ask AI Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {mockInsights.map((insight) => (
              <Card key={insight.id} className="animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge 
                      variant={insight.type === "alert" ? "destructive" : "outline"}
                      className="capitalize"
                    >
                      {insight.type}
                    </Badge>
                  </div>
                  <CardDescription>{insight.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{insight.description}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Learn More</Button>
                    <Button size="sm">Apply Recommendation</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="mt-4 space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Current Market Trends</CardTitle>
              <CardDescription>AI-powered analysis of market conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Bullish</div>
                    <div className="text-xs text-muted-foreground">Confidence: 75%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Volatility Index</CardTitle>
                      <LineChart className="h-4 w-4 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15.4</div>
                    <div className="text-xs text-muted-foreground">Low volatility expected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Moderate</div>
                    <div className="text-xs text-muted-foreground">Monitor closely</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Latest Market News</h4>
                <div className="space-y-3">
                  {marketNews.map((news) => (
                    <div key={news.id} className="border-b pb-2 last:border-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{news.title}</h5>
                        <Badge 
                          variant={news.impact === "positive" ? "default" : news.impact === "negative" ? "destructive" : "outline"}
                        >
                          {news.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{news.summary}</p>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{news.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ask" className="mt-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Ask Your Financial AI Assistant</CardTitle>
              <CardDescription>Get personalized advice and insights for your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">AI</div>
                  <div>
                    <p className="text-sm">Hello! I'm your personal financial AI assistant. I can help you with portfolio analysis, investment recommendations, market insights, and more. What would you like to know today?</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">U</div>
                  <div>
                    <p className="text-sm">What stocks should I consider for dividend income?</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">AI</div>
                  <div className="space-y-2">
                    <p className="text-sm">Based on your risk profile and current portfolio, here are some dividend stock recommendations:</p>
                    <ul className="text-sm list-disc pl-4">
                      <li><strong>HDFC Bank</strong> - Current yield: 1.2%, strong growth potential</li>
                      <li><strong>Power Grid</strong> - Current yield: 4.5%, stable government business</li>
                      <li><strong>ITC</strong> - Current yield: 3.8%, diversified business model</li>
                      <li><strong>Coal India</strong> - Current yield: 5.2%, high current yield</li>
                    </ul>
                    <p className="text-sm">Would you like a detailed analysis of any of these stocks?</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about your investments or financial planning..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" /> How should I rebalance my portfolio?
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" /> What's a good SIP strategy for me?
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" /> How can I optimize for taxes?
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Insights;
