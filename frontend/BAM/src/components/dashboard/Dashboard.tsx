import { AssetAllocation } from './AssetAllocation';
import { useInvestmentReport } from '@/lib/contexts/InvestmentReportContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChartPieIcon, TrendingUp, Shield, BarChart4 } from 'lucide-react';

export function Dashboard() {
  const { report } = useInvestmentReport();
  const navigate = useNavigate();
  const hasReport = !!report;
  
  const handleCreateReport = () => {
    navigate('/dashboard/investment-report');
  };
  
  if (!hasReport) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Wealth Dashboard</h1>
        
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to BAM!</CardTitle>
            <CardDescription>
              Create your investment report to unlock personalized financial insights and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your dashboard is empty because you haven't created an investment report yet. 
              Generate a report to see your personalized asset allocation, investment recommendations,
              and financial insights.
            </p>
            <Button onClick={handleCreateReport} className="flex items-center gap-2">
              Create Investment Report <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the timestamp
  const reportDate = report ? new Date(report.timestamp).toLocaleDateString() : '';
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Wealth Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Report generated: {reportDate}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Risk Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Risk Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {report.risk_analysis.risk_category}
                <Badge>{report.risk_analysis.risk_score}</Badge>
              </div>
              {report.risk_analysis.risk_attitude && (
                <div className="text-sm text-muted-foreground">{report.risk_analysis.risk_attitude}</div>
              )}
            </CardContent>
          </Card>
          
          {report.risk_analysis.risk_capacity && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Risk Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.risk_analysis.risk_capacity}</div>
                <Progress className="mt-2" value={report.risk_analysis.risk_capacity} />
                <div className="text-xs text-muted-foreground mt-1">Your ability to take on risk</div>
              </CardContent>
            </Card>
          )}
          
          {report.risk_analysis.risk_requirement && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Risk Requirement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.risk_analysis.risk_requirement}</div>
                <Progress className="mt-2" value={report.risk_analysis.risk_requirement} />
                <div className="text-xs text-muted-foreground mt-1">Risk needed for your goals</div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Asset Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetAllocation />
          
          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.market_analysis.market_trends.slice(0, 5).map((trend, index) => (
                  <li key={index} className="text-sm">
                    • {trend}
                  </li>
                ))}
              </ul>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => navigate('/dashboard/investment-report')}
                className="mt-4 px-0"
              >
                View All Insights
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Investment Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-primary" />
              Recommended Investments
            </CardTitle>
            <CardDescription>
              Based on your risk profile and financial goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.recommendations.specific_recommendations.slice(0, 3).map((rec, index) => (
                <Card key={index} className="border bg-muted/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{rec.instrument}</CardTitle>
                      <Badge variant="outline">{rec.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="mb-2">
                      <span className="text-muted-foreground">Allocation: </span>
                      <span className="font-medium">{rec.allocation}%</span>
                    </div>
                    {rec.projected_return && (
                      <div>
                        <span className="text-muted-foreground">Projected Return: </span>
                        <span className="font-medium">{rec.projected_return.min}% - {rec.projected_return.max}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/investment-report')}
            >
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
