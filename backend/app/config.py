import os

# API configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# Server settings
HOST = "127.0.0.1"
PORT = 8085

# Caching configurations
EVENTS_CACHE_EXPIRY = 3600  # 1 hour cache duration

# Groq LLM settings
MODEL_NAME = "llama-3.3-70b-versatile"
PITCH_COACH_MODEL = "llama-3.3-70b-versatile"
