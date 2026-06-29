# MarketPulse India — React Edition 📈

> Full-stack NSE stock risk analysis platform built with React + FastAPI. Bloomberg-style dark terminal UI with real-time AI insights.

🔗 **Live App:** [marketpulse-react.vercel.app](https://marketpulse-react.vercel.app)  
⚙️ **API:** [marketpulse-india-production.up.railway.app](https://marketpulse-india-production.up.railway.app/docs)  
📊 **Streamlit Version:** [marketpulse-india.streamlit.app](https://marketpulse-india.streamlit.app)

---

## What is this?

MarketPulse India is a multi-model financial risk intelligence platform for NSE-listed equities. It combines three statistical/ML engines with an LLM-powered AI assistant to give retail investors both quantitative metrics and plain-English investment insights.

This is the full-stack React + FastAPI rebuild of the original Streamlit version — built for better performance, mobile support, and a professional Bloomberg-style terminal UI.

---

## Features

### Stock Analysis
- **EVT/GPD Tail Risk** — Peaks Over Threshold method for 99% VaR and Expected Shortfall
- **HMM Regime Detection** — 2-state Gaussian HMM for High/Low volatility regime classification
- **FinBERT Sentiment** — Financial news sentiment via Groq LLM
- **Composite Risk Score** — Weighted 0–100 score with Red/Amber/Green label
- **30-Day ARIMA Forecast** — Price prediction with confidence bands
- **AI Investment Insights** — Bull/Bear case, Buy/Hold/Sell signal, Portfolio tip

### Portfolio Tracker
- Analyze up to 5 NSE stocks simultaneously
- Risk ranking table sorted lowest to highest
- Portfolio health score with AI rebalancing advice
- Bar chart visualization

### Earnings Analysis
- Quarterly revenue and net profit trends
- EPS actual vs estimate beat/miss history
- Key metrics — P/E, EPS TTM, Revenue, Profit Margin
- AI earnings health summary

### News Feed
- Real-time financial headlines via Google News RSS
- Source and timestamp for every article
- Search by company or topic

### AI Chatbot
- Context-aware — knows your last stock analysis
- Suggested questions for first-time users
- Powered by Groq's Llama 3.3 70B

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | FastAPI + Uvicorn |
| Tail Risk | SciPy (GPD/EVT) |
| Regime Detection | hmmlearn (Gaussian HMM) |
| Forecasting | statsmodels (ARIMA) |
| AI Insights | Groq API (Llama 3.3 70B) |
| Data | yfinance (NSE via Yahoo Finance) |
| News | feedparser (Google News RSS) |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## Architecture
marketpulse-react/          ← React frontend (Vercel)

src/

pages/

Overview.jsx

StockAnalysis.jsx

NewsFeed.jsx

Portfolio.jsx

Earnings.jsx

Chatbot.jsx

components/

Sidebar.jsx

TickerBar.jsx
marketpulse-india/          ← FastAPI backend (Railway)

api.py                  ← All API endpoints

risk.py                 ← EVT/GPD tail risk engine

regime.py               ← HMM regime detection

sentiment.py            ← News sentiment scoring

scoring.py              ← Composite score calculator

data/fetcher.py         ← yfinance data pipeline

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/analyze` | Full stock risk analysis |
| POST | `/insights` | AI bull/bear/signal insights |
| POST | `/chat` | Context-aware chatbot |
| GET | `/news` | Financial news feed |
| GET | `/earnings` | Earnings analysis |
| GET | `/health` | Health check |

Full API docs: [/docs](https://marketpulse-india-production.up.railway.app/docs)

---

## Local Setup

```bash
# Clone repos
git clone https://github.com/prernasach029/marketpulse-react
git clone https://github.com/prernasach029/marketpulse-india

# Backend
cd marketpulse-india
conda create -n marketpulse python=3.11
conda activate marketpulse
pip install -r requirements.txt
echo "GROQ_API_KEY=your-key" > .env
uvicorn api:app --reload --port 8000

# Frontend (new terminal)
cd marketpulse-react
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `GROQ_API_KEY` | Railway | Groq API key for LLM |
| `REACT_APP_API_URL` | Vercel | Backend API URL |

---

## Disclaimer

This app is for **educational purposes only**. Nothing here constitutes financial advice. Data via Yahoo Finance — prices delayed 15-20 minutes. Always consult a SEBI-registered investment advisor before investing.

---

## Author

**Prerna Sachdeva**  
MSc Statistics & Data Science, SVKM's NMIMS Mumbai  
[GitHub](https://github.com/prernasach029) · [Streamlit Version](https://marketpulse-india.streamlit.app)
