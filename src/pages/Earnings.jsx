import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const TICKER_MAP = {
  "Reliance Industries": "RELIANCE.NS", "TCS": "TCS.NS", "HDFC Bank": "HDFCBANK.NS",
  "Infosys": "INFY.NS", "ICICI Bank": "ICICIBANK.NS", "Wipro": "WIPRO.NS",
  "HCL Technologies": "HCLTECH.NS", "Axis Bank": "AXISBANK.NS", "SBI": "SBIN.NS",
  "Bajaj Finance": "BAJFINANCE.NS", "Maruti Suzuki": "MARUTI.NS", "Sun Pharma": "SUNPHARMA.NS",
  "Titan Company": "TITAN.NS", "NTPC": "NTPC.NS", "Adani Enterprises": "ADANIENT.NS",
  "JSW Steel": "JSWSTEEL.NS", "Tata Motors": "TATAMOTORS.NS", "Bajaj Auto": "BAJAJ-AUTO.NS",
  "Coal India": "COALINDIA.NS", "Cipla": "CIPLA.NS", "Dr Reddys": "DRREDDY.NS",
  "Apollo Hospitals": "APOLLOHOSP.NS", "Zomato": "ZOMATO.NS", "LTIMindtree": "LTIM.NS",
  "Persistent Systems": "PERSISTENT.NS", "Interglobe Aviation": "INDIGO.NS",
  "Kotak Mahindra Bank": "KOTAKBANK.NS", "Larsen & Toubro": "LT.NS",
  "Asian Paints": "ASIANPAINT.NS", "Tech Mahindra": "TECHM.NS",
  "Nestle India": "NESTLEIND.NS", "Power Grid": "POWERGRID.NS",
  "Adani Ports": "ADANIPORTS.NS", "Tata Steel": "TATASTEEL.NS",
  "Tata Power": "TATAPOWER.NS", "UltraTech Cement": "ULTRACEMCO.NS",
  "IndusInd Bank": "INDUSINDBK.NS", "ONGC": "ONGC.NS",
  "Eicher Motors": "EICHERMOT.NS", "Hero MotoCorp": "HEROMOTOCO.NS",
  "Divi's Labs": "DIVISLAB.NS", "Bajaj Finserv": "BAJAJFINSV.NS",
  "Grasim Industries": "GRASIM.NS", "Info Edge": "NAUKRI.NS",
};

export default function Earnings() {
  const [company, setCompany] = useState('');
  const [manualTicker, setManualTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const effectiveTicker = company ? TICKER_MAP[company] : manualTicker.trim();

  const fetchEarnings = async () => {
    if (!effectiveTicker) {
      setError('Please select a company or enter a ticker.');
      return;
    }
    setLoading(true);
    setError('');
    setData(null);
    try {
      const t = effectiveTicker.endsWith('.NS') ? effectiveTicker : effectiveTicker + '.NS';
      const res = await axios.get(`${API}/earnings`, {
        params: { ticker: t, company: company || effectiveTicker }
      });
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Could not fetch earnings data.');
    }
    setLoading(false);
  };

  const cleanText = (text) => text?.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '') || '';

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-txt-1">Earnings Analysis</h1>
        <p className="font-mono text-xs text-txt-3 tracking-widest mt-1">HOME / EARNINGS</p>
      </div>

      <div className="bg-panel border border-line-soft rounded-xl p-4 mb-4">
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-mono text-xs text-txt-3 uppercase tracking-widest block mb-1.5">Select Company</label>
            <select
              value={company}
              onChange={e => { setCompany(e.target.value); setManualTicker(''); }}
              className="w-full bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-3 outline-none focus:border-accent/60"
            >
              <option value="">Select company...</option>
              {Object.keys(TICKER_MAP).sort().map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="font-mono text-xs text-txt-3 mt-1">Can't find your stock? Enter ticker manually below.</p>
          </div>
          <div>
            <input
              value={manualTicker}
              onChange={e => { setManualTicker(e.target.value); setCompany(''); }}
              placeholder="e.g. TCS.NS"
              className="w-full bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-3 outline-none focus:border-accent/60 placeholder-txt-3"
            />
          </div>
          <button
            onClick={fetchEarnings}
            disabled={loading}
            className="w-full bg-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Loading...' : 'Get Earnings'}
          </button>
        </div>
        {effectiveTicker && (
          <div className="mt-2 font-mono text-xs text-accent">
            Ticker: {effectiveTicker.endsWith('.NS') ? effectiveTicker : effectiveTicker + '.NS'}
          </div>
        )}
        {error && <div className="mt-2 text-down text-sm font-mono">{error}</div>}
      </div>

      {loading && (
        <div className="bg-panel border border-line-soft rounded-xl p-8 text-center">
          <div className="font-mono text-txt-2 text-sm animate-pulse">Fetching earnings data...</div>
        </div>
      )}

      {data && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'P/E Ratio', v: data.pe ?? 'N/A' },
              { l: 'EPS (TTM)', v: data.eps ?? 'N/A' },
              { l: 'Revenue (TTM)', v: data.revenue ? `₹${data.revenue} Cr` : 'N/A' },
              { l: 'Profit Margin', v: data.margin ? `${data.margin}%` : 'N/A' },
            ].map((m, i) => (
              <div key={i} className="bg-panel border border-line-soft rounded-xl p-3">
                <div className="font-mono text-xs text-txt-3 uppercase tracking-widest">{m.l}</div>
                <div className="font-mono text-lg font-semibold text-txt-1 mt-2">{m.v}</div>
              </div>
            ))}
          </div>

          {data.revenue_trend?.length > 0 && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">Revenue Trend</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">QUARTERLY · CR</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.revenue_trend}>
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111932', border: '1px solid #1E2A48', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} name="Revenue (Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.profit_trend?.length > 0 && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">Net Profit Trend</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">QUARTERLY · CR</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.profit_trend}>
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111932', border: '1px solid #1E2A48', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
                  <Bar dataKey="profit" fill="#16C77E" radius={[4, 4, 0, 0]} name="Profit (Cr)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.eps_history?.length > 0 && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">EPS — Actual vs Estimate</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">BEAT / MISS</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.eps_history}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111932', border: '1px solid #1E2A48', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 10 }} />
                  <Line type="monotone" dataKey="actual" stroke="#16C77E" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                  <Line type="monotone" dataKey="estimate" stroke="#5E6C8C" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" name="Estimate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.ai_summary && (
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-txt-1">AI Earnings Summary</span>
                <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">LLAMA 3.3 70B</span>
              </div>
              <p className="text-sm text-txt-2 leading-relaxed whitespace-pre-line">
                {cleanText(data.ai_summary)}
              </p>
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