import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "@/components/ThemeProvider";
import { useInvestmentReport } from "@/lib/contexts/InvestmentReportContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChartPieIcon } from "lucide-react";

interface AssetData {
  name: string;
  value: number;
  color: string;
}

// Color scheme for assets
const assetColors = {
  "equity": "#387ed1",
  "debt": "#6c2bd9",
  "gold": "#f59e0b",
  "cash": "#10b981",
  "bonds": "#8b5cf6",
  "real_estate": "#f43f5e",
  "commodities": "#eab308",
  "international": "#0ea5e9",
  "fixed_income": "#a16207",
  "alternative": "#d946ef"
};

export function AssetAllocation() {
  const { theme } = useTheme();
  const { report } = useInvestmentReport();
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? '#fff' : '#1c1c1c';
  
  // Convert report asset allocation to chart data format
  const getAssetAllocationData = () => {
    if (!report || !report.recommendations.asset_allocation) {
      return [];
    }
    
    // Create sorted asset data from the report's asset allocation
    return Object.entries(report.recommendations.asset_allocation)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '), // Capitalize and format name
        value,
        color: assetColors[name.toLowerCase()] || "#888888" // Use default color map or fallback
      }))
      .sort((a, b) => b.value - a.value); // Sort by descending value
  };
  
  const assetData = getAssetAllocationData();
  const hasData = assetData.length > 0;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <ChartPieIcon className="h-5 w-5 text-primary" />
          Asset Allocation
        </CardTitle>
        {!hasData && (
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => navigate('/dashboard/investment-report')}
            className="text-xs"
          >
            Create Investment Plan
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span style={{color: textColor}}>{value}</span>}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Allocation']}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff',
                    borderColor: theme === 'dark' ? '#2a2e35' : '#e6e6e6',
                    color: textColor,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] flex flex-col items-center justify-center space-y-3 text-center">
            <p className="text-muted-foreground">No asset allocation data available.</p>
            <p className="text-sm text-muted-foreground">Create an investment report to get personalized asset allocation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
