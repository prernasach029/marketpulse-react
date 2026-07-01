import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const DEFAULTS = [
  { company: 'Reliance Industries', ticker: 'RELIANCE.NS' },
  { company: 'TCS', ticker: 'TCS.NS' },
  { company: 'HDFC Bank', ticker: 'HDFCBANK.NS' },
  { company: 'Infosys', ticker: 'INFY.NS' },
  { company: '', ticker: '' },
];

export default function Portfolio() {
  const [stocks, setStocks] = useState(DEFAULTS);
  const [period, setPeriod] = useState('1y');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [advice, setAdvice] = useState('');

  const update = (i, field, val) => {
    const s = [...stocks];
    s[i][field] = val;
    setStocks(s);
  };

  const analyze = async () => {
    const valid = stocks.filter(s => s.ticker.trim());
    if (!valid.length) return;
    setLoading(true); setResults([]); setAdvice('');

    const res = await Promise.all(valid.map(s =>
      axios.post(`${API}/analyze`, {
        ticker: s.ticker.endsWith('.NS') ? s.ticker : s.ticker + '.NS',
        company: s.company || s.ticker,
        period
      }).then(r => r.data).catch(() => null)
    ));

    const validRes = res.filter(Boolean).sort((a, b) => a.composite_score - b.composite_score);
    setResults(validRes);

    try {
      const summary = validRes.map(r => `- ${r.company}: ${r.composite_score}/100, ${r.label}`).join('\n');
      const avg = (validRes.reduce((a, b) => a + b.composite_score, 0) / validRes.length).toFixed(1);
      const chatRes = await axios.post(`${API}/chat`, {
        message: `Portfolio analysis:\n${summary}\nAvg score: ${avg}/100\n\nGive portfolio summary, what to hold, watch, reduce, and one action. Be brief. No asterisks or markdown.`,
        analysis_data: {},
        history: []
      });
      setAdvice(chatRes.data.response.replace(/\*\*/g, '').replace(/\*/g, ''));
    } catch (e) {}

    setLoading(false);
  };

  const chipColor = (label) =>
    label?.includes('High') ? 'bg-down/10 text-down' :
    label?.includes('Moderate') ? 'bg-amber/10 text-amber' : 'bg-up/10 text-up';

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-txt-1">Portfolio Tracker</h1>
        <p className="font-mono text-xs text-txt-3 tracking-widest mt-1">HOME / PORTFOLIO</p>
      </div>

      <div className="bg-panel border border-line-soft rounded-xl p-4 mb-4">
        <p className="text-sm text-txt-2 mb-3">Enter up to 5 NSE stocks</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
          {stocks.map((s, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <input value={s.company} onChange={e => update(i, 'company', e.target.value)}
                placeholder={`Company ${i + 1}`}
                className="bg-panel-2 border border-line text-txt-1 font-mono text-xs rounded-lg px-2.5 py-2.5 outline-none focus:border-accent/60 placeholder-txt-3" />
              <input value={s.ticker} onChange={e => update(i, 'ticker', e.target.value)}
                placeholder="TICKER.NS"
                className="bg-panel-2 border border-line text-txt-1 font-mono text-xs rounded-lg px-2.5 py-2.5 outline-none focus:border-accent/60 placeholder-txt-3" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-2.5 outline-none">
            <option value="1y">1 Year</option>
            <option value="2y">2 Years</option>
          </select>
          <button onClick={analyze} disabled={loading}
            className="flex-1 bg-accent hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm">
            {loading ? 'Analyzing...' : 'Analyze Portfolio'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="bg-panel border border-line-soft rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-txt-1">Risk Ranking</span>
              <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">LOWEST → HIGHEST</span>
            </div>
            <div className="flex flex-col gap-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-panel-2 rounded-lg border border-line-soft">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-txt-1 truncate">{r.company}</div>
                    <div className="font-mono text-xs text-txt-3">{r.ticker}</div>
                  </div>
                  <div className="text-right mx-3">
                    <div className="font-mono text-lg font-bold text-txt-1">{r.composite_score}</div>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${chipColor(r.label)}`}>{r.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-down">-{r.var_99}%</div>
                    <div className={`font-mono text-xs ${r.regime === 'High Vol' ? 'text-amber' : 'text-up'}`}>{r.regime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="font-semibold text-sm text-txt-1 mb-3">Risk Score by Stock</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={results.map(r => ({ name: r.ticker?.replace('.NS', ''), score: r.composite_score }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5E6C8C', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111932', border: '1px solid #1E2A48', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
                  <Bar dataKey="score" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-panel border border-line-soft rounded-xl p-4">
              <div className="font-semibold text-sm text-txt-1 mb-1">Portfolio Health</div>
              <div className="font-mono text-3xl font-bold text-txt-1 mb-3">
                {(results.reduce((a, b) => a + b.composite_score, 0) / results.length).toFixed(1)}
                <span className="text-txt-3 text-sm font-normal"> / 100</span>
              </div>
              {advice && <p className="text-xs text-txt-2 leading-relaxed whitespace-pre-line">{advice}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}