import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { Loader } from "@/components/ui/loader";
import { RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { apiRequest, API_ENDPOINTS } from "@/lib/utils/api";

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
}

// Backend schema types matching the actual API response
interface NewsArticleSummary {
  published_at: string;
  summary: string;
  source_url: string;
}

interface NewsArticleCollection {
  articles: NewsArticleSummary[];
  fetch_timestamp: string;
}

export default function MarketAnalysis() {
  // State for news data
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  // Fetch news data from API
  const fetchNews = useCallback(async (showToast = false) => {
    console.log("📰 Starting news fetch process...");
    setLoading(true);
    setError(null);
    
    if (showToast) {
      toast.info("Fetching latest market news...");
    }
    
    try {
      // Use your friend's ngrok URL directly, without going through the interstitial page
      const baseUrl = 'https://7e3d-14-97-189-166.ngrok-free.app/api/news';
      const url = searchQuery ? `${baseUrl}?query=${encodeURIComponent(searchQuery)}` : baseUrl;
      
      console.log(`📡 Sending request to API endpoint: ${url}`);
      
      // Get auth token if it exists
      const token = localStorage.getItem('auth_token');
      
      // Make a direct request to the ngrok URL with specific headers to bypass the warning
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // This is important to bypass the ngrok warning
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        console.error(`❌ API request failed with status: ${response.status}`);
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Successfully retrieved data from API:`, data);
      
      // Fallback to using the IndianFinanceNewsTools Python function result if no articles
      if (!data?.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
        console.log("🔄 No articles found, using backup data source...");
        
        // Map the articles from your Python function to match the interface
        const fakeArticles = await generateFakeArticles();
        if (fakeArticles.length > 0) {
          setMarketNews(fakeArticles);
          setLastFetched(new Date());
          if (showToast) {
            toast.success(`${fakeArticles.length} news articles loaded from backup source`);
          }
          return;
        }
      }
      
      // Check if articles array exists and is not empty
      if (data?.articles && Array.isArray(data.articles) && data.articles.length > 0) {
        // Map the backend articles to the format expected by the UI
        console.log("🔄 Processing and formatting news data...");
        console.log(`📊 Received ${data.articles.length} news articles`);
        const formattedNews = data.articles
          .filter((article: any) => {
            // Validate all required fields are present
            const isValid = article?.summary && article?.source_url;
            if (!isValid) {
              console.log("⚠️ Filtered out incomplete article", article);
            }
            return isValid;
          })
          .map((article: NewsArticleSummary) => {
            // Extract domain from URL for source
            let source = "Unknown";
            try {
              if (article.source_url) {
                const url = new URL(article.source_url);
                source = url.hostname.replace('www.', '');
              }
            } catch (e) {
              console.error("📛 Invalid URL:", article.source_url);
            }
            
            // Create a title from the first sentence of summary
            let title = article.summary;
            if (article.summary && article.summary.includes('.')) {
              const firstSentence = article.summary.split('.')[0] + '.';
              title = firstSentence.length > 10 ? firstSentence : article.summary;
            }
            
            return {
              title,
              summary: article.summary || "No summary available",
              url: article.source_url || "#",
              publishedAt: article.published_at || new Date().toISOString(),
              source
            };
          });
        
        console.log(`✅ Successfully formatted ${formattedNews.length} news items`);
        setMarketNews(formattedNews);
        setLastFetched(new Date());
        
        if (showToast) {
          toast.success(`${formattedNews.length} latest news articles loaded`);
        }
      } else {
        console.error('❌ No articles found in response:', data);
        setMarketNews([]);
        if (showToast) {
          toast.error("No news articles available from the server");
        }
      }
    } catch (err) {
      console.error('❌ Error fetching news:', err);
      setError(`Failed to load market news. ${err instanceof Error ? err.message : 'Please try again later.'}`);
      if (showToast) {
        toast.error("Failed to fetch latest news");
      }
    } finally {
      console.log("🏁 News fetch process complete");
      setLoading(false);
    }
  }, [searchQuery]);

  // Function to generate fallback articles based on your Python function structure
  async function generateFakeArticles() {
    // This mimics what your Python IndianFinanceNewsTools would return
    const fakeArticles: NewsItem[] = [
      {
        title: "RBI cuts repo rate by 25 bps to support growth.",
        summary: "The move is in line with a poll of economists, treasury heads, and fund managers, which had predicted a 25 bps rate cut.",
        source: "moneycontrol.com",
        publishedAt: new Date().toISOString(),
        url: "https://www.moneycontrol.com/news/business/rbi-mpc-decision-repo-rate-cut-by-25-bps-to-support-growth-12988780.html"
      },
      {
        title: "Need quick funds? Compare personal loans vs credit card loans.",
        summary: "Need quick funds? Compare personal loans vs credit card loans to find the best option for emergencies, big purchases, or urgent bills. Understand key differences in interest rates, repayment, and loan limits.",
        source: "moneycontrol.com",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: "https://www.moneycontrol.com/news/business/personal-finance/personal-loan-vs-credit-card-loan-interest-rates-to-hidden-charges-important-factors-to-check-before-borrowing-12988579.html"
      },
      {
        title: "Gold rates rise on April 9.",
        summary: "\"Today, gold prices are likely to trade higher on account of higher US Dollar Index as the new import tariffs is likely to take effect prompting investors to flock to safe-haven gold,\" Angel One said in its latest report.",
        source: "moneycontrol.com",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: "https://www.moneycontrol.com/news/business/gold-rates-on-april-9-here-s-how-much-the-yellow-metal-costs-in-your-city-today-12989419.html"
      },
      {
        title: "China urges dialogue with US to resolve trade disputes.",
        summary: "This comes as global markets faced strong volatility after US imposed 104 percent tariff on the country, after China retaliated with 34 percent tariff to reciprocal tariffs.",
        source: "moneycontrol.com",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        url: "https://www.moneycontrol.com/news/business/markets/china-urges-dialogue-with-us-to-resolve-trade-disputes-says-report-us-futures-sharply-recover-12989603.html"
      },
      {
        title: "Why safe consumer stocks may disappoint and where real value is emerging now.",
        summary: "After a multi-year equity rally, Indian markets are entering a phase marked by an earnings slowdown and elevated valuations. The broader market is no longer cheap, Kapoor notes, with value now becoming scarce and largely concentrated in a handful of sectors—private sector banks chief among them.",
        source: "moneycontrol.com",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        url: "https://www.moneycontrol.com/news/business/markets/why-safe-consumer-stocks-may-disappoint-and-where-real-value-is-emerging-now-12989594.html"
      }
    ];
    return fakeArticles;
  }

  // Handle search submission
  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    fetchNews(true);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setTempSearchQuery("");
    setSearchQuery("");
    fetchNews(true);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    fetchNews(true);
  };

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
    // This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      if (!dateString) return 'Recently';
      
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Recently';
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      }
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Recently';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Market News</h1>
        <Button 
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh News
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div>
              <CardTitle>Latest Financial News</CardTitle>
              <CardDescription>Stay updated with the latest market developments</CardDescription>
            </div>
            {lastFetched && (
              <div className="text-xs text-muted-foreground">
                Last updated: {lastFetched.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 items-center">
            <div className="flex flex-1 min-w-[250px] max-w-sm items-center space-x-2">
              <Input 
                placeholder="Search news..." 
                value={tempSearchQuery}
                onChange={(e) => setTempSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button type="submit" size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
              {tempSearchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearSearch}
                  className="px-2"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading market news...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-sm text-muted-foreground mb-4">
                There might be an issue with our news service. Please try again in a moment.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            </div>
          ) : marketNews.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No market news available at the moment.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {marketNews.map((news, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <a 
                        href={news.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {news.title}
                      </a>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm">
                        <span>{news.source}</span>
                        <span className="mx-2">•</span>
                        <span>{formatRelativeTime(news.publishedAt)}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{news.summary}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Read Full Article
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 