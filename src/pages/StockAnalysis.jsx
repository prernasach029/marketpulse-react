import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const [allStocks, setAllStocks] = useState(TICKER_MAP);

useEffect(() => {
  axios.get(`${API}/stocks`).then(res => {
    setAllStocks(res.data.stocks);
  }).catch(() => {});
}, []);

const ticker = selectedCompany ? allStocks[selectedCompany] : manualTicker.trim().toUpperCase();
const NSE_STOCKS = [
  "Reliance Industries", "TCS", "HDFC Bank", "Infosys", "ICICI Bank",
  "Hindustan Unilever", "ITC", "Kotak Mahindra Bank", "Larsen & Toubro",
  "Axis Bank", "Bajaj Finance", "Asian Paints", "Wipro", "HCL Technologies",
  "Maruti Suzuki", "Sun Pharma", "Titan Company", "Tech Mahindra",
  "Nestle India", "Power Grid", "NTPC", "Adani Enterprises", "Adani Ports",
  "JSW Steel", "Tata Steel", "Tata Motors", "Tata Power", "Bajaj Auto",
  "UltraTech Cement", "IndusInd Bank", "SBI", "ONGC", "Coal India",
  "Cipla", "Dr Reddys", "Apollo Hospitals", "Eicher Motors", "Hero MotoCorp",
  "Zomato", "Nykaa", "Info Edge", "Persistent Systems", "LTIMindtree",
  "Interglobe Aviation", "Divi's Labs", "Bajaj Finserv", "Grasim Industries",
];

const TICKER_MAP = {
  "Reliance Industries": "RELIANCE.NS", "TCS": "TCS.NS", "HDFC Bank": "HDFCBANK.NS",
  "Infosys": "INFY.NS", "ICICI Bank": "ICICIBANK.NS", "Hindustan Unilever": "HINDUNILVR.NS",
  "ITC": "ITC.NS", "Kotak Mahindra Bank": "KOTAKBANK.NS", "Larsen & Toubro": "LT.NS",
  "Axis Bank": "AXISBANK.NS", "Bajaj Finance": "BAJFINANCE.NS", "Asian Paints": "ASIANPAINT.NS",
  "Wipro": "WIPRO.NS", "HCL Technologies": "HCLTECH.NS", "Maruti Suzuki": "MARUTI.NS",
  "Sun Pharma": "SUNPHARMA.NS", "Titan Company": "TITAN.NS", "Tech Mahindra": "TECHM.NS",
  "Nestle India": "NESTLEIND.NS", "Power Grid": "POWERGRID.NS", "NTPC": "NTPC.NS",
  "Adani Enterprises": "ADANIENT.NS", "Adani Ports": "ADANIPORTS.NS",
  "JSW Steel": "JSWSTEEL.NS", "Tata Steel": "TATASTEEL.NS", "Tata Motors": "TATAMOTORS.NS",
  "Tata Power": "TATAPOWER.NS", "Bajaj Auto": "BAJAJ-AUTO.NS",
  "UltraTech Cement": "ULTRACEMCO.NS", "IndusInd Bank": "INDUSINDBK.NS",
  "SBI": "SBIN.NS", "ONGC": "ONGC.NS", "Coal India": "COALINDIA.NS",
  "Cipla": "CIPLA.NS", "Dr Reddys": "DRREDDY.NS", "Apollo Hospitals": "APOLLOHOSP.NS",
  "Eicher Motors": "EICHERMOT.NS", "Hero MotoCorp": "HEROMOTOCO.NS",
  "Zomato": "ZOMATO.NS", "Nykaa": "NYKAA.NS", "Info Edge": "NAUKRI.NS",
  "Persistent Systems": "PERSISTENT.NS", "LTIMindtree": "LTIM.NS",
  "Interglobe Aviation": "INDIGO.NS", "Divi's Labs": "DIVISLAB.NS",
  "Bajaj Finserv": "BAJAJFINSV.NS", "Grasim Industries": "GRASIM.NS",
};

