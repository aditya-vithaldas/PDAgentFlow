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

export default function ChatPanel({ messages, onSendMessage, isGenerating, documentReady, showEditHint, onDismissHint }) {
  const [input, setInput] = useState('');
  const chatEnabled = documentReady && !isGenerating;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !chatEnabled) return;
    if (showEditHint && onDismissHint) onDismissHint();
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
        <p className="text-xs text-slate-400 mt-0.5">
          {documentReady ? 'Type changes to edit your document' : 'Select a document type to get started'}
        </p>
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
                  Welcome! Choose a document type below to get started.
                </p>
              </div>
            </div>

            {/* Suggestion cards — only way to start */}
            <div className="space-y-2 pt-2">
              {SEED_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => handleSuggestionClick(s)}
                  disabled={isGenerating}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Input area — only visible after document is ready */}
      {documentReady ? (
        <div className="p-4 border-t border-slate-200 bg-white relative">
          {/* Onboarding hint */}
          {showEditHint && (
            <div className="absolute -top-16 left-4 right-4 animate-bounce-subtle">
              <div className="bg-indigo-600 text-white text-xs rounded-lg px-3 py-2 shadow-lg relative">
                Now you can make changes to your document by typing here
                <button onClick={onDismissHint} className="ml-2 text-indigo-200 hover:text-white cursor-pointer">✕</button>
                <div className="absolute bottom-0 left-6 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-indigo-600" />
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => { if (showEditHint && onDismissHint) onDismissHint(); }}
              placeholder="e.g. Change the termination period to 60 days..."
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || !chatEnabled}
              className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Select a document type above to begin
          </div>
        </div>
      )}
    </div>
  );
}
