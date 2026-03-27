import { useState, useEffect } from 'react';
import { AGENTS } from '../data/agents';

function AgentInfoPopover({ agent, onClose }) {
  const { info } = agent;
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      {/* Popover card — fixed center-top */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 w-80 bg-slate-900 border border-slate-600 rounded-xl shadow-2xl z-[70] p-5 text-left max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: agent.color }}>
              <AgentIcon id={agent.id} />
            </div>
            <h4 className="text-sm font-bold text-white">{agent.name}</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2.5">
          {[['Role', info.role], ['Personality', info.personality], ['Instructions', info.instructions], ['Output', info.output]].map(([label, text]) => (
            <div key={label}>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Agent states: 'idle' | 'active' | 'complete'
export default function AgentBar({ activeAgents, completedAgents = [], activeTask }) {
  const [expanded, setExpanded] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const hasActivity = activeAgents.length > 0 || completedAgents.length > 0;

  // Auto-expand when agents become active (e.g. during edits)
  useEffect(() => {
    if (activeAgents.length > 0) setExpanded(true);
  }, [activeAgents]);

  return (
    <div className="bg-slate-800 border-b border-slate-700 relative z-20 overflow-visible">
      {/* Collapsed bar — always visible */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47-2.47" />
          </svg>
          {activeTask ? (
            <p className="text-xs text-slate-300 truncate">
              <span className="text-slate-500 mr-1">Agent:</span>{activeTask}
            </p>
          ) : hasActivity ? (
            <p className="text-xs text-slate-400">
              {completedAgents.length} agent{completedAgents.length !== 1 ? 's' : ''} completed
            </p>
          ) : (
            <p className="text-xs text-slate-500">Agents standing by</p>
          )}
          {activeAgents.length > 0 && (
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
        >
          {expanded ? 'Hide' : 'See what your agents are doing'}
          <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded agent diagnostic panel */}
      {expanded && (
        <div className="px-4 pb-3 pt-1 border-t border-slate-700/50 animate-fade-in">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Agent Diagnostic</p>
          <div className="flex items-center gap-2 flex-wrap">
            {AGENTS.map((agent) => {
              const isActive = activeAgents.includes(agent.id);
              const isComplete = completedAgents.includes(agent.id);

              let pillClasses, iconBg, nameColor;
              if (isActive) {
                pillClasses = `${agent.tailwind.border} bg-slate-700/60 agent-active ring-2 ${agent.tailwind.ring}`;
                iconBg = { backgroundColor: agent.color };
                nameColor = 'text-white';
              } else if (isComplete) {
                pillClasses = 'border-emerald-500/50 bg-emerald-900/20';
                iconBg = { backgroundColor: '#10b981' };
                nameColor = 'text-emerald-300';
              } else {
                pillClasses = 'border-slate-500/40 bg-slate-700/20';
                iconBg = { backgroundColor: '#475569' };
                nameColor = 'text-slate-200';
              }

              return (
                <div key={agent.id} className="relative flex-shrink-0">
                  <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-300 ${pillClasses}`}>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 text-white"
                      style={iconBg}
                    >
                      {isComplete ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <AgentIcon id={agent.id} />
                      )}
                    </div>
                    <div className="text-left">
                      <div className={`text-[11px] font-semibold leading-tight ${nameColor}`}>
                        {agent.name}
                      </div>
                      <div className={`text-[10px] leading-tight ${isActive ? 'text-slate-400' : isComplete ? 'text-emerald-400/60' : 'text-slate-400'}`}>
                        {agent.shortDesc}
                      </div>
                    </div>
                    {isActive && (
                      <span className="relative flex h-2 w-2 ml-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: agent.color }} />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: agent.color }} />
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPopover(openPopover === agent.id ? null : agent.id);
                      }}
                      className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-600 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  {openPopover === agent.id && (
                    <AgentInfoPopover agent={agent} onClose={() => setOpenPopover(null)} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AgentIcon({ id }) {
  const icons = {
    chief: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    termination: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    realestate: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />,
    pricing: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
    quality: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  };
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {icons[id]}
    </svg>
  );
}
