import { useState } from 'react';

const SEED_SUGGESTIONS = [
  {
    title: 'Generate an NDA',
    description: 'Non-Disclosure Agreement between two parties',
    icon: '🔒',
  },
  {
    title: 'Real Estate Purchase Contract',
    description: 'Standard property purchase agreement',
    icon: '🏠',
  },
  {
    title: 'Service Level Agreement',
    description: 'SLA with pricing and termination terms',
    icon: '📋',
  },
];

export default function ChatPanel({ messages, onSendMessage, isGenerating }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion.title);
  };

  return (
    <div className="flex flex-col h-full bg-slate-25">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white">
        <h2 className="text-sm font-semibold text-slate-800">Document Chat</h2>
        <p className="text-xs text-slate-400 mt-0.5">Describe the document you need</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <>
            {/* Welcome message */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Welcome! I can help you generate professional legal documents. Tell me what you need, or pick one of the suggestions below to get started.
                </p>
              </div>
            </div>

            {/* Suggestion cards */}
            <div className="space-y-2 pt-2">
              {SEED_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                >
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                      {s.title}
                    </div>
                    <div className="text-xs text-slate-400">{s.description}</div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-xl max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" style={{ animation: 'typing-dot 1.4s infinite 0s' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" style={{ animation: 'typing-dot 1.4s infinite 0.2s' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" style={{ animation: 'typing-dot 1.4s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your document..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
