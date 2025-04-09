
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface Holding {
  name: string;
  symbol: string;
  price: string;
  change: number;
  changePercent: number;
  value: string;
  allocation: number;
}

const holdings: Holding[] = [
  {
    name: "HDFC Bank",
    symbol: "HDFCBANK",
    price: "₹1,642.50",
    change: 15.40,
    changePercent: 0.95,
    value: "₹2,46,375",
    allocation: 16.0,
  },
  {
    name: "Reliance Industries",
    symbol: "RELIANCE",
    price: "₹2,412.75",
    change: -8.25,
    changePercent: -0.34,
    value: "₹2,41,275",
    allocation: 15.6,
  },
  {
    name: "Infosys",
    symbol: "INFY",
    price: "₹1,478.20",
    change: 28.30,
    changePercent: 1.95,
    value: "₹1,47,820",
    allocation: 9.6,
  },
  {
    name: "ICICI Bank",
    symbol: "ICICIBANK",
    price: "₹945.75",
    change: 5.60,
    changePercent: 0.60,
    value: "₹1,41,863",
    allocation: 9.2,
  },
  {
    name: "TCS",
    symbol: "TCS",
    price: "₹3,562.40",
    change: -12.80,
    changePercent: -0.36,
    value: "₹1,06,872",
    allocation: 6.9,
  },
];

export function TopHoldings() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Top Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">LTP</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Allocation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell>
                  <div className="font-medium">{holding.name}</div>
                  <div className="text-xs text-muted-foreground">{holding.symbol}</div>
                </TableCell>
                <TableCell className="text-right">{holding.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {holding.changePercent > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={holding.changePercent > 0 ? "text-green-500" : "text-red-500"}
                    >
                      {holding.changePercent > 0 ? "+" : ""}
                      {holding.change.toFixed(2)} ({holding.changePercent > 0 ? "+" : ""}
                      {holding.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{holding.value}</TableCell>
                <TableCell className="text-right">{holding.allocation.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
