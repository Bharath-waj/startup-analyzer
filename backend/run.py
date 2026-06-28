import sys
import os
import uvicorn

# Inject current folder into import path so 'app' packages are visible
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from app.config import HOST, PORT

if __name__ == "__main__":
    print(f"Starting Startup Analyzer server on http://{HOST}:{PORT}...")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
