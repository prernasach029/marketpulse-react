import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Newspaper, BarChart2, FileText } from 'lucide-react';

const modules = [
  { label: 'Stock Analysis', desc: 'EVT tail risk, HMM regime, FinBERT sentiment and AI insights.', path: '/stocks', icon: TrendingUp, tags: ['EVT', 'HMM', 'FinBERT'] },
  { label: 'Earnings Analysis', desc: 'Quarterly revenue, profit and EPS beat/miss history.', path: '/earnings', icon: FileText, tags: ['EPS', 'Revenue'] },
  { label: 'News Feed', desc: 'Latest financial headlines, timezone aware.', path: '/news', icon: Newspaper, tags: ['Multi-source'] },
  { label: 'Portfolio Tracker', desc: 'Rank up to 5 stocks by risk with AI advice.', path: '/portfolio', icon: BarChart2, tags: ['Ranked', 'Health score'] },
];

const watchlist = [
  { name: 'Reliance Inds.', ticker: 'RELIANCE.NS', price: '2,948.65', chg: '+1.17%', up: true, regime: 'High Vol', risk: '61', chip: 'amber' },
  { name: 'TCS', ticker: 'TCS.NS', price: '4,182.30', chg: '+0.42%', up: true, regime: 'Low Vol', risk: '28', chip: 'green' },
  { name: 'HDFC Bank', ticker: 'HDFCBANK.NS', price: '1,694.05', chg: '-0.38%', up: false, regime: 'Low Vol', risk: '33', chip: 'green' },
  { name: 'Infosys', ticker: 'INFY.NS', price: '1,571.90', chg: '+0.91%', up: true, regime: 'High Vol', risk: '47', chip: 'amber' },
  { name: 'Adani Ent.', ticker: 'ADANIENT.NS', price: '2,830.55', chg: '-2.14%', up: false, regime: 'High Vol', risk: '78', chip: 'red' },
  { name: 'Wipro', ticker: 'WIPRO.NS', price: '542.20', chg: '+0.33%', up: true, regime: 'Low Vol', risk: '31', chip: 'green' },
];

const chipColors = {
  green: 'bg-up/10 text-up',
  amber: 'bg-amber/10 text-amber',
  red: 'bg-down/10 text-down',
};

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-txt-1">Overview</h1>
        <p className="font-mono text-xs text-txt-3 tracking-widest mt-1">HOME / OVERVIEW</p>
      </div>

      {/* Hero */}
      <div className="flex items-end justify-between gap-5 flex-wrap mb-6">
        <div>
          <h2 className="text-xl font-bold text-txt-1">Welcome to MarketPulse India.</h2>
          <p className="text-txt-2 text-sm mt-1.5 max-w-lg leading-relaxed">
            Multi-model risk intelligence for NSE equities - tail risk via EVT, volatility regimes via HMM, and news sentiment via FinBERT.
          </p>
        </div>
        <div className="font-mono text-xs text-txt-3 text-right leading-relaxed">
          NSE TERMINAL<br />INDIA · EQUITY RISK
        </div>
      </div>

      {/* Snap metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-3.5">
        {[
          { l: 'NIFTY 50', v: '24,318.40', c: '+0.62%', up: true },
          { l: 'SENSEX', v: '79,943.71', c: '+0.55%', up: true },
          { l: 'India VIX', v: '14.82', c: '-3.10%', up: false, amber: true },
          { l: 'Adv / Decl', v: '1,284 / 906', c: 'BREADTH +', up: true },
        ].map((m, i) => (
          <div key={i} className="bg-panel border border-line-soft rounded-xl p-4">
            <div className="font-mono text-xs text-txt-3 tracking-widest uppercase">{m.l}</div>
            <div className={`font-mono text-2xl font-semibold mt-2.5 ${m.amber ? 'text-amber' : 'text-txt-1'}`}>{m.v}</div>
            <div className={`font-mono text-xs mt-1.5 ${m.up ? 'text-up' : 'text-down'}`}>{m.up ? '▲' : '▼'} {m.c}</div>
          </div>
        ))}
      </div>

      {/* Split: Watchlist + Modules */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {/* Watchlist */}
        <div className="col-span-1 md:col-span-3 bg-panel border border-line-soft rounded-xl p-4">
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-semibold text-sm text-txt-1">Watchlist</span>
            <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">DELAYED · RISK-RANKED</span>
          </div>
          <div className="flex flex-col gap-2">
  {watchlist.map((s, i) => (
    <div key={i} className="flex items-center justify-between p-2.5 bg-panel-2 rounded-lg border border-line-soft">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-[#152037] border border-line flex items-center justify-center font-mono font-bold text-xs text-txt-2 flex-none">{s.name[0]}</div>
        <div>
          <div className="text-sm font-medium text-txt-1">{s.name}</div>
          <div className="font-mono text-xs text-txt-3">{s.ticker}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm text-txt-1">₹{s.price}</div>
        <div className={`font-mono text-xs ${s.up ? 'text-up' : 'text-down'}`}>{s.chg}</div>
      </div>
      <div className="text-right ml-2">
        <span className={`font-mono text-xs px-2 py-0.5 rounded ${chipColors[s.chip]}`}>{s.risk}</span>
        <div className={`font-mono text-xs mt-1 ${s.regime === 'High Vol' ? 'text-amber' : 'text-up'}`}>{s.regime}</div>
      </div>
    </div>
  ))}
</div>
        

        {/* Modules */}
        <div className="col-span-1 md:col-span-2 bg-panel border border-line-soft rounded-xl p-4">
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-semibold text-sm text-txt-1">Modules</span>
            <span className="font-mono text-xs text-txt-3 border border-line px-2 py-0.5 rounded">5 TOOLS</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {modules.map(({ label, desc, path, icon: Icon, tags }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex items-start gap-3 p-3 border border-line-soft rounded-lg bg-panel-2 hover:border-accent/50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center flex-none">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-txt-1 mb-0.5">{label}</div>
                  <div className="text-xs text-txt-2 leading-relaxed">{desc}</div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {tags.map(t => (
                      <span key={t} className="font-mono text-xs text-txt-3 border border-line px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="font-mono text-xs text-txt-3 text-center mt-5 tracking-widest">
        NOT FINANCIAL ADVICE · CONSULT A SEBI-REGISTERED ADVISOR · DATA VIA YAHOO FINANCE
      </div>
    </div>
  );
}