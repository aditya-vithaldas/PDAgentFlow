import { useState, useCallback, useRef } from 'react';
import AgentBar from './components/AgentBar';
import ChatPanel from './components/ChatPanel';
import DocumentPane from './components/DocumentPane';
import { runGeneration } from './engine/generate';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [document, setDocument] = useState({ title: '', sections: [] });
  const [hasStarted, setHasStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAgents, setActiveAgents] = useState([]);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(-1);
  const generatingRef = useRef(false);

  const handleSendMessage = useCallback(
    async (content) => {
      setMessages((prev) => [...prev, { role: 'user', content }]);

      if (generatingRef.current) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'A document is currently being generated. Please wait.' },
        ]);
        return;
      }

      generatingRef.current = true;
      setHasStarted(true);
      setIsGenerating(true);
      setCompletedAgents([]);
      setActiveAgents([]);

      await runGeneration(content, {
        onDocumentInit(doc) {
          setDocument({ ...doc });
        },

        onSectionStart(idx) {
          setActiveSectionIdx(idx);
          setDocument((prev) => {
            const sections = [...prev.sections];
            sections[idx] = { ...sections[idx], status: 'loading' };
            return { ...prev, sections };
          });
        },

        onSectionDone(idx, content) {
          setDocument((prev) => {
            const sections = [...prev.sections];
            sections[idx] = { ...sections[idx], status: 'done', content };
            return { ...prev, sections };
          });
        },

        onActiveAgent(agentId, task) {
          if (agentId) {
            setActiveAgents([agentId]);
            setActiveTask(task);
          } else {
            setActiveAgents([]);
            setActiveTask(null);
            setActiveSectionIdx(-1);
          }
        },

        onAgentComplete(agentId) {
          setCompletedAgents((prev) =>
            prev.includes(agentId) ? prev : [...prev, agentId]
          );
        },

        onChatMessage(msg) {
          setMessages((prev) => [...prev, msg]);
        },

        onComplete() {
          setIsGenerating(false);
          generatingRef.current = false;
        },
      });
    },
    []
  );

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      <div className="w-[380px] min-w-[380px] border-r border-slate-200 flex flex-col">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AgentBar
          activeAgents={activeAgents}
          completedAgents={completedAgents}
          activeTask={activeTask}
        />
        <DocumentPane
          document={document}
          hasStarted={hasStarted}
          activeSectionIdx={activeSectionIdx}
        />
      </div>
    </div>
  );
}
