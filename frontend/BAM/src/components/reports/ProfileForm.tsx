import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/lib/services/aiService";
import { Slider } from "@/components/ui/slider";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    riskAppetite: 'Moderate',
    investmentHorizon: 5,
    incomeLevel: 1000000,
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
              value={[profile.investmentHorizon]}
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
            />
            <p className="text-sm text-muted-foreground">
              Your annual income helps us tailor recommendations to your financial situation
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