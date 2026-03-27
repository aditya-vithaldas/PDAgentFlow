import { TEMPLATES } from '../data/templates';

function detectTemplate(input) {
  const lower = input.toLowerCase();
  if (lower.includes('nda') || lower.includes('non-disclosure') || lower.includes('confidential')) return 'nda';
  if (lower.includes('real estate') || lower.includes('purchase') || lower.includes('property')) return 'realestate';
  if (lower.includes('sla') || lower.includes('service level') || lower.includes('service agreement')) return 'sla';
  return 'nda';
}

/**
 * Run document generation.
 * No live streaming — each section shows a "working" state, then reveals content when done.
 */
export async function runGeneration(input, callbacks) {
  const templateKey = detectTemplate(input);
  const template = TEMPLATES[templateKey];

  const doc = {
    title: template.title,
    sections: template.sections.map((s) => ({
      ...s,
      status: 'pending',
      content: null,
    })),
  };

  callbacks.onDocumentInit(doc);
  await delay(500);

  callbacks.onChatMessage({
    role: 'assistant',
    content: template.chatResponse,
  });

  await delay(600);

  for (let i = 0; i < doc.sections.length; i++) {
    const section = template.sections[i];

    // Activate agent
    callbacks.onActiveAgent(section.agent, section.agentTask);

    // Mark section as loading (shows the "working on" indicator)
    callbacks.onSectionStart(i);

    // Simulate work — slower so user can see what's happening
    await delay(2000 + Math.random() * 1000);

    // Reveal content and mark done
    callbacks.onSectionDone(i, section.content);

    // Mark agent as completed
    callbacks.onAgentComplete(section.agent);

    await delay(400);
  }

  callbacks.onChatMessage({
    role: 'assistant',
    content: `Your ${template.title} is ready! Fill in the highlighted fields to complete the document.`,
  });

  callbacks.onActiveAgent(null, null);
  callbacks.onComplete();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
