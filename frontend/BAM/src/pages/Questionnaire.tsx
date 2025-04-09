import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLoading } from "@/lib/LoadingContext";

export default function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { showLoading, hideLoading } = useLoading();
  
  // Cleanup on unmount
  useEffect(() => {
    return () => hideLoading();
  }, [hideLoading]);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    age: "",
    occupation: "",
    monthlyIncome: "",
    cityOfResidence: "",
    
    // Financial Goals
    financialGoals: [] as string[],
    primaryGoalTimeframe: "",
    
    // Savings & Investments
    monthlySavings: "",
    currentInvestments: [] as string[],
    riskAppetite: "",
    
    // Liabilities & Expenses
    activeLoans: [] as string[],
    monthlyExpense: "",
    emergencyFund: "",
    
    // Financial Awareness & Preferences
    expenseTracking: "",
    planningPreference: "",
    interests: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...(formData[field as keyof typeof formData] as string[]), value]
      });
    } else {
      setFormData({
        ...formData,
        [field]: (formData[field as keyof typeof formData] as string[]).filter(item => item !== value)
      });
    }
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      showLoading();
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        hideLoading(); // Hide loader after state updates
      }, 300);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      showLoading();
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        hideLoading(); // Hide loader after state updates
      }, 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showLoading();
    
    // Save questionnaire data (in a real app, you would send this to your backend)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...user, questionnaire: formData, isNewUser: false }));
    
    toast.success("Questionnaire completed! Redirecting to dashboard.");
    setTimeout(() => {
      hideLoading(); // Hide loader before navigation
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 bg-background relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-4xl">
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Personal Finance Questionnaire</CardTitle>
            <CardDescription className="text-center">
              Help us understand your financial situation and goals
            </CardDescription>
            <div className="flex justify-center my-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-1 mx-1 rounded-full ${
                    index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Section 1: Personal Information</h3>
                  
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income (Post-Tax) in ₹</Label>
                    <Input
                      id="monthlyIncome"
                      name="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cityOfResidence">City of Residence</Label>
                    <Input
                      id="cityOfResidence"
                      name="cityOfResidence"
                      value={formData.cityOfResidence}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Section 2: Financial Goals</h3>
                  
                  <div>
                    <Label className="mb-2 block">What are your top 3 financial goals?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "house", label: "Buying a house" },
                        { id: "retirement", label: "Retirement planning" },
                        { id: "education", label: "Child's education" },
                        { id: "wealth", label: "Wealth growth" },
                        { id: "emergency", label: "Emergency fund" },
                        { id: "travel", label: "Vacation/Travel" },
                        { id: "other", label: "Other" }
                      ].map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={goal.id}
                            checked={formData.financialGoals.includes(goal.id)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("financialGoals", goal.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={goal.id}
                            className="text-sm font-normal"
                          >
                            {goal.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">In how many years do you want to achieve your primary goal?</Label>
                    <RadioGroup
                      value={formData.primaryGoalTimeframe}
                      onValueChange={(value) => handleRadioChange("primaryGoalTimeframe", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-2 years" id="t1" />
                        <Label htmlFor="t1" className="text-sm font-normal">1-2 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3-5 years" id="t2" />
                        <Label htmlFor="t2" className="text-sm font-normal">3-5 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6-10 years" id="t3" />
                        <Label htmlFor="t3" className="text-sm font-normal">6-10 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="More than 10 years" id="t4" />
                        <Label htmlFor="t4" className="text-sm font-normal">More than 10 years</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Section 3: Savings & Investments</h3>
                  
                  <div>
                    <Label htmlFor="monthlySavings">How much do you save monthly (on average) in ₹?</Label>
                    <Input
                      id="monthlySavings"
                      name="monthlySavings"
                      type="number"
                      value={formData.monthlySavings}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">Where do you currently invest? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "fd", label: "Fixed Deposits" },
                        { id: "mf", label: "Mutual Funds (SIP/Lumpsum)" },
                        { id: "stocks", label: "Stocks" },
                        { id: "gold", label: "Gold" },
                        { id: "realestate", label: "Real Estate" },
                        { id: "crypto", label: "Crypto" },
                        { id: "ppf", label: "Public Provident Fund (PPF)" },
                        { id: "none", label: "Not investing yet" }
                      ].map((investment) => (
                        <div key={investment.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={investment.id}
                            checked={formData.currentInvestments.includes(investment.id)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("currentInvestments", investment.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={investment.id}
                            className="text-sm font-normal"
                          >
                            {investment.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">How would you describe your risk appetite?</Label>
                    <RadioGroup
                      value={formData.riskAppetite}
                      onValueChange={(value) => handleRadioChange("riskAppetite", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="r1" />
                        <Label htmlFor="r1" className="text-sm font-normal">Low (Prefer capital protection)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="r2" />
                        <Label htmlFor="r2" className="text-sm font-normal">Medium (Balanced growth & safety)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="r3" />
                        <Label htmlFor="r3" className="text-sm font-normal">High (Aggressive growth, okay with market fluctuations)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Section 4: Liabilities & Expenses</h3>
                  
                  <div>
                    <Label className="mb-2 block">Do you have any active loans?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "home", label: "Home Loan" },
                        { id: "education", label: "Education Loan" },
                        { id: "personal", label: "Personal Loan" },
                        { id: "credit", label: "Credit Card Dues" },
                        { id: "none", label: "No loans" }
                      ].map((loan) => (
                        <div key={loan.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={loan.id}
                            checked={formData.activeLoans.includes(loan.id)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("activeLoans", loan.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={loan.id}
                            className="text-sm font-normal"
                          >
                            {loan.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="monthlyExpense">What is your average monthly expense in ₹?</Label>
                    <Input
                      id="monthlyExpense"
                      name="monthlyExpense"
                      type="number"
                      value={formData.monthlyExpense}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">Do you have an emergency fund?</Label>
                    <RadioGroup
                      value={formData.emergencyFund}
                      onValueChange={(value) => handleRadioChange("emergencyFund", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="e1" />
                        <Label htmlFor="e1" className="text-sm font-normal">Yes, covers 6+ months of expenses</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id="e2" />
                        <Label htmlFor="e2" className="text-sm font-normal">Somewhat, covers 2–3 months</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="e3" />
                        <Label htmlFor="e3" className="text-sm font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
              
              {currentStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Section 5: Financial Awareness & Preferences</h3>
                  
                  <div>
                    <Label className="mb-2 block">How often do you track your expenses?</Label>
                    <RadioGroup
                      value={formData.expenseTracking}
                      onValueChange={(value) => handleRadioChange("expenseTracking", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="track1" />
                        <Label htmlFor="track1" className="text-sm font-normal">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="track2" />
                        <Label htmlFor="track2" className="text-sm font-normal">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="track3" />
                        <Label htmlFor="track3" className="text-sm font-normal">Monthly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id="track4" />
                        <Label htmlFor="track4" className="text-sm font-normal">Rarely/Never</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">Do you prefer manual or automated financial planning tools?</Label>
                    <RadioGroup
                      value={formData.planningPreference}
                      onValueChange={(value) => handleRadioChange("planningPreference", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="plan1" />
                        <Label htmlFor="plan1" className="text-sm font-normal">Manual (Spreadsheets, notebooks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="automated" id="plan2" />
                        <Label htmlFor="plan2" className="text-sm font-normal">Automated (Apps, advisors)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">Are you interested in:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "tax", label: "Tax-saving strategies" },
                        { id: "retirement", label: "Retirement planning" },
                        { id: "goals", label: "Goal-based investing" },
                        { id: "portfolio", label: "Portfolio review" },
                        { id: "budget", label: "Budget tracking" },
                        { id: "insurance", label: "Insurance planning" }
                      ].map((interest) => (
                        <div key={interest.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={interest.id}
                            checked={formData.interests.includes(interest.id)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("interests", interest.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={interest.id}
                            className="text-sm font-normal"
                          >
                            {interest.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={previousStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>Next</Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>Submit</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
