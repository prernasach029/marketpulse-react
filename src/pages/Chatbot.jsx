import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const suggestions = [
  "Should I invest in this stock?",
  "What does VaR mean?",
  "How do I diversify my portfolio?",
  "What is High Vol regime?",
];

export default function Chatbot({ analysisData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        message: msg,
        analysis_data: analysisData || {},
        history: newMessages.slice(-8)
      });
      setMessages([...newMessages, { role: 'assistant', content: res.data.response }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col" style={{height: 'calc(100vh - 120px)'}}>
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-txt-1">AI Assistant</h1>
        <p className="font-mono text-xs text-txt-3 tracking-widest mt-1">ASSISTANT / CHATBOT</p>
      </div>

      {analysisData && (
        <div className="bg-panel border border-line-soft rounded-lg px-4 py-3 mb-4 font-mono text-xs text-txt-2">
          Context: {analysisData.company} ({analysisData.ticker}) · Risk: {analysisData.composite_score}/100 · {analysisData.label}
        </div>
      )}

      <div className="flex-1 bg-panel border border-line-soft rounded-xl p-4 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <div>
            <p className="text-txt-3 text-sm mb-4 font-mono">Suggested questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="text-left text-xs text-txt-2 bg-panel-2 border border-line-soft rounded-lg px-3 py-3 hover:border-accent/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-xl rounded-xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-accent text-white'
                : 'bg-panel-2 border border-line-soft text-txt-1'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-panel-2 border border-line-soft rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-txt-3 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                <span className="w-1.5 h-1.5 bg-txt-3 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                <span className="w-1.5 h-1.5 bg-txt-3 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && send()}
          placeholder="Ask anything about stocks or investing..."
          className="flex-1 bg-panel border border-line-soft text-txt-1 text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 placeholder-txt-3"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="bg-accent hover:bg-blue-600 text-white rounded-xl px-4 py-3 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="font-mono text-xs text-txt-3 text-center mt-3 pb-2">Not financial advice · Consult a SEBI-registered advisor</p>
    </div>
  );
}