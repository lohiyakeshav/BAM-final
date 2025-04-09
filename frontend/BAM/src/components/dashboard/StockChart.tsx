
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/components/ThemeProvider';

interface StockData {
  name: string;
  value: number;
}

const mockStockData: StockData[] = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 4200 },
  { name: 'Mar', value: 4500 },
  { name: 'Apr', value: 4780 },
  { name: 'May', value: 4900 },
  { name: 'Jun', value: 5100 },
  { name: 'Jul', value: 5500 },
  { name: 'Aug', value: 5900 },
  { name: 'Sep', value: 6300 },
  { name: 'Oct', value: 6000 },
  { name: 'Nov', value: 6500 },
  { name: 'Dec', value: 6700 },
];

export function StockChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setData(mockStockData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const textColor = theme === 'dark' ? '#fff' : '#1c1c1c';
  const gridColor = theme === 'dark' ? '#2a2e35' : '#e6e6e6';
  
  return (
    <Card className="animate-fade-in shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
        <div className="text-sm text-muted-foreground">YTD: +24.5%</div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke={textColor} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis 
                  stroke={textColor} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff',
                    borderColor: gridColor,
                    color: textColor
                  }}
                  formatter={(value) => [`₹${value}`, 'Value']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#387ed1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#387ed1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="animate-pulse w-full h-[250px] bg-muted rounded"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
