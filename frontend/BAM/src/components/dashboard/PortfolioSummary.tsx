
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card className="animate-slide-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-6 w-6 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : null}
            <span className={trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : ""}>
              {change}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function PortfolioSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Portfolio Value"
        value="₹15,43,872"
        change="↑ 2.5% from yesterday"
        icon={<BarChart3 className="h-5 w-5" />}
        trend="up"
      />
      <StatCard
        title="Today's Gain/Loss"
        value="+₹12,450"
        change="↑ 0.8% change"
        icon={<ArrowUpRight className="h-5 w-5" />}
        trend="up"
      />
      <StatCard
        title="Realized Returns"
        value="₹2,84,350"
        change="↑ 18.5% return"
        icon={<TrendingUp className="h-5 w-5" />}
        trend="up"
      />
      <StatCard
        title="Unrealized P&L"
        value="₹1,24,270"
        change="↑ 8.1% gain"
        icon={<TrendingUp className="h-5 w-5" />}
        trend="up"
      />
    </div>
  );
}
