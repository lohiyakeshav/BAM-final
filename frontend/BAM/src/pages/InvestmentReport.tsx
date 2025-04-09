import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { apiRequest, API_ENDPOINTS } from "@/lib/utils/api";
import { useInvestmentReport, UserProfile, InvestmentReport as IInvestmentReport } from "@/lib/contexts/InvestmentReportContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function InvestmentReport() {
  const { 
    profile, 
    setProfile, 
    report, 
    setReport, 
    isGenerating, 
    setIsGenerating, 
    error, 
    setError 
  } = useInvestmentReport();
  
  const [activeTab, setActiveTab] = useState(report ? "report" : "form");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  
  // Feedback state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { user } = useAuth();
  
  // Set up progress simulation when generating
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating) {
      let progress = 0;
      interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 95) {
          progress = 95; // Cap at 95% until actual completion
          clearInterval(interval);
        }
        setGenerationProgress(progress);
        
        // Update status messages based on progress
        if (progress < 20) {
          setGenerationStatus("Analyzing your financial profile...");
        } else if (progress < 40) {
          setGenerationStatus("Calculating risk tolerance and capacity...");
        } else if (progress < 60) {
          setGenerationStatus("Researching market conditions...");
        } else if (progress < 80) {
          setGenerationStatus("Formulating investment recommendations...");
        } else {
          setGenerationStatus("Finalizing your personalized investment report...");
        }
      }, 500);
    } else {
      setGenerationProgress(0);
      setGenerationStatus("");
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalChange = (index: number, field: keyof UserProfile['goals'][0], value: any) => {
    setProfile(prev => {
      const updatedGoals = [...prev.goals];
      updatedGoals[index] = {
        ...updatedGoals[index],
        [field]: value
      };
      return {
        ...prev,
        goals: updatedGoals
      };
    });
  };

  const addGoal = () => {
    setProfile(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        {
          type: "other",
          target_amount: 0,
          timeline: 5
        }
      ]
    }));
  };

  const removeGoal = (index: number) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };
  
  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Format the request to match the backend's UserProfile structure
      const userProfile = {
        age: profile.age,
        income: profile.income,
        dependents: profile.dependents,
        investment_horizon: profile.investment_horizon,
        existing_investments: Object.entries(profile.existing_investments).map(([key, value]) => ({
          type: key,
          amount: value
        })),
        risk_tolerance: profile.risk_tolerance,
        goals: profile.goals.map(goal => ({
          type: goal.type,
          target_amount: goal.target_amount,
          timeline: goal.timeline
        }))
      };

      console.log("Sending request data:", userProfile);

      try {
        toast.info("Generating your investment report...");
        
        const response = await apiRequest<IInvestmentReport>(
          API_ENDPOINTS.WEALTH_MANAGEMENT,
          'POST',
          userProfile
        );

        if (response.error || !response.data) {
          throw new Error(response.error || `Failed to generate report`);
        }

        setGenerationProgress(100);
        setGenerationStatus("Report generated successfully!");
        
        const formattedReport = response.data;
        setReport(formattedReport);
        setActiveTab("report");
        toast.success("Investment report generated successfully!");
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error("Request timed out. Please try again.");
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setError(error instanceof Error ? error.message : "Failed to generate report. Please try again.");
      toast.error(error instanceof Error ? error.message : "Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateReport();
  };
  
  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    try {
      const response = await apiRequest(
        API_ENDPOINTS.FEEDBACK,
        'POST',
        {
          feedback_description: feedbackText
        }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setFeedbackOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Investment Report</h1>
      
      {isGenerating && (
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <h3 className="text-lg font-medium">Generating Investment Report</h3>
                  <p className="text-sm text-muted-foreground">{generationStatus}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={generationProgress} className="h-2" />
                <p className="text-xs text-right text-muted-foreground">{Math.round(generationProgress)}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="form">Profile Information</TabsTrigger>
          <TabsTrigger value="report" disabled={!report}>Investment Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Your Investment Profile</CardTitle>
              <CardDescription>
                Provide your financial details to generate a personalized investment report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  <p>{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="e.g., 35" 
                      value={profile.age}
                      onChange={(e) => handleProfileChange("age", Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income (₹)</Label>
                    <Input 
                      id="income" 
                      type="number" 
                      placeholder="e.g., 1200000" 
                      value={profile.income}
                      onChange={(e) => handleProfileChange("income", Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input 
                      id="dependents" 
                      type="number" 
                      placeholder="e.g., 2" 
                      value={profile.dependents}
                      onChange={(e) => handleProfileChange("dependents", Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="riskAppetite">Risk Appetite</Label>
                    <Select
                      value={profile.risk_tolerance}
                      onValueChange={(value) => handleProfileChange("risk_tolerance", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="investmentHorizon">Investment Horizon (years)</Label>
                    <Input 
                      id="investmentHorizon" 
                      type="number" 
                      placeholder="e.g., 5" 
                      value={profile.investment_horizon}
                      onChange={(e) => handleProfileChange("investment_horizon", Number(e.target.value))}
                      required
                    />
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="stocks">Current Stock Investments (₹)</Label>
                    <Input 
                      id="stocks" 
                      type="number" 
                      placeholder="e.g., 100000" 
                      value={profile.existing_investments.stocks || 0}
                      onChange={(e) => handleProfileChange("existing_investments", { 
                        ...profile.existing_investments, 
                        stocks: Number(e.target.value) 
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mutual_funds">Current Mutual Fund Investments (₹)</Label>
                    <Input 
                      id="mutual_funds" 
                      type="number" 
                      placeholder="e.g., 200000" 
                      value={profile.existing_investments.mutual_funds || 0}
                      onChange={(e) => handleProfileChange("existing_investments", { 
                        ...profile.existing_investments, 
                        mutual_funds: Number(e.target.value) 
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fixed_deposits">Current Fixed Deposits (₹)</Label>
                    <Input 
                      id="fixed_deposits" 
                      type="number" 
                      placeholder="e.g., 300000" 
                      value={profile.existing_investments.fixed_deposits || 0}
                      onChange={(e) => handleProfileChange("existing_investments", { 
                        ...profile.existing_investments, 
                        fixed_deposits: Number(e.target.value) 
                      })}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Financial Goals</h3>
                    <Button type="button" variant="outline" onClick={addGoal}>
                      Add Goal
                    </Button>
                  </div>
                  
                  {profile.goals.map((goal, index) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Goal #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeGoal(index)}
                          disabled={profile.goals.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`goal-type-${index}`}>Goal Type</Label>
                          <Select
                            value={goal.type}
                            onValueChange={(value) => handleGoalChange(index, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select goal type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retirement">Retirement</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="home">Home Purchase</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`goal-amount-${index}`}>Target Amount (₹)</Label>
                          <Input 
                            id={`goal-amount-${index}`} 
                            type="number" 
                            value={goal.target_amount}
                            onChange={(e) => handleGoalChange(index, "target_amount", Number(e.target.value))}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`goal-timeline-${index}`}>Timeline (years)</Label>
                          <Input 
                            id={`goal-timeline-${index}`} 
                            type="number" 
                            value={goal.timeline}
                            onChange={(e) => handleGoalChange(index, "timeline", Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button type="submit" className="w-full" disabled={isGenerating}>
                  Generate Investment Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="report">
          {!report ? (
            <Card className="w-full">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No investment report has been generated yet. Please fill out the form to generate a report.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Investment Analysis</h2>
                
                <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Give Feedback</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Share Your Feedback</DialogTitle>
                      <DialogDescription>
                        Help us improve your investment report experience. Your feedback is valuable to us.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="feedback">Feedback Description</Label>
                        <Textarea
                          id="feedback"
                          placeholder="Please share your thoughts, suggestions, or issues about the investment report..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={submitFeedback}
                        disabled={isSubmittingFeedback || !feedbackText.trim()}
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : 'Submit Feedback'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>
                    Your risk score: <Badge variant="outline">{report.risk_analysis.risk_score}</Badge>
                    <span className="ml-2">Category: <Badge>{report.risk_analysis.risk_category}</Badge></span>
                    {report.risk_analysis.risk_attitude && 
                      <span className="ml-2">Attitude: <Badge variant="secondary">{report.risk_analysis.risk_attitude}</Badge></span>
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.risk_analysis.risk_capacity && report.risk_analysis.risk_requirement && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 rounded-lg border">
                          <h3 className="text-sm font-medium mb-1">Risk Capacity</h3>
                          <div className="flex items-center">
                            <span className="text-xl font-bold">{report.risk_analysis.risk_capacity}</span>
                            <Progress className="ml-2 flex-grow" value={report.risk_analysis.risk_capacity} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Your ability to take on risk</p>
                        </div>
                        <div className="p-4 rounded-lg border">
                          <h3 className="text-sm font-medium mb-1">Risk Requirement</h3>
                          <div className="flex items-center">
                            <span className="text-xl font-bold">{report.risk_analysis.risk_requirement}</span>
                            <Progress className="ml-2 flex-grow" value={report.risk_analysis.risk_requirement} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Risk needed to achieve goals</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium mb-2">Key Risk Factors</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {report.risk_analysis.key_factors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Risk Management Recommendations</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {report.risk_analysis.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    {report.risk_analysis.risk_mitigation_strategies && report.risk_analysis.risk_mitigation_strategies.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Risk Mitigation Strategies</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {report.risk_analysis.risk_mitigation_strategies.map((strategy, index) => (
                            <li key={index}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Asset Allocation</CardTitle>
                  <CardDescription>
                    Based on your risk profile and investment horizon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(report.recommendations.asset_allocation).map(([asset, percentage]) => (
                      <div key={asset} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize">{asset}</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                  <CardDescription>
                    Current market trends and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Market Trends</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {report.market_analysis.market_trends.map((trend, index) => (
                          <li key={index}>{trend}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Key Insights</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {report.market_analysis.key_insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Impact Analysis</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {report.market_analysis.impact_analysis.map((impact, index) => (
                          <li key={index}>{impact}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Specific Investment Recommendations</CardTitle>
                  <CardDescription>
                    Detailed investment suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.recommendations.specific_recommendations.map((rec, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{rec.instrument}</h3>
                          <Badge>{rec.type}</Badge>
                        </div>
                        <p className="text-sm mb-2">{rec.reasoning}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Allocation:</span> {rec.allocation}%
                          </div>
                          {rec.projected_return && (
                            <div>
                              <span className="text-muted-foreground">Projected Return:</span> {rec.projected_return.min}% - {rec.projected_return.max}%
                            </div>
                          )}
                        </div>
                        
                        {rec.risk_factors && (
                          <div className="mt-2">
                            <span className="text-sm text-muted-foreground">Risk Factors:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rec.risk_factors.map((risk: string, i: number) => (
                                <Badge key={i} variant="outline">{risk}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 