import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Updated profile interface
export interface UserProfile {
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentHorizon: string | number;
  incomeLevel: number;
  age?: number;
  monthlyInvestment?: string | number;
}

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    riskAppetite: 'Moderate',
    investmentHorizon: 5,
    incomeLevel: 1000000,
    age: 30,
    monthlyInvestment: 10000,
  });

  const handleRiskChange = (value: string) => {
    setProfile({
      ...profile,
      riskAppetite: value as 'Conservative' | 'Moderate' | 'Aggressive',
    });
  };

  const handleHorizonChange = (value: number[]) => {
    setProfile({
      ...profile,
      investmentHorizon: value[0],
    });
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setProfile({
        ...profile,
        incomeLevel: value,
      });
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setProfile({
        ...profile,
        age: value,
      });
    }
  };

  const handleMonthlyInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setProfile({
        ...profile,
        monthlyInvestment: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Investment Profile</CardTitle>
        <CardDescription>
          Provide your investment preferences to generate a personalized report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={18}
              max={100}
              value={profile.age}
              onChange={handleAgeChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Your age helps us tailor recommendations to your life stage
            </p>
          </div>

          {/* Risk Appetite */}
          <div className="space-y-2">
            <Label htmlFor="risk-appetite">Risk Appetite</Label>
            <Select 
              value={profile.riskAppetite} 
              onValueChange={handleRiskChange}
            >
              <SelectTrigger id="risk-appetite">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conservative">Conservative</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {profile.riskAppetite === 'Conservative' && "Lower risk, more stable returns"}
              {profile.riskAppetite === 'Moderate' && "Balanced risk and return potential"}
              {profile.riskAppetite === 'Aggressive' && "Higher risk, potential for greater returns"}
            </p>
          </div>

          {/* Investment Horizon */}
          <div className="space-y-2">
            <Label htmlFor="investment-horizon">Investment Horizon (Years): {profile.investmentHorizon}</Label>
            <Slider
              id="investment-horizon"
              min={1}
              max={20}
              step={1}
              value={[typeof profile.investmentHorizon === 'string' ? parseInt(profile.investmentHorizon) : profile.investmentHorizon]}
              onValueChange={handleHorizonChange}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 year</span>
              <span>20 years</span>
            </div>
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <Label htmlFor="income-level">Annual Income (₹)</Label>
            <Input
              id="income-level"
              type="number"
              min={100000}
              step={100000}
              value={profile.incomeLevel}
              onChange={handleIncomeChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Your annual income helps us tailor recommendations to your financial situation
            </p>
          </div>

          {/* Monthly Investment */}
          <div className="space-y-2">
            <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
            <Input
              id="monthly-investment"
              type="number"
              min={1000}
              step={1000}
              value={profile.monthlyInvestment}
              onChange={handleMonthlyInvestmentChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              How much you plan to invest each month
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating Report..." : "Generate Investment Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 