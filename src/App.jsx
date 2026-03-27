import { useState, useCallback, useRef } from 'react';
import AgentBar from './components/AgentBar';
import ChatPanel from './components/ChatPanel';
import DocumentPane from './components/DocumentPane';
import { runGeneration, runEdit } from './engine/generate';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [document, setDocument] = useState({ title: '', sections: [] });
  const [hasStarted, setHasStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [showEditHint, setShowEditHint] = useState(false);
  const [activeAgents, setActiveAgents] = useState([]);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(-1);
  const [qualityReviewActive, setQualityReviewActive] = useState(false);
  const [changedSections, setChangedSections] = useState({}); // { idx: diffSummary }
  const generatingRef = useRef(false);
  const documentRef = useRef(document);
  documentRef.current = document;

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

      // If document is already generated, treat as an edit
      if (documentRef.current.sections.length > 0 && documentRef.current.sections.every((s) => s.status === 'done')) {
        setIsGenerating(true);
        setShowEditHint(false);
        setCompletedAgents([]);
        setActiveAgents([]);

        await runEdit(content, documentRef.current, {
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

          onSectionStart(idx) {
            setActiveSectionIdx(idx);
            setDocument((prev) => {
              const sections = [...prev.sections];
              sections[idx] = { ...sections[idx], status: 'loading' };
              return { ...prev, sections };
            });
          },

          onSectionDone(idx, newContent) {
            setDocument((prev) => {
              const sections = [...prev.sections];
              sections[idx] = { ...sections[idx], status: 'done', content: newContent };
              return { ...prev, sections };
            });
          },

          onChatMessage(msg) {
            setMessages((prev) => [...prev, msg]);
          },

          onEditComplete(sectionIdx, diffSummary) {
            setChangedSections((prev) => ({ ...prev, [sectionIdx]: diffSummary }));
            setIsGenerating(false);
            generatingRef.current = false;
          },
        });

        return;
      }

      // First-time generation
      setHasStarted(true);
      setIsGenerating(true);
      setCompletedAgents([]);
      setActiveAgents([]);
      setQualityReviewActive(false);
      setChangedSections({});

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

        onQualityReviewStart() {
          setQualityReviewActive(true);
          setActiveSectionIdx(-1);
        },

        onQualityReviewDone() {
          setQualityReviewActive(false);
        },

        onChatMessage(msg) {
          setMessages((prev) => [...prev, msg]);
        },

        onComplete() {
          setIsGenerating(false);
          setDocumentReady(true);
          setShowEditHint(true);
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
          documentReady={documentReady}
          showEditHint={showEditHint}
          onDismissHint={() => setShowEditHint(false)}
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
          qualityReviewActive={qualityReviewActive}
          changedSections={changedSections}
        />
      </div>
    </div>
  );
}
