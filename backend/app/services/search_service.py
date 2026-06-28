import httpx
from bs4 import BeautifulSoup
from typing import List, Dict
from urllib.parse import urlparse, parse_qs, unquote

def search_ddg(query: str, max_results: int = 5) -> List[Dict[str, str]]:
    url = "https://html.duckduckgo.com/html/"
    params = {"q": query}
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    try:
        response = httpx.get(url, params=params, headers=headers, follow_redirects=True, timeout=10.0)
        if response.status_code != 200:
            return []
        
        soup = BeautifulSoup(response.text, "html.parser")
        results = []
        results_divs = soup.find_all("div", class_="result")
        
        for div in results_divs[:max_results]:
            title_el = div.find("a", class_="result__a")
            snippet_el = div.find("a", class_="result__snippet")
            
            if title_el:
                title = title_el.text.strip()
                link = title_el.get("href", "")
                
                # Decode DDG redirects to get direct external links
                if "uddg=" in link:
                    parsed = urlparse(link)
                    qs = parse_qs(parsed.query)
                    if "uddg" in qs:
                        link = unquote(qs["uddg"][0])
                
                snippet = snippet_el.text.strip() if snippet_el else ""
                results.append({
                    "title": title,
                    "link": link,
                    "snippet": snippet
                })
        return results
    except Exception as e:
        print(f"Error scraping DuckDuckGo: {e}")
        return []
