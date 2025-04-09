import { useState } from "react";
import ProfileForm from "@/components/reports/ProfileForm";
import InvestmentReportView from "@/components/reports/InvestmentReportView";
import { generateInvestmentReport } from "@/lib/services/aiService";
import type { InvestmentReport, UserProfile } from "@/lib/services/aiService";
import { getStockQuote, getMarketSummary } from "@/lib/services/yahooFinance";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useLoading } from "@/lib/LoadingContext";
import { toast } from "sonner";

export default function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<InvestmentReport | null>(null);
  const [marketData, setMarketData] = useState<{
    niftySummary: any;
    sensexSummary: any;
    keyStocks: any[];
  } | null>(null);
  const { showLoading, hideLoading } = useLoading();
  
  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsGenerating(true);
    showLoading();
    
    try {
      // Fetch market data in parallel
      fetchMarketData();
      
      // Generate the investment report
      const report = await generateInvestmentReport(profile);
      setGeneratedReport(report);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
      hideLoading();
    }
  };
  
  const fetchMarketData = async () => {
    try {
      // Fetch key Indian index data (Nifty 50 and Sensex)
      const [nifty, sensex] = await Promise.all([
        getStockQuote("^NSEI"), // Nifty 50
        getStockQuote("^BSESN"), // Sensex
      ]);
      
      // Fetch data for key stocks (can be expanded)
      const keyStocksPromises = ["RELIANCE.NS", "HDFCBANK.NS", "INFY.NS", "TCS.NS", "ICICIBANK.NS"]
        .map(symbol => getStockQuote(symbol));
      
      const keyStocks = await Promise.all(keyStocksPromises);
      
      setMarketData({
        niftySummary: nifty,
        sensexSummary: sensex,
        keyStocks: keyStocks.filter(stock => stock !== null),
      });
    } catch (error) {
      console.error("Error fetching market data:", error);
      // Non-blocking error, we still want to show the report
    }
  };
  
  const resetGenerator = () => {
    setGeneratedReport(null);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-Powered Investment Report Generator</h1>
        <p className="text-muted-foreground">
          Generate personalized investment recommendations based on your risk profile and financial goals
        </p>
      </div>
      
      {generatedReport ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetGenerator}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Profile
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMarketData}
              className="flex items-center gap-2"
              disabled={!marketData}
            >
              <RefreshCw className="h-4 w-4" /> Refresh Market Data
            </Button>
          </div>
          
          {marketData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Nifty 50</h3>
                <p className="text-2xl font-bold">
                  {marketData.niftySummary?.regularMarketPrice.toLocaleString("en-IN")}
                </p>
                <p className={`text-sm ${marketData.niftySummary?.regularMarketChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.niftySummary?.regularMarketChange > 0 ? '▲' : '▼'} 
                  {marketData.niftySummary?.regularMarketChange.toFixed(2)} 
                  ({marketData.niftySummary?.regularMarketChangePercent.toFixed(2)}%)
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sensex</h3>
                <p className="text-2xl font-bold">
                  {marketData.sensexSummary?.regularMarketPrice.toLocaleString("en-IN")}
                </p>
                <p className={`text-sm ${marketData.sensexSummary?.regularMarketChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.sensexSummary?.regularMarketChange > 0 ? '▲' : '▼'} 
                  {marketData.sensexSummary?.regularMarketChange.toFixed(2)} 
                  ({marketData.sensexSummary?.regularMarketChangePercent.toFixed(2)}%)
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Market Overview</h3>
                <p className="text-sm">
                  {marketData.niftySummary?.regularMarketChange > 0 
                    ? 'Markets are trending positive today' 
                    : 'Markets are showing downward trend today'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
          
          <InvestmentReportView report={generatedReport} />
        </div>
      ) : (
        <ProfileForm onSubmit={handleProfileSubmit} isLoading={isGenerating} />
      )}
    </div>
  );
} 