export default function StockAnalysis({ setAnalysisData }) {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [manualTicker, setManualTicker] = useState('');
  const [period, setPeriod] = useState('2y');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const ticker = selectedCompany ? TICKER_MAP[selectedCompany] : manualTicker.trim().toUpperCase();
  const company = selectedCompany || ticker.replace('.NS', '');

  const cleanText = (text) => text?.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '') || '';

  const getInsights = async (data) => {
    setInsightsLoading(true);
    try {
      const res = await axios.post(`${API}/insights`, {
        company: data.company,
        ticker: data.ticker,
        var_99: data.var_99,
        es_99: data.es_99,
        regime: data.regime,
        sentiment_score: data.sentiment_score,
        composite_score: data.composite_score,
        label: data.label,
        headline: data.sample_headline
      });
      const raw = res.data.insights;
      const sections = { summary: '', bull: '', bear: '', signal: '', tip: '' };
      let current = 'summary';
      raw.split('\n').forEach(line => {
        const l = line.toLowerCase();
        if (l.includes('bull case')) current = 'bull';
        else if (l.includes('bear case')) current = 'bear';
        else if (l.includes('signal')) current = 'signal';
        else if (l.includes('portfolio tip')) current = 'tip';
        else if (l.includes('what this means')) current = 'summary';
        else sections[current] += line + '\n';
      });
      setInsights(sections);
    } catch (e) {
      console.error(e);
    }
    setInsightsLoading(false);
  };

  const analyze = async () => {
    if (!ticker) { setError('Please select a company or enter a ticker.'); return; }
    setError(''); setLoading(true); setResult(null); setInsights(null);
    try {
      const res = await axios.post(`${API}/analyze`, {
        ticker: ticker.endsWith('.NS') ? ticker : ticker + '.NS',
        company, period
      });
      setResult(res.data);
      if (setAnalysisData) setAnalysisData(res.data);
      getInsights(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed. Check ticker and try again.');
    }
    setLoading(false);
  };

  const labelColor = result?.label?.includes('High') ? 'text-down' :
    result?.label?.includes('Moderate') ? 'text-amber' : 'text-up';
  const scoreColor = result?.composite_score >= 65 ? '#F0455E' :
    result?.composite_score >= 35 ? '#E0A33B' : '#16C77E';

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-txt-1">Stock Analysis</h1>
        <p className="font-mono text-xs text-txt-3 tracking-widest mt-1">HOME / STOCK ANALYSIS</p>
      </div>

      {/* Search form */}
      <div className="bg-panel border border-line-soft rounded-xl p-4 mb-4">
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-mono text-xs text-txt-3 uppercase tracking-widest block mb-1.5">Select Company</label>
            <p className="font-mono text-xs text-txt-3 mt-1">Can't find your stock? Enter ticker manually below.</p>
            <select
              value={selectedCompany}
              onChange={e => { setSelectedCompany(e.target.value); setManualTicker(''); }}
              className="w-full bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-3 outline-none focus:border-accent/60"
            >
              <option value="">Select company...</option>
              {Object.keys(allStocks).sort().map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-txt-3 uppercase tracking-widest block mb-1.5">Or Enter Ticker</label>
            <input
              value={manualTicker}
              onChange={e => { setManualTicker(e.target.value); setSelectedCompany(''); }}
              placeholder="e.g. RELIANCE.NS"
              className="w-full bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-3 outline-none focus:border-accent/60 placeholder-txt-3"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-txt-3 uppercase tracking-widest block mb-1.5">Period</label>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="w-full bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-3 outline-none focus:border-accent/60"
            >
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
              <option value="5y">5 Years</option>
            </select>
          </div>
        </div>
        {ticker && (
          <div className="mt-2 font-mono text-xs text-accent">
            Ticker: {ticker.endsWith('.NS') ? ticker : ticker + '.NS'}
          </div>
        )}
        <button
          onClick={analyze}
          disabled={loading}
          className="mt-3 w-full bg-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {error && <div className="mt-2 text-down text-sm font-mono">{error}</div>}
      </div>

      {loading && (
        <div className="bg-panel border border-line-soft rounded-xl p-8 text-center">
          <div className="font-mono text-txt-2 text-sm animate-pulse">Running EVT · HMM · Sentiment models...</div>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {/* Stock header */}
          <div className="bg-panel border border-line-soft rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2540] to-[#0f1830] border border-line flex items-center justify-center font-mono font-bold text-lg text-accent flex-none">
                {result.company[0]}
              </div>
              <div>
                <div className="text-lg font-bold text-txt-1">{result.company}</div>
                <div className="font-mono text-xs text-txt-3">{result.ticker}</div>
              </div>
            </div>
            <div className="font-mono text-3xl font-bold text-txt-1">
              ₹{result.current_price?.toLocaleString('en-IN')}
            </div>
            <div className="font-mono text-xs text-txt-3 mt-1">Delayed 15-20 min · Yahoo Finance</div>
          </div>

          {/* KPI metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: '99% VaR', v: `-${result.var_99}%`, color: 'text-down', foot: 'Worst expected daily loss' },
              { l: '99% ES', v: `-${result.es_99}%`, color: 'text-down', foot: 'Avg loss beyond VaR' },
              { l: 'Volatility Regime', v: result.regime, color: result.regime === 'High Vol' ? 'text-amber' : 'text-up', foot: 'HMM 2-state regime' },
              { l: 'Sentiment Risk', v: `${result.sentiment_score}/100`, color: 'text-txt-1', foot: 'News sentiment score' },
            ].map((k, i) => (
              <div key={i} className="bg-panel border border-line-soft rounded-xl p-3">
                <div className="font-mono text-xs text-txt-3 uppercase tracking-widest leading-tight">{k.l}</div>
                <div className={`font-mono text-lg font-semibold mt-2 ${k.color}`}>{k.v}</div>
                <div className="text-xs text-txt-2 mt-1 leading-snug">{k.foot}</div>
              </div>
            ))}
          </div>

          {/* Risk score */}
          <div className="bg-panel border border-line-soft rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-txt-1">Composite Risk Score</span>
              <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">EVT · HMM · FINBERT</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 flex-none">
                <svg viewBox="0 0 130 130" className="w-full h-full">
                  <circle cx="65" cy="65" r="54" fill="none" stroke="#0D1424" strokeWidth="12" />
                  <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - result.composite_score / 100)}`}
                    transform="rotate(-90 65 65)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-bold" style={{ color: scoreColor }}>{result.composite_score}</span>
                  <span className="font-mono text-xs text-txt-3">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <div className={`font-bold text-sm mb-2 ${labelColor}`}>{result.label}</div>
                {[
                  { l: 'EVT', v: result.evt_score, w: '0.50' },
                  { l: 'Regime', v: result.regime_score, w: '0.30' },
                  { l: 'Sentiment', v: result.sentiment_score_component, w: '0.20' },
                ].map(b => (
                  <div key={b.l} className="grid grid-cols-3 items-center gap-2 mb-1.5 text-xs">
                    <span className="font-mono text-txt-2">{b.l}</span>
                    <div className="h-1.5 bg-panel-2 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${b.v}%` }} />
                    </div>
                    <span className="font-mono text-txt-1 text-right">{b.w}w</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest News */}
          <div className="bg-panel border border-line-soft rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-txt-1">Latest News</span>
              <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">SENTIMENT</span>
            </div>
            <div className="font-mono text-xs text-txt-3 mb-2">Score: {result.sentiment_score}/100</div>
            {result.sample_headline && result.sample_headline !== 'N/A' ? (
              <p className="text-sm text-txt-2 leading-relaxed italic">"{result.sample_headline}"</p>
            ) : (
              <p className="text-sm text-txt-3 italic">No recent news found.</p>
            )}
          </div>

          {/* AI Insights */}
          {insightsLoading && (
            <div className="bg-panel border border-line-soft rounded-xl p-6 text-center">
              <div className="font-mono text-txt-2 text-sm animate-pulse">Generating AI insights...</div>
            </div>
          )}

          {insights && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">AI Investment Insights</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">LLAMA 3.3 70B</span>
              </div>
              {insights.summary.trim() && (
                <div className="bg-panel-2 border border-line-soft rounded-lg p-3 mb-3 text-sm text-txt-2 leading-relaxed">
                  {cleanText(insights.summary.trim())}
                </div>
              )}
              <div className="flex flex-col gap-3 mb-3">
                <div className="bg-up/10 border border-up/25 rounded-lg p-3">
                  <div className="font-mono text-xs text-up uppercase tracking-widest font-bold mb-2">Bull Case</div>
                  <div className="text-xs text-txt-2 leading-relaxed whitespace-pre-line">
                    {cleanText(insights.bull.trim())}
                  </div>
                </div>
                <div className="bg-down/10 border border-down/25 rounded-lg p-3">
                  <div className="font-mono text-xs text-down uppercase tracking-widest font-bold mb-2">Bear Case</div>
                  <div className="text-xs text-txt-2 leading-relaxed whitespace-pre-line">
                    {cleanText(insights.bear.trim())}
                  </div>
                </div>
              </div>
              {insights.signal.trim() && (
                <div className="bg-panel-2 border border-accent/40 rounded-lg p-3 mb-3 text-sm text-txt-1">
                  <span className="text-accent font-bold font-mono">Signal</span>
                  <span className="text-txt-3 mx-2">|</span>
                  {cleanText(insights.signal.trim())}
                </div>
              )}
              {insights.tip.trim() && (
                <div className="bg-amber/10 border-l-4 border-amber rounded-r-lg p-3">
                  <span className="font-mono text-xs text-amber font-bold uppercase tracking-widest">Portfolio Tip</span>
                  <div className="text-xs text-txt-2 leading-relaxed mt-1.5">
                    {cleanText(insights.tip.trim())}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price History */}
          {result.price_history?.length > 0 && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">Price History</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">{period.toUpperCase()} · CLOSE</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={result.price_history}>
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111932', border: '1px solid #1E2A48', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                    labelStyle={{ color: '#9AA6C2' }} itemStyle={{ color: '#2563EB' }} />
                  <Line type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 30-Day Forecast */}
          {result.forecast?.length > 0 && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">30-Day Forecast</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">ARIMA(5,1,0)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { l: 'Current', v: `₹${result.current_price}` },
                  { l: 'Predicted 30D', v: `₹${result.forecast[result.forecast.length - 1]?.price}` },
                  {
                    l: 'Exp. Change',
                    v: `${((result.forecast[result.forecast.length - 1]?.price - result.current_price) / result.current_price * 100).toFixed(2)}%`,
                    color: result.forecast[result.forecast.length - 1]?.price > result.current_price ? 'text-up' : 'text-down'
                  },
                ].map((k, i) => (
                  <div key={i} className="bg-panel-2 rounded-lg p-2.5">
                    <div className="font-mono text-xs text-txt-3 uppercase tracking-widest leading-tight">{k.l}</div>
                    <div className={`font-mono text-sm font-semibold mt-1 ${k.color || 'text-txt-1'}`}>{k.v}</div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={result.forecast}>
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111932', border: '1px solid #1E2A48', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
                  <Line type="monotone" dataKey="upper" stroke="#1E2A48" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="lower" stroke="#1E2A48" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="font-mono text-xs text-txt-3 text-center tracking-widest pb-4">
            NOT FINANCIAL ADVICE · CONSULT A SEBI-REGISTERED ADVISOR · DATA VIA YAHOO FINANCE
          </div>
        </div>
      )}
    </div>
  );
}