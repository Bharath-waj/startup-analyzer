from groq import Groq
import json
from typing import List, Dict, Any, Optional
from app.config import GROQ_API_KEY, MODEL_NAME, PITCH_COACH_MODEL

client = Groq(api_key=GROQ_API_KEY)

def generate_search_queries(idea: str) -> Dict[str, str]:
    try:
        query_generator_prompt = (
            f"You are a search query optimizer. Given this startup idea: '{idea}', "
            "generate three separate highly relevant search queries in JSON format:\n"
            "1. 'reddit_query': To find Reddit discussions, customer struggles, or complaints related to this idea.\n"
            "2. 'github_query': To find open-source repositories or tool equivalents on GitHub.\n"
            "3. 'competitor_query': To find existing startup competitors or commercial alternatives.\n"
            "Output MUST be a JSON object with these three keys and nothing else. Example:\n"
            '{"reddit_query": "fridge camera recipe scanner reddit", "github_query": "recipe planner open source github", "competitor_query": "fridge recipe generator competitors"}'
        )
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": query_generator_prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error generating search queries: {e}")
        return {
            "reddit_query": f"{idea} reddit discussions",
            "github_query": f"{idea} github open source",
            "competitor_query": f"{idea} startup competitors"
        }

def analyze_startup_idea(idea: str, user_interests: Optional[str], search_context: str) -> Dict[str, Any]:
    system_instruction = (
        "You are an elite VC investment analyst, startup incubator director, and technical co-founder.\n"
        "Your task is to analyze a startup idea using the provided real-world search context (Reddit, GitHub, and competitor data) "
        "and produce a comprehensive, brutal, yet constructive startup analysis report.\n\n"
        "You must output JSON with the following schema:\n"
        "{\n"
        "  \"idea_summary\": \"A concise 2-sentence summary of the startup idea.\",\n"
        "  \"viability_score\": 85, // Integer 0 to 100 based on feasibility, competition, and demand.\n"
        "  \"market_demand_analysis\": \"Detailed paragraph explaining if the market wants this, highlighting specific user issues, feedback, or validation seen from Reddit snippets.\",\n"
        "  \"swot_analysis\": {\n"
        "    \"strengths\": [\"Strength 1\", \"Strength 2\"],\n"
        "    \"weaknesses\": [\"Weakness 1\", \"Weakness 2\"],\n"
        "    \"opportunities\": [\"Opportunity 1\", \"Opportunity 2\"],\n"
        "    \"threats\": [\"Threat 1\", \"Threat 2\"]\n"
        "  },\n"
        "  \"market_growth_trend\": {\n"
        "    \"labels\": [\"2022\", \"2023\", \"2024\", \"2025\", \"2026\", \"2027\"], // 6 consecutive years representing historical and near future forecast\n"
        "    \"values\": [120.5, 145.0, 180.2, 230.0, 290.0, 360.5], // corresponding values representing growth trend\n"
        "    \"metric\": \"Market Size ($B)\" // metric label representing size (e.g. 'Market Size ($B)', 'Active Users (M)', or 'Index')\n"
        "  },\n"
        "  \"similar_ideas_and_competitors\": [\n"
        "    {\n"
        "      \"name\": \"Competitor or Similar App Name\",\n"
        "      \"reach\": \"Estimate of their reach (e.g. '500k monthly visitors', 'Seed-stage', 'Popular open-source library with 2k stars', etc.)\",\n"
        "      \"successes\": \"What they did well or what makes them successful.\",\n"
        "      \"faults\": \"What they lack, customer complaints, or limitations.\"\n"
        "    }\n"
        "  ],\n"
        "  \"is_promising\": true, // Boolean. Set to true if the idea is viable/worth pursuing, false if it's saturation/unfeasible.\n"
        "  \"recommendations\": {\n"
        "    \"verdict\": \"Clear verdict sentence (e.g., 'Highly Promising - proceed with validation', 'Pivot Recommended', or 'High Risk - explore alternatives')\",\n"
        "    \"features_to_add\": [\"Feature 1\", \"Feature 2\"], // Suggest at least 3 features to add to make it competitive or stand out.\n"
        "    \"validation_steps\": [\"Step 1\", \"Step 2\"], // Actionable steps to continue validating the idea (landing page, user interviews, MVP scope).\n"
        "    \"alternative_ideas\": [\"Alt Idea 1\", \"Alt Idea 2\"] // Provide 2-3 alternative startup directions if the idea is weak, OR ways to pivot. Tailor this using the user's interests if provided.\n"
        "  },\n"
        "  \"lean_canvas\": {\n"
        "    \"problem\": \"Top 1-2 customer problems or pain points (from Reddit details if any).\",\n"
        "    \"solution\": \"Top 3 core features or ways the startup solves the problems.\",\n"
        "    \"key_metrics\": \"1-2 metrics that matter most (e.g., active users, retention, LTV).\",\n"
        "    \"value_proposition\": \"Single clear, compelling message stating why this is different and worth buying.\",\n"
        "    \"unfair_advantage\": \"Something that cannot be easily copied or bought.\",\n"
        "    \"channels\": \"Pathways to reach customers (e.g., organic search, social media, B2B sales).\",\n"
        "    \"customer_segments\": \"Target customers and buyer personas.\",\n"
        "    \"cost_structure\": \"Key operational and customer acquisition costs.\",\n"
        "    \"revenue_streams\": \"Pricing, monetization methods, and lifetime value models.\"\n"
        "  }\n"
        "}\n\n"
        "Ensure all recommendations are highly actionable, detailed, and directly address the user's input and interests."
    )
    
    user_content = (
        f"Startup Idea to Analyze: {idea}\n"
        f"User Hobbies/Interests: {user_interests or 'Not specified'}\n\n"
        f"Real-World Web Search Data:\n{search_context}\n\n"
        f"Provide your response in JSON matching the schema."
    )
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in analyze_startup_idea AI evaluation: {e}")
        raise e

