import React from 'react';

const tickers = [
  { sym: 'NIFTY 50', val: '24,318.40', chg: '+0.62%', up: true },
  { sym: 'SENSEX', val: '79,943.71', chg: '+0.55%', up: true },
  { sym: 'BANK NIFTY', val: '51,602.05', chg: '-0.31%', up: false },
  { sym: 'NIFTY IT', val: '41,887.20', chg: '+1.24%', up: true },
  { sym: 'NIFTY AUTO', val: '23,104.80', chg: '+0.88%', up: true },
  { sym: 'INR/USD', val: '83.42', chg: '+0.08%', up: true },
  { sym: 'GOLD MCX', val: '71,840', chg: '+0.43%', up: true },
  { sym: 'CRUDE MCX', val: '6,284', chg: '-1.02%', up: false },
];

export default function TickerBar() {
  const items = [...tickers, ...tickers];
  return (
    <div className="h-9 bg-panel-2 border-b border-line flex items-center overflow-hidden flex-none">
      <div className="flex-none font-mono text-xs text-txt-3 tracking-widest px-4 border-r border-line h-full flex items-center bg-navy-2">
        <span className="w-1.5 h-1.5 rounded-full bg-up mr-2 shadow-sm animate-pulse inline-block" />
        LIVE · NSE
      </div>
      <div className="flex items-center whitespace-nowrap animate-ticker">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-baseline gap-2 px-5 text-xs">
            <span className="font-semibold text-txt-2 tracking-wide">{t.sym}</span>
            <span className="font-mono text-txt-1">{t.val}</span>
            <span className={`font-mono ${t.up ? 'text-up' : 'text-down'}`}>
              {t.up ? '▲' : '▼'} {t.chg.replace('-', '')}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}