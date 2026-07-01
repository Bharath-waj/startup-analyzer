from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import AnalyzeRequest, PitchCoachRequest
from app.services.search_service import search_ddg
from app.services.ai_service import (
    generate_search_queries, 
    analyze_startup_idea, 
    parse_events, 
    pitch_coach_interact,
    generate_pitch_deck
)
from app.config import EVENTS_CACHE_EXPIRY
import asyncio
import time
from typing import Dict, Any

router = APIRouter()

# In-memory cache for startup events
EVENTS_CACHE: Dict[str, Any] = {
    "data": None,
    "last_updated": 0
}

@router.post("/analyze")
async def analyze_idea(req: AnalyzeRequest):
    if not req.idea.strip():
        raise HTTPException(status_code=400, detail="Startup idea cannot be empty.")
    
    # 1. Generate optimized queries
    queries = generate_search_queries(req.idea)
    
    # 2. Run scraping in parallel
    loop = asyncio.get_event_loop()
    reddit_results, github_results, competitor_results = await asyncio.gather(
        loop.run_in_executor(None, search_ddg, queries.get("reddit_query", f"{req.idea} reddit"), 4),
        loop.run_in_executor(None, search_ddg, queries.get("github_query", f"{req.idea} github"), 3),
        loop.run_in_executor(None, search_ddg, queries.get("competitor_query", f"{req.idea} competitors"), 3),
    )
    
    # 3. Form search context
    context = ""
    if reddit_results:
        context += "### Real-World Reddit Discussions & User Pain Points:\n"
        for idx, r in enumerate(reddit_results):
            context += f"{idx+1}. {r['title']}\n   Snippet: {r['snippet']}\n   Source: {r['link']}\n\n"
    if github_results:
        context += "### Open Source Projects / GitHub Repositories:\n"
        for idx, g in enumerate(github_results):
            context += f"{idx+1}. {g['title']}\n   Snippet: {g['snippet']}\n   Source: {g['link']}\n\n"
    if competitor_results:
        context += "### Commercial Competitors & Existing Startups:\n"
        for idx, c in enumerate(competitor_results):
            context += f"{idx+1}. {c['title']}\n   Snippet: {c['snippet']}\n   Source: {c['link']}\n\n"
            
    if not context:
        context = "No direct real-world references found via web search. Analyze based on general market knowledge."
        
    # 4. Analyze with Groq Llama-3.3
    try:
        analysis_result = analyze_startup_idea(req.idea, req.user_interests, context)
        analysis_result["raw_sources"] = {
            "reddit": reddit_results,
            "github": github_results,
            "competitors": competitor_results
        }
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API Error: {str(e)}")

@router.get("/events")
async def get_events():
    global EVENTS_CACHE
    current_time = time.time()
    
    # Return cache if valid
    if EVENTS_CACHE["data"] is not None and (current_time - EVENTS_CACHE["last_updated"] < EVENTS_CACHE_EXPIRY):
        return EVENTS_CACHE["data"]
    
    # Fetch upcoming booster and Shark Tank events
    search_queries = [
        "upcoming startup pitch competitions accelerator deadlines 2026",
        "shark tank casting calls open auditions 2026"
    ]
    
    loop = asyncio.get_event_loop()
    search_tasks = [loop.run_in_executor(None, search_ddg, q, 6) for q in search_queries]
    search_results = await asyncio.gather(*search_tasks)
    
    # Flatten results
    all_snippets = []
    for results in search_results:
        for r in results:
            all_snippets.append(f"Title: {r['title']}\nSnippet: {r['snippet']}\nLink: {r['link']}\n")
            
    context = "\n".join(all_snippets)
    
    try:
        events_data = parse_events(context)
        EVENTS_CACHE["data"] = events_data
        EVENTS_CACHE["last_updated"] = current_time
        return events_data
    except Exception as e:
        print(f"Error parsing booster events: {e}")
        # Default mock items in case of network throttle
        mock_events = {
            "events": [
                {
                    "name": "Y Combinator Batch Applications",
                    "type": "Accelerator",
                    "description": "The world's leading startup accelerator program. Offers $500k funding and mentorship.",
                    "deadline": "April & September annually",
                    "link": "https://www.ycombinator.com/apply"
                },
                {
                    "name": "Techstars Accelerator Programs",
                    "type": "Accelerator",
                    "description": "3-month accelerator program offering funding, mentorship, and access to the Techstars network.",
                    "deadline": "Rolling basis (various locations)",
                    "link": "https://www.techstars.com/accelerators"
                },
                {
                    "name": "Shark Tank Open Casting Calls",
                    "type": "Casting Call",
                    "description": "Auditions to pitch your startup on ABC's Shark Tank television show.",
                    "deadline": "Rolling/Ongoing",
                    "link": "https://abc.com/shows/shark-tank/applications"
                },
                {
                    "name": "Slush 2026 Startup Pitch",
                    "type": "Pitch Competition",
                    "description": "Slush 100 Pitching Competition in Helsinki for early stage startups to win equity investment.",
                    "deadline": "October 2026",
                    "link": "https://www.slush.org/"
                }
            ]
        }
        return mock_events

@router.post("/pitch-coach")
async def pitch_coach(req: PitchCoachRequest):
    if not req.idea.strip():
        raise HTTPException(status_code=400, detail="Startup idea is required for pitching.")
    
    # Format dialogue history
    hist_list = []
    for msg in req.history:
        hist_list.append({"role": msg.role, "content": msg.content})
        
    try:
        response = pitch_coach_interact(req.idea, hist_list, req.user_response, req.shark_name)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pitch Coach Error: {str(e)}")

@router.post("/pitch-deck")
async def pitch_deck(req: AnalyzeRequest):
    if not req.idea.strip():
        raise HTTPException(status_code=400, detail="Startup idea cannot be empty.")
    try:
        deck = generate_pitch_deck(req.idea)
        return deck
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pitch Deck Error: {str(e)}")
