import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Chart } from "@/components/charts/Chart";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Wallet, 
  Share2,
  Download,
  Printer
} from "lucide-react";

// Use the same interface defined in ReportGenerator
interface InvestmentReport {
  riskAssessment: {
    level: string;
    factors: string[];
    description: string;
    volatility: string;
    drawdown: string;
    recoveryPeriod: string;
  };
  assetAllocation: Record<string, number>;
  performanceProjections: any[];
  recommendations: string[];
  marketAnalysis?: {
    market_trends: string[];
    key_insights: string[];
    impact_analysis: string[];
    sector_performance: Record<string, string>;
  };
  // For backward compatibility
  investment_horizon?: number;
  income_level?: number;
  created_at?: string;
  // Performance projection data
  performance_projection?: {
    year1: number;
    year3: number;
    year5: number;
  };
}

interface InvestmentReportViewProps {
  report: InvestmentReport;
}

export default function InvestmentReportView({ report }: InvestmentReportViewProps) {
  const [activeTab, setActiveTab] = useState("allocation");
  
  const getRiskColor = () => {
    switch (report.riskAssessment.level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle both old and new data formats
  const getAssetAllocation = () => {
    if (report.assetAllocation) {
      return report.assetAllocation;
    }
    return report.performance_projection ? {
      equity: 0,
      debt: 0,
      gold: 0,
      cash: 0
    } : {};
  };

  // Get performance data in a consistent format
  const getPerformanceData = () => {
    if (report.performance_projection) {
      return {
        year1: report.performance_projection.year1,
        year3: report.performance_projection.year3,
        year5: report.performance_projection.year5
      };
    }
    // Default values if not available
    return {
      year1: 5,
      year3: 15,
      year5: 25
    };
  };

  const assetAllocation = getAssetAllocation();
  const performanceData = getPerformanceData();
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Investment Report</CardTitle>
            <CardDescription>
              Generated on {formatDate(report.created_at || new Date().toISOString())} | 
              Investment Horizon: {report.investment_horizon || 5} years
            </CardDescription>
          </div>
          <Badge className={`${getRiskColor()} text-xs px-3 py-1 rounded-full`}>
            {report.riskAssessment.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Investment Horizon
            </p>
            <p className="text-xl font-medium">{report.investment_horizon || 5} years</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Wallet className="h-4 w-4" /> Annual Income
            </p>
            <p className="text-xl font-medium">₹{(report.income_level || 0).toLocaleString("en-IN")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Risk Level
            </p>
            <p className="text-xl font-medium">{report.riskAssessment.level}</p>
          </div>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="allocation" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="projection">Performance Projection</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Recommended Allocation</h3>
                <ul className="space-y-2">
                  {Object.entries(assetAllocation).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="font-medium">{value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-[250px]">
                <Chart 
                  type="pie"
                  data={{
                    labels: Object.keys(assetAllocation).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
                    datasets: [
                      {
                        data: Object.values(assetAllocation),
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.8)',  // blue for equity
                          'rgba(75, 192, 192, 0.8)',  // teal for debt
                          'rgba(255, 206, 86, 0.8)',  // yellow for gold
                          'rgba(232, 232, 232, 0.8)',  // light gray for cash
                          'rgba(153, 102, 255, 0.8)',  // purple for any additional category
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
                    <span className="font-medium text-green-600">+{performanceData.year1}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>3 Years</span>
                    <span className="font-medium text-green-600">+{performanceData.year3}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>5 Years</span>
                    <span className="font-medium text-green-600">+{performanceData.year5}%</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  Expected CAGR over your {report.investment_horizon || 5} year horizon
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
                          performanceData.year1,
                          performanceData.year3,
                          performanceData.year5
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
                  <p className="text-2xl font-bold">{report.riskAssessment.volatility}</p>
                  <p className="text-sm text-muted-foreground">
                    Expected price fluctuations
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-1">Max Drawdown</h3>
                  <p className="text-2xl font-bold">{report.riskAssessment.drawdown}</p>
                  <p className="text-sm text-muted-foreground">
                    Potential largest drop
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-1">Recovery Period</h3>
                  <p className="text-2xl font-bold">{report.riskAssessment.recoveryPeriod}</p>
                  <p className="text-sm text-muted-foreground">
                    Time to recover from drops
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="text-lg font-medium mb-2">Risk Assessment Summary</h3>
                <p className="text-sm">
                  {report.riskAssessment.description || (
                    <>
                      {report.riskAssessment.level.toLowerCase() === 'low' && (
                        "This conservative portfolio is designed to minimize volatility and preserve capital. While it offers lower returns compared to more aggressive allocations, it protects against significant market downturns and is appropriate for investors with a low risk tolerance or shorter investment horizons."
                      )}
                      {report.riskAssessment.level.toLowerCase() === 'medium' && (
                        "This balanced portfolio offers a moderate level of risk while seeking reasonable returns. It's designed to provide growth potential while still maintaining some stability, making it appropriate for investors with medium-term horizons who can tolerate some volatility."
                      )}
                      {report.riskAssessment.level.toLowerCase() === 'high' && (
                        "This aggressive portfolio focuses on maximizing growth potential through higher equity allocation. It comes with increased volatility and potential for larger drawdowns, but historically provides higher long-term returns. This approach is best suited for investors with longer time horizons and higher risk tolerance."
                      )}
                    </>
                  )}
                </p>
                
                {report.riskAssessment.factors && report.riskAssessment.factors.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Key Risk Factors:</h4>
                    <ul className="text-xs list-disc pl-5">
                      {report.riskAssessment.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="market" className="py-4">
            <div className="space-y-6">
              {report.marketAnalysis && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Market Trends</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {report.marketAnalysis.market_trends.map((trend, index) => (
                            <li key={index}>{trend}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {report.marketAnalysis.key_insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Impact Analysis</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {report.marketAnalysis.impact_analysis.map((impact, index) => (
                            <li key={index}>{impact}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Sector Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(report.marketAnalysis.sector_performance).map(([sector, performance], index) => (
                            <div key={index} className="p-3 rounded-lg border">
                              <h4 className="font-medium capitalize">{sector}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{performance}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-1">
              {report.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        <Separator />
        
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
        </div>
      </CardFooter>
    </Card>
  );
} 