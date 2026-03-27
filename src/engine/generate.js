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
 *
 * Phases:
 *   1. Specialist agents write sections one at a time
 *   2. Quality Review agent does a full-document verification pass (no section of its own)
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

  // Phase 1: Write each section
  for (let i = 0; i < doc.sections.length; i++) {
    const section = template.sections[i];

    callbacks.onActiveAgent(section.agent, section.agentTask);
    callbacks.onSectionStart(i);

    await delay(2000 + Math.random() * 1000);

    callbacks.onSectionDone(i, section.content);
    callbacks.onAgentComplete(section.agent);

    await delay(400);
  }

  // Phase 2: Quality Review — full-document verification pass
  callbacks.onActiveAgent('quality', 'Reviewing full document for consistency, contradictions, and completeness');
  callbacks.onQualityReviewStart();

  await delay(2500);

  callbacks.onQualityReviewDone();
  callbacks.onAgentComplete('quality');

  callbacks.onChatMessage({
    role: 'assistant',
    content: `Your ${template.title} is ready! Quality Review verified all sections for consistency. Fill in the highlighted fields to complete the document.`,
  });

  callbacks.onActiveAgent(null, null);
  callbacks.onComplete();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
