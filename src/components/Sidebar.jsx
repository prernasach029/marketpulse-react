import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Newspaper, 
  BarChart2, FileText, MessageSquare, ChevronDown, ChevronRight
} from 'lucide-react';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Stock Analysis', path: '/stocks', icon: TrendingUp },
  { label: 'News Feed', path: '/news', icon: Newspaper },
  { label: 'Portfolio', path: '/portfolio', icon: BarChart2 },
  { label: 'Earnings', path: '/earnings', icon: FileText },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [homeOpen, setHomeOpen] = useState(true);

  return (
    <aside className="w-full md:w-56 bg-navy-2 border-r border-line flex flex-col flex-none md:flex-none" style={{maxHeight: window.innerWidth < 768 ? 'auto' : '100vh'}}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-line">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center flex-none shadow-lg">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l5-6 4 4 6-8"/><path d="M21 7v4h-4"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-sm text-txt-1 leading-none">MarketPulse</div>
          <div className="font-mono text-xs text-txt-3 tracking-widest mt-1">INDIA · NSE</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="font-mono text-xs text-txt-3 tracking-widest uppercase px-2 mb-2">Home</div>
        
        {/* Home dropdown */}
        <button
          onClick={() => setHomeOpen(!homeOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-txt-2 hover:bg-panel hover:text-txt-1 transition-colors text-sm font-medium mb-1"
        >
          <span>Navigate</span>
          {homeOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {homeOpen && (
          <div className="pl-3 flex flex-col gap-0.5 mb-2">
            {navItems.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-accent/15 text-white'
                      : 'text-txt-2 hover:bg-panel hover:text-txt-1'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-accent' : ''} />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div className="border-t border-line my-2" />
        <div className="font-mono text-xs text-txt-3 tracking-widest uppercase px-2 mb-2">Assistant</div>
        <button
          onClick={() => navigate('/chatbot')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/chatbot'
              ? 'bg-accent/15 text-white'
              : 'text-txt-2 hover:bg-panel hover:text-txt-1'
          }`}
        >
          <MessageSquare size={15} className={location.pathname === '/chatbot' ? 'text-accent' : ''} />
          AI Chatbot
        </button>
      </nav>
    </aside>
  );
}