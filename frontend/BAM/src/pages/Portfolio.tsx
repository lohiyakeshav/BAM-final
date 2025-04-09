
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stock {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  avgPrice: string;
  currentPrice: string;
  value: string;
  pnl: string;
  pnlPercent: number;
  dayChange: number;
}

const portfolioData: Stock[] = [
  {
    id: "stock-001",
    name: "HDFC Bank",
    symbol: "HDFCBANK",
    quantity: 150,
    avgPrice: "₹1,520.75",
    currentPrice: "₹1,642.50",
    value: "₹2,46,375",
    pnl: "₹18,262",
    pnlPercent: 8.01,
    dayChange: 0.95,
  },
  {
    id: "stock-002",
    name: "Reliance Industries",
    symbol: "RELIANCE",
    quantity: 100,
    avgPrice: "₹2,320.50",
    currentPrice: "₹2,412.75",
    value: "₹2,41,275",
    pnl: "₹9,225",
    pnlPercent: 3.98,
    dayChange: -0.34,
  },
  {
    id: "stock-003",
    name: "Infosys",
    symbol: "INFY",
    quantity: 100,
    avgPrice: "₹1,320.40",
    currentPrice: "₹1,478.20",
    value: "₹1,47,820",
    pnl: "₹15,780",
    pnlPercent: 11.95,
    dayChange: 1.95,
  },
  {
    id: "stock-004",
    name: "ICICI Bank",
    symbol: "ICICIBANK",
    quantity: 150,
    avgPrice: "₹880.30",
    currentPrice: "₹945.75",
    value: "₹1,41,863",
    pnl: "₹9,818",
    pnlPercent: 7.44,
    dayChange: 0.60,
  },
  {
    id: "stock-005",
    name: "TCS",
    symbol: "TCS",
    quantity: 30,
    avgPrice: "₹3,450.20",
    currentPrice: "₹3,562.40",
    value: "₹1,06,872",
    pnl: "₹3,366",
    pnlPercent: 3.25,
    dayChange: -0.36,
  },
  {
    id: "stock-006",
    name: "Bajaj Finance",
    symbol: "BAJFINANCE",
    quantity: 60,
    avgPrice: "₹6,780.50",
    currentPrice: "₹7,120.30",
    value: "₹4,27,218",
    pnl: "₹20,388",
    pnlPercent: 5.01,
    dayChange: 1.25,
  },
  {
    id: "stock-007",
    name: "Asian Paints",
    symbol: "ASIANPAINT",
    quantity: 75,
    avgPrice: "₹3,120.75",
    currentPrice: "₹2,980.40",
    value: "₹2,23,530",
    pnl: "-₹10,526",
    pnlPercent: -4.50,
    dayChange: -0.82,
  },
];

const Portfolio = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Holdings</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹14,22,350</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹15,43,872</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₹1,21,522</div>
            <div className="text-sm text-green-500">+8.54%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Day Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₹12,450</div>
            <div className="text-sm text-green-500">+0.81%</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>All Holdings</CardTitle>
          <CardDescription>Your complete portfolio of stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">Day Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioData.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>
                    <div className="font-medium">{stock.name}</div>
                    <div className="text-xs text-muted-foreground">{stock.symbol}</div>
                  </TableCell>
                  <TableCell className="text-right">{stock.quantity}</TableCell>
                  <TableCell className="text-right">{stock.avgPrice}</TableCell>
                  <TableCell className="text-right">{stock.currentPrice}</TableCell>
                  <TableCell className="text-right">{stock.value}</TableCell>
                  <TableCell className="text-right">
                    <div className={stock.pnlPercent >= 0 ? "text-green-500" : "text-red-500"}>
                      {stock.pnl}
                    </div>
                    <div className="text-xs">
                      <span
                        className={stock.pnlPercent >= 0 ? "text-green-500" : "text-red-500"}
                      >
                        {stock.pnlPercent >= 0 ? "+" : ""}
                        {stock.pnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {stock.dayChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={stock.dayChange > 0 ? "text-green-500" : "text-red-500"}
                      >
                        {stock.dayChange > 0 ? "+" : ""}
                        {stock.dayChange.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
