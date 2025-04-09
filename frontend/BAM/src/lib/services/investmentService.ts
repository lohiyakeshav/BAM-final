interface UserProfile {
  age: string;
  income: string;
  riskAppetite: string;
  investmentHorizon: string;
  monthlyInvestment: string;
}

interface AssetAllocation {
  type: string;
  percentage: number;
  description: string;
}

interface RiskAssessment {
  level: string;
  description: string;
  factors: string[];
}

interface PerformanceProjection {
  year: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

interface InvestmentReport {
  assetAllocation: AssetAllocation[];
  riskAssessment: RiskAssessment;
  performanceProjections: PerformanceProjection[];
  recommendations: string[];
}

// Simulated market data
const MARKET_DATA = {
  conservative: {
    expectedReturn: 0.08, // 8% annual return
    volatility: 0.05, // 5% volatility
  },
  moderate: {
    expectedReturn: 0.12, // 12% annual return
    volatility: 0.10, // 10% volatility
  },
  aggressive: {
    expectedReturn: 0.15, // 15% annual return
    volatility: 0.15, // 15% volatility
  },
};

// Helper function to calculate compound interest with monthly contributions
const calculateCompoundInterest = (
  principal: number,
  monthlyContribution: number,
  rateOfReturn: number,
  years: number
): number => {
  const monthlyRate = rateOfReturn / 12;
  let futureValue = principal;

  for (let i = 0; i < years * 12; i++) {
    futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
  }

  return Math.round(futureValue);
};

export const generateInvestmentReport = async (profile: UserProfile): Promise<InvestmentReport> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const age = parseInt(profile.age);
  const income = parseInt(profile.income);
  const monthlyInvestment = parseInt(profile.monthlyInvestment);
  const investmentHorizon = parseInt(profile.investmentHorizon);

  // Generate asset allocation based on risk appetite
  const assetAllocation = generateAssetAllocation(profile.riskAppetite);

  // Generate risk assessment
  const riskAssessment = generateRiskAssessment(profile);

  // Generate performance projections
  const performanceProjections = generatePerformanceProjections(
    monthlyInvestment,
    investmentHorizon
  );

  // Generate recommendations
  const recommendations = generateRecommendations(profile);

  return {
    assetAllocation,
    riskAssessment,
    performanceProjections,
    recommendations,
  };
};

const generateAssetAllocation = (riskAppetite: string): AssetAllocation[] => {
  switch (riskAppetite) {
    case "conservative":
      return [
        { type: "Fixed Income", percentage: 60, description: "Government and corporate bonds" },
        { type: "Equity", percentage: 20, description: "Large-cap stocks" },
        { type: "Gold", percentage: 15, description: "Physical gold and gold ETFs" },
        { type: "Cash", percentage: 5, description: "High-yield savings" },
      ];
    case "moderate":
      return [
        { type: "Equity", percentage: 50, description: "Mix of large and mid-cap stocks" },
        { type: "Fixed Income", percentage: 30, description: "Corporate bonds" },
        { type: "Real Estate", percentage: 10, description: "REITs" },
        { type: "Gold", percentage: 5, description: "Gold ETFs" },
        { type: "Cash", percentage: 5, description: "Emergency fund" },
      ];
    case "aggressive":
      return [
        { type: "Equity", percentage: 70, description: "Growth stocks and small-caps" },
        { type: "Fixed Income", percentage: 15, description: "High-yield bonds" },
        { type: "Real Estate", percentage: 10, description: "Real estate investments" },
        { type: "Crypto", percentage: 5, description: "Bitcoin and major altcoins" },
      ];
    default:
      return [];
  }
};

const generateRiskAssessment = (profile: UserProfile): RiskAssessment => {
  const age = parseInt(profile.age);
  const factors = [];

  if (age < 30) factors.push("Young age allows for higher risk tolerance");
  if (age > 50) factors.push("Age suggests a more conservative approach");
  
  const monthlyInvestment = parseInt(profile.monthlyInvestment);
  const income = parseInt(profile.income);
  const investmentRatio = (monthlyInvestment * 12) / income;
  
  if (investmentRatio > 0.3) factors.push("High investment to income ratio");
  if (investmentRatio < 0.1) factors.push("Conservative investment to income ratio");

  return {
    level: profile.riskAppetite,
    description: `Based on your profile, you have a ${profile.riskAppetite} risk appetite.`,
    factors,
  };
};

const generatePerformanceProjections = (
  monthlyInvestment: number,
  years: number
): PerformanceProjection[] => {
  const projections: PerformanceProjection[] = [];

  for (let year = 1; year <= years; year++) {
    projections.push({
      year,
      conservative: calculateCompoundInterest(
        0,
        monthlyInvestment,
        MARKET_DATA.conservative.expectedReturn,
        year
      ),
      moderate: calculateCompoundInterest(
        0,
        monthlyInvestment,
        MARKET_DATA.moderate.expectedReturn,
        year
      ),
      aggressive: calculateCompoundInterest(
        0,
        monthlyInvestment,
        MARKET_DATA.aggressive.expectedReturn,
        year
      ),
    });
  }

  return projections;
};

const generateRecommendations = (profile: UserProfile): string[] => {
  const recommendations: string[] = [];
  const age = parseInt(profile.age);
  const monthlyInvestment = parseInt(profile.monthlyInvestment);
  const income = parseInt(profile.income);

  // Age-based recommendations
  if (age < 30) {
    recommendations.push(
      "Consider increasing equity exposure to benefit from long-term market growth"
    );
  } else if (age > 50) {
    recommendations.push(
      "Consider gradually shifting towards more conservative investments"
    );
  }

  // Investment-based recommendations
  const investmentRatio = (monthlyInvestment * 12) / income;
  if (investmentRatio < 0.2) {
    recommendations.push(
      "Consider increasing your monthly investment to build a stronger portfolio"
    );
  }

  // Risk-based recommendations
  if (profile.riskAppetite === "conservative") {
    recommendations.push(
      "Consider diversifying into high-grade corporate bonds for better returns"
    );
  } else if (profile.riskAppetite === "aggressive") {
    recommendations.push(
      "Ensure you maintain an emergency fund despite the aggressive investment strategy"
    );
  }

  return recommendations;
}; 