def parse_events(raw_search_context: str) -> Dict[str, Any]:
    system_prompt = (
        "You are an assistant tracking startup accelerator deadlines, pitch competitions, and casting calls. "
        "Based on the following raw search snippets, extract active, upcoming startup booster events, "
        "pitch contests, incubator programs (like Y Combinator, Techstars, regional accelerators), and Shark Tank casting events.\n\n"
        "Filter out old, expired events and compile a list of up to 6 events. "
        "Return a JSON object containing a list under the key 'events' with the following schema:\n"
        "{\n"
        "  \"events\": [\n"
        "    {\n"
        "      \"name\": \"Program or Event Name (e.g. Y Combinator Summer 2026)\",\n"
        "      \"type\": \"Accelerator / Pitch Competition / Casting Call / Hackathon\",\n"
        "      \"description\": \"Brief description of what it is and what they offer.\",\n"
        "      \"deadline\": \"Deadline date or event date (e.g. 'October 25, 2026' or 'Rolling basis')\",\n"
        "      \"link\": \"Direct application URL parsed from the search results.\"\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        "If a specific URL is not available, provide a general search link or direct homepage."
    )
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Raw Web Search snippets:\n{raw_search_context}"}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error parsing events: {e}")
        raise e

def pitch_coach_interact(idea: str, history: List[Dict[str, str]], user_response: Optional[str], shark_name: Optional[str] = "Kevin O'Leary") -> Dict[str, Any]:
    if not shark_name:
        shark_name = "Kevin O'Leary"

    # Define custom persona styles and criteria
    personas = {
        "Kevin O'Leary": {
            "title": "Kevin O'Leary (Mr. Wonderful)",
            "style": "ruthless, greedy, financial-metrics-focused, royalty-obsessed, and sharp. You care deeply about valuation, margins, distribution/licensing royalties, customer acquisition costs, and patent protection. Use signature phrases like 'You're dead to me', 'Whose idea was this? It's terrible!', 'How do I get my money back?', 'There is nothing proprietary here', or asking if they can 'squish them like a bug'. Speak in a cold, analytical, yet dramatic voice."
        },
        "Mark Cuban": {
            "title": "Mark Cuban",
            "style": "direct, tech-focused, volume/scaling-oriented, sweat-equity-valuing, and no-nonsense. You hate 'wantrepreneurs' and royalty deals. You ask about technical scalability, sweat equity, active sales channels, customer lifetime value (LTV), customer acquisition cost (CAC), and barrier to entry. Say things like 'What's the grind like?', 'Who's doing the selling?', 'Hustling is everything', 'That's not a business, that's a feature'. Be casual but extremely sharp."
        },
        "Lori Greiner": {
            "title": "Lori Greiner (Queen of QVC)",
            "style": "product-oriented, retail/packaging-focused, patentability-driven, and consumer-centric. You evaluate if the product has instant mass appeal, suitable for television or major retail. Decide quickly if the product is a 'hero' or a 'zero'. Be warm and encouraging but critically analytical of the physical product, pricing, and packaging. Say things like 'Is this a hero or a zero?', 'Can it sell on TV?', 'Do you have a utility patent?'."
        },
        "Barbara Corcoran": {
            "title": "Barbara Corcoran",
            "style": "gut-feel-reliant, branding/marketing-focused, personality-driven, and story-centric. You value the entrepreneur's story, energy, passion, grit, and salesmanship over raw spreadsheets. Trust your intuition about their character. Say things like 'I invest in people, not businesses', 'Show me the hustle', 'I don't think you have what it takes to bounce back from failure', or tell them they are too slick/rehearsed."
        }
    }

    # Fallback to Kevin O'Leary if unknown
    persona = personas.get(shark_name, personas["Kevin O'Leary"])

    system_instruction = (
        f"You are the mock Shark Tank investor: {persona['title']}. "
        f"You are evaluating a startup idea that the user is pitching: '{idea}'.\n"
        f"Your tone, evaluation criteria, and attitude must align perfectly with your persona style:\n"
        f"{persona['style']}\n\n"
        "The interaction must follow these rules:\n"
        "1. Be sharp, direct, and candid, just like on Shark Tank.\n"
        "2. If this is the start (no dialogue history yet), introduce yourself in your persona, state your initial impression of the idea based on its value proposition, and ask a hard opening question relevant to your style.\n"
        "3. If in progress, review the history and evaluate the user's latest response. Offer quick feedback using your style, then ask your next hard question (e.g. O'Leary asks about margins, Cuban asks about scalability, Lori asks about TV/patentability, Barbara asks about passion/grit).\n"
        "4. If this is the 4th turn (history contains 3 user answers), it's time to make a decision. Write your final assessment and choose to either make a deal offer (e.g. '$150,000 for 20% equity plus a royalty') or say 'I'm out' with a clear explanation of why.\n\n"
        "Your response MUST be a JSON object with this exact structure:\n"
        "{\n"
        f"  \"shark_name\": \"{shark_name}\",\n"
        "  \"evaluation\": \"1-2 sentences of direct, candid feedback on the user's pitching content so far.\",\n"
        "  \"next_question\": \"Your follow-up question. (Set to null if is_pitch_finished is true)\",\n"
        "  \"is_pitch_finished\": false, // Set to true on the 4th turn to conclude\n"
        "  \"deal_verdict\": \"Your final offer (e.g. '$100,000 for 15% equity') or 'I'm out' with rationale. (Set to null if is_pitch_finished is false)\"\n"
        "}"
    )

    messages = [
        {"role": "system", "content": system_instruction}
    ]

    for msg in history:
        role = "assistant" if msg["role"] == "shark" else "user"
        messages.append({"role": role, "content": msg["content"]})

    if user_response:
        messages.append({"role": "user", "content": user_response})

    try:
        response = client.chat.completions.create(
            model=PITCH_COACH_MODEL,
            messages=messages,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in Pitch Coach interaction: {e}")
        return {
            "shark_name": shark_name,
            "evaluation": "I am having trouble connecting to my database, but let's keep talking.",
            "next_question": "What are your customer acquisition costs?",
            "is_pitch_finished": False,
            "deal_verdict": None
        }

def generate_pitch_deck(idea: str) -> Dict[str, Any]:
    system_instruction = (
        "You are an elite pitch consultant and venture capital pitch deck advisor.\n"
        "Your task is to analyze the following startup idea and generate a professional, high-fidelity 10-slide pitch deck structure.\n"
        "Each slide must have concrete, specific, and tailored content, not generic templates.\n\n"
        "The slides must follow standard VC sequencing:\n"
        "1. Title Slide (Hook & vision)\n"
        "2. The Problem (Pain points being addressed)\n"
        "3. The Solution (Value proposition & product concept)\n"
        "4. Target Market & TAM (Customer segments and size)\n"
        "5. Business Model (How the company makes money)\n"
        "6. Underlying Magic / Technology (Why it's proprietary or defensible)\n"
        "7. Marketing & Go-To-Market Plan (Customer acquisition channels)\n"
        "8. Competitive Analysis (Gaps in competitor solutions)\n"
        "9. Financial Projections (Realistic milestones or growth trajectory)\n"
        "10. The Ask & Team (Funding needed and milestones/resource allocation)\n\n"
        "Output MUST be a JSON object with a single key 'slides' containing an array of slide objects. Schema:\n"
        "{\n"
        "  \"slides\": [\n"
        "    {\n"
        "      \"slide_number\": 1,\n"
        "      \"title\": \"Slide Title (concise and punchy)\",\n"
        "      \"bullets\": [\"Bullet point 1 detailing specific strategy\", \"Bullet point 2\"],\n"
        "      \"visual_prompt\": \"Detailed descriptive prompt of the ideal high-quality graphic, chart, custom icon, or clean interface mockup for this slide.\"\n"
        "    }\n"
        "  ]\n"
        "}\n"
    )
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Startup Idea: {idea}"}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error generating pitch deck: {e}")
        # Return fallback slides in case of API failure
        return {
            "slides": [
                {
                    "slide_number": i,
                    "title": f"Slide {i} Title",
                    "bullets": [f"Key detail for startup: {idea}", "Market validation and user feedback"],
                    "visual_prompt": "Clean professional modern slide layout with diagrams and clean margins."
                } for i in range(1, 11)
            ]
        }
