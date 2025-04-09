
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "dividend";
  stock: string;
  date: string;
  amount: string;
  quantity?: number;
  price?: string;
}

const transactions: Transaction[] = [
  {
    id: "txn-001",
    type: "buy",
    stock: "Reliance Industries",
    date: "Apr 05, 2025",
    amount: "₹48,255",
    quantity: 20,
    price: "₹2,412.75",
  },
  {
    id: "txn-002",
    type: "sell",
    stock: "TCS",
    date: "Apr 03, 2025",
    amount: "₹35,624",
    quantity: 10,
    price: "₹3,562.40",
  },
  {
    id: "txn-003",
    type: "dividend",
    stock: "HDFC Bank",
    date: "Apr 01, 2025",
    amount: "₹2,800",
  },
  {
    id: "txn-004",
    type: "buy",
    stock: "Infosys",
    date: "Mar 28, 2025",
    amount: "₹29,564",
    quantity: 20,
    price: "₹1,478.20",
  },
];

export function RecentTransactions() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full mr-3 ${
                    transaction.type === "buy"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : transaction.type === "sell"
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
                  }`}
                >
                  {transaction.type === "buy" ? (
                    <ArrowDownRight className="h-5 w-5" />
                  ) : transaction.type === "sell" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    "$"
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.stock}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{transaction.amount}</div>
                <div className="flex items-center justify-end space-x-2">
                  <Badge
                    variant={
                      transaction.type === "buy"
                        ? "outline"
                        : transaction.type === "sell"
                        ? "secondary"
                        : "default"
                    }
                    className="capitalize"
                  >
                    {transaction.type}
                  </Badge>
                  {transaction.quantity && (
                    <span className="text-xs text-muted-foreground">
                      {transaction.quantity} @ {transaction.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
