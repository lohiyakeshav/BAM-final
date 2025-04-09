import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { InvestmentReport, submitReportFeedback } from "@/lib/services/aiService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Chart } from "@/components/charts/Chart";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Wallet, 
  Share2,
  Download,
  Printer
} from "lucide-react";

interface InvestmentReportViewProps {
  report: InvestmentReport;
}

export default function InvestmentReportView({ report }: InvestmentReportViewProps) {
  const [activeTab, setActiveTab] = useState("allocation");
  const [feedback, setFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  // Parse JSON data from report
  const assetAllocation = JSON.parse(report.asset_allocation);
  const performanceProjection = JSON.parse(report.performance_projection);
  const riskAssessment = JSON.parse(report.risk_assessment);
  
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback before submitting");
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    try {
      await submitReportFeedback(0, feedback);
      toast.success("Thank you for your feedback!");
      setFeedback("");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  
  const getRiskColor = () => {
    switch (report.risk_appetite) {
      case "Conservative":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Aggressive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Investment Report</CardTitle>
            <CardDescription>
              Generated on {formatDate(report.created_at)} | Investment Horizon: {report.investment_horizon} years
            </CardDescription>
          </div>
          <Badge className={`${getRiskColor()} text-xs px-3 py-1 rounded-full`}>
            {report.risk_appetite}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Investment Horizon
            </p>
            <p className="text-xl font-medium">{report.investment_horizon} years</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Wallet className="h-4 w-4" /> Annual Income
            </p>
            <p className="text-xl font-medium">₹{report.income_level.toLocaleString("en-IN")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Risk Level
            </p>
            <p className="text-xl font-medium">{report.risk_appetite}</p>
          </div>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="allocation" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="projection">Performance Projection</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Recommended Allocation</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Equity</span>
                    <span className="font-medium">{assetAllocation.equity}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Debt</span>
                    <span className="font-medium">{assetAllocation.debt}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Gold</span>
                    <span className="font-medium">{assetAllocation.gold}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cash</span>
                    <span className="font-medium">{assetAllocation.cash}%</span>
                  </li>
                </ul>
              </div>
              <div className="h-[250px]">
                <Chart 
                  type="pie"
                  data={{
                    labels: Object.keys(assetAllocation),
                    datasets: [
                      {
                        data: Object.values(assetAllocation),
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.8)',  // blue for equity
                          'rgba(75, 192, 192, 0.8)',  // teal for debt
                          'rgba(255, 206, 86, 0.8)',  // yellow for gold
                          'rgba(232, 232, 232, 0.8)',  // light gray for cash
                        ],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projection" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Expected Returns</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>1 Year</span>
                    <span className="font-medium text-green-600">+{performanceProjection.year1}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>3 Years</span>
                    <span className="font-medium text-green-600">+{performanceProjection.year3}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>5 Years</span>
                    <span className="font-medium text-green-600">+{performanceProjection.year5}%</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  Expected CAGR over your {report.investment_horizon} year horizon
                </p>
              </div>
              <div className="h-[250px]">
                <Chart 
                  type="bar"
                  data={{
                    labels: ['1 Year', '3 Years', '5 Years'],
                    datasets: [
                      {
                        label: 'Expected Returns (%)',
                        data: [
                          performanceProjection.year1,
                          performanceProjection.year3,
                          performanceProjection.year5
                        ],
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-1">Volatility</h3>
                  <p className="text-2xl font-bold">{riskAssessment.volatility}</p>
                  <p className="text-sm text-muted-foreground">
                    Expected price fluctuations
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-1">Max Drawdown</h3>
                  <p className="text-2xl font-bold">{riskAssessment.drawdown}</p>
                  <p className="text-sm text-muted-foreground">
                    Potential largest drop
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-1">Recovery Period</h3>
                  <p className="text-2xl font-bold">{riskAssessment.recoveryPeriod}</p>
                  <p className="text-sm text-muted-foreground">
                    Time to recover from drops
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="text-lg font-medium mb-2">Risk Assessment Summary</h3>
                <p className="text-sm">
                  {report.risk_appetite === 'Conservative' && (
                    "This conservative portfolio is designed to minimize volatility and preserve capital. While it offers lower returns compared to more aggressive allocations, it protects against significant market downturns and is appropriate for investors with a low risk tolerance or shorter investment horizons."
                  )}
                  {report.risk_appetite === 'Moderate' && (
                    "This balanced portfolio offers a moderate level of risk while seeking reasonable returns. It's designed to provide growth potential while still maintaining some stability, making it appropriate for investors with medium-term horizons who can tolerate some volatility."
                  )}
                  {report.risk_appetite === 'Aggressive' && (
                    "This aggressive portfolio focuses on maximizing growth potential through higher equity allocation. It comes with increased volatility and potential for larger drawdowns, but historically provides higher long-term returns. This approach is best suited for investors with longer time horizons and higher risk tolerance."
                  )}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        <Separator />
        
        <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-start md:items-center">
          <div className="space-y-2 w-full md:w-3/4">
            <p className="text-sm font-medium">Share your feedback on this report</p>
            <Textarea 
              placeholder="What did you think of this investment report? How could we improve it?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full md:w-auto self-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleFeedbackSubmit()} 
              disabled={isSubmittingFeedback || !feedback.trim()}
            >
              {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center w-full pt-2">
          <div className="flex space-x-1">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2 items-center">
            <span className="text-sm text-muted-foreground">Was this helpful?</span>
            <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700">
              <ThumbsUp className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
              <ThumbsDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 