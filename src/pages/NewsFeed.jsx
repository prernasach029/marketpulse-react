import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function NewsFeed() {
  const [query, setQuery] = useState('NSE stock market India');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/news`, { params: { query, max_items: 15 } });
      setNews(res.data.news);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-txt-1">News Feed</h1>
        <p className="font-mono text-xs text-txt-3 tracking-widest mt-1">HOME / NEWS FEED</p>
      </div>

      <div className="bg-panel border border-line-soft rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchNews()}
          placeholder="Search news..."
          className="flex-1 bg-panel-2 border border-line text-txt-1 font-mono text-sm rounded-lg px-3 py-3 outline-none focus:border-accent/60 placeholder-txt-3"
        />
        <button
          onClick={fetchNews}
          disabled={loading}
          className="bg-accent hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {news.length === 0 && !loading && (
        <div className="bg-panel border border-line-soft rounded-xl p-8 text-center">
          <p className="text-txt-2 text-sm">Enter a search term and click Search to get latest news.</p>
        </div>
      )}

      <div className="space-y-3">
        {news.map((item, i) => (
          <div key={i} className="bg-panel border border-line-soft rounded-xl p-4 hover:border-line transition-colors">
            <div className="text-sm font-medium text-txt-1 leading-relaxed mb-2">{item.title}</div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-txt-3">
              <span className="text-txt-2 font-semibold">{item.source}</span>
              <span>·</span>
              <span>{item.date}</span>
              {item.link && (
                <>
                  <span>·</span>
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">Read →</a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}