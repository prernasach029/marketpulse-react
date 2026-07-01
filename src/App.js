import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import StockAnalysis from './pages/StockAnalysis';
import NewsFeed from './pages/NewsFeed';
import Portfolio from './pages/Portfolio';
import Earnings from './pages/Earnings';
import Chatbot from './pages/Chatbot';
import TickerBar from './components/TickerBar';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-navy overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`fixed md:relative z-30 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <div className="flex items-center gap-3 px-4 py-3 bg-navy-2 border-b border-line md:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-txt-2 hover:text-txt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <span className="font-bold text-sm text-txt-1">MarketPulse</span>
            <span className="font-mono text-xs text-txt-3">INDIA · NSE</span>
          </div>
          <TickerBar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/stocks" element={<StockAnalysis setAnalysisData={setAnalysisData} />} />
                <Route path="/news" element={<NewsFeed />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/chatbot" element={<Chatbot analysisData={analysisData} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;