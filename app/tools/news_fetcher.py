import aiohttp
import asyncio
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from typing import Dict, List, Any, Optional
import json
from datetime import datetime, timedelta
from crewai.tools import tool
import logging
from urllib.parse import urljoin
import re
from aiohttp import ClientTimeout
import random
 
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
 
class IndianFinanceNewsTools:
    def __init__(self):
        self.ua = UserAgent()
        self.headers = {
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        }
        self.timeout = ClientTimeout(total=30)  # 30 seconds timeout
        self.sources = {
            'moneycontrol': {
                'url': 'https://www.moneycontrol.com/news/business/',
                'pages': 2,
                'article_selector': 'li.clearfix',
                'title_selector': 'h2 a',
                'summary_selector': 'p',
                'date_selector': 'span',
                'base_url': 'https://www.moneycontrol.com',
                'category': 'markets'
            },
            'ndtv_business': {
                'url': 'https://www.ndtvprofit.com/business?src=topnav',
                'pages': 1,
                'article_selector': 'div.news_Itm',
                'title_selector': 'h2 a',
                'summary_selector': 'p',
                'date_selector': 'span.news_Itm-time',
                'base_url': 'https://www.ndtvprofit.com',
                'category': 'markets'
            }
        }
        self.rate_limit = 1.0
        self.max_retries = 3
        self.session = None
 
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(headers=self.headers, timeout=self.timeout)
        return self
 
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
 
    async def fetch_page(self, session, url: str) -> Optional[str]:
        for attempt in range(self.max_retries):
            try:
                await asyncio.sleep(self.rate_limit * attempt)
                self.headers['User-Agent'] = self.ua.random  # Update User-Agent each time
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        return await response.text()
                    elif response.status == 429:
                        retry_after = int(response.headers.get('Retry-After', 5))
                        await asyncio.sleep(retry_after)
                        continue
                    elif response.status == 403:
                        continue
                    logger.warning(f"Failed to fetch {url}: Status {response.status}")
                    return None
            except (asyncio.TimeoutError, aiohttp.ClientError) as e:
                logger.warning(f"Error fetching {url} (attempt {attempt + 1}): {str(e)}")
                if attempt == self.max_retries - 1:
                    return None
                await asyncio.sleep(2 ** attempt)
 
    def parse_date(self, date_str: str, source: str) -> Optional[datetime]:
        try:
            date_str = re.sub(r'[A-Z]{3,4}$', '', date_str).strip()
            formats = [
                '%Y-%m-%dT%H:%M:%S',
                '%Y-%m-%d %H:%M:%S',
                '%d %b %Y, %H:%M',
                '%b %d, %Y %H:%M',
                '%d-%m-%Y %H:%M'
            ]
            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
            return datetime.now()
        except Exception as e:
            logger.warning(f"Error parsing date '{date_str}' from {source}: {str(e)}")
            return datetime.now()
 
    async def parse_article(self, article_element, source_config: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            title_element = article_element.select_one(source_config['title_selector'])
            if not title_element:
                return None
 
            title = title_element.get_text(strip=True)
            url = urljoin(source_config['base_url'], title_element.get('href', ''))
            summary_element = article_element.select_one(source_config['summary_selector'])
            summary = summary_element.get_text(strip=True) if summary_element else "No summary available"
            date_element = article_element.select_one(source_config['date_selector'])
            date_str = date_element.get_text(strip=True) if date_element else datetime.now().isoformat()
            published_at = self.parse_date(date_str, source_config['base_url'])
 
            return {
                'title': title,
                'summary': summary,
                'url': url,
                'publishedAt': published_at.isoformat(),
                'source': source_config['base_url'],
                'category': source_config['category']
            }
        except Exception as e:
            logger.warning(f"Error parsing article: {str(e)}")
            return None
 
    async def fetch_source_articles(self, source_name: str, source_config: Dict[str, Any]) -> List[Dict[str, Any]]:
        articles = []
        try:
            for page in range(1, source_config['pages'] + 1):
                page_url = f"{source_config['url']}?page={page}" if page > 1 else source_config['url']
                html = await self.fetch_page(self.session, page_url)
                if not html:
                    continue
                soup = BeautifulSoup(html, 'html.parser')
                article_elements = soup.select(source_config['article_selector'])
                for element in article_elements:
                    article = await self.parse_article(element, source_config)
                    if article:
                        articles.append(article)
                await asyncio.sleep(self.rate_limit)
        except Exception as e:
            logger.error(f"Error fetching from {source_name}: {str(e)}")
        return articles
 
    async def combine_news_sources(self) -> List[Dict[str, Any]]:
        all_articles = []
        async with self:
            tasks = [
                self.fetch_source_articles(source_name, source_config)
                for source_name, source_config in self.sources.items()
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Error in news source: {str(result)}")
                    continue
                all_articles.extend(result)
            all_articles.sort(key=lambda x: x['publishedAt'], reverse=True)
            seen_titles = set()
            unique_articles = []
            for article in all_articles:
                title = article['title'].lower()
                if title not in seen_titles:
                    seen_titles.add(title)
                    unique_articles.append(article)
            return unique_articles[:50]
 
@tool("fetch_indian_financial_news")
async def fetch_indian_financial_news() -> Dict[str, Any]:
    """Fetch Indian financial news from multiple sources"""
    try:
        news_tools = IndianFinanceNewsTools()
        articles = await news_tools.combine_news_sources()
        return {
            "articles": articles,
            "fetch_timestamp": datetime.now().isoformat(),
            "source_count": len(articles),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error in fetch_indian_financial_news: {str(e)}")
        return {
            "articles": [],
            "fetch_timestamp": datetime.now().isoformat(),
            "source_count": 0,
            "status": "error",
            "error": str(e)
        }
 
 