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

  return (
    <Router>
      <div className="flex h-screen bg-navy overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TickerBar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/stocks" element={<StockAnalysis setAnalysisData={setAnalysisData} />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/chatbot" element={<Chatbot analysisData={analysisData} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;