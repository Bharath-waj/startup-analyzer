import os
from dotenv import load_dotenv

# Load environment variables
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
dotenv_path = os.path.join(base_dir, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

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
