# Startup Analyzer

An AI-powered viability analysis and competitor scanning system. It crawls real-world discussions from Reddit, open source repositories on GitHub, and commercial alternatives to assess market viability, generate a SWOT matrix, and provide an interactive Shark Tank Pitch Coach simulator.

## Features
- **Real-World Crawling**: Live scraping of Reddit and GitHub discussions.
- **SWOT Evaluation**: AI-generated SWOT matrices based on scraped context.
- **Shark Tank Pitch Coach**: Chat simulation to test your startup pitch against AI investors.
- **Accelerator Events Finder**: Dynamic dashboard notifications of upcoming incubator deadlines (YC, Techstars) and casting calls.

## How to Start

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Set Up Environment Variables
Set your Groq API key:
- **Windows (CMD)**: `set GROQ_API_KEY=your_api_key_here`
- **Windows (PowerShell)**: `$env:GROQ_API_KEY="your_api_key_here"`
- **Linux/macOS**: `export GROQ_API_KEY="your_api_key_here"`

*(If not set, the app will fallback to the default key pre-configured in config.py)*

### 3. Run the Server
```bash
python backend/run.py
```

### 4. Access the Dashboard
Open your browser and navigate to:
```
http://127.0.0.1:8085
```
