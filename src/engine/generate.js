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

/**
 * Run an edit pass on an existing document.
 *
 * Flow:
 *   1. Chief of Staff analyses the request and picks the target section + agent
 *   2. The specialist agent "rewrites" the section
 *   3. Callbacks surface the diff summary and highlight
 */
export async function runEdit(editRequest, currentDoc, callbacks) {
  // Phase 1: Chief of Staff analyses
  callbacks.onActiveAgent('chief', `Analysing edit request: "${editRequest}"`);
  await delay(1200);

  const match = matchEditToSection(editRequest, currentDoc);

  callbacks.onAgentComplete('chief');
  await delay(300);

  // Phase 2: Specialist agent rewrites the section
  const section = currentDoc.sections[match.sectionIdx];
  callbacks.onActiveAgent(section.agent, `Rewriting: ${section.title}`);
  callbacks.onSectionStart(match.sectionIdx);

  await delay(1800 + Math.random() * 800);

  const newContent = applySimulatedEdit(section.content, editRequest, match);
  const diffSummary = match.diffSummary;

  callbacks.onSectionDone(match.sectionIdx, newContent);
  callbacks.onAgentComplete(section.agent);

  // Phase 3: Quality review of just the changed section
  callbacks.onActiveAgent('quality', `Verifying edit in "${section.title}"`);
  await delay(1000);
  callbacks.onAgentComplete('quality');

  callbacks.onActiveAgent(null, null);

  callbacks.onChatMessage({
    role: 'assistant',
    content: `Done! I updated **${section.title}** via the ${getAgentName(section.agent)} agent.\n\n**What changed:** ${diffSummary}`,
  });

  callbacks.onEditComplete(match.sectionIdx, diffSummary);
}

function matchEditToSection(editRequest, doc) {
  const lower = editRequest.toLowerCase();
  const sections = doc.sections;

  // Keyword heuristics to match request → section
  const sectionScores = sections.map((s, idx) => {
    let score = 0;
    const combined = `${s.title} ${s.content || ''}`.toLowerCase();
    const words = lower.split(/\s+/).filter((w) => w.length > 3);
    for (const word of words) {
      if (combined.includes(word)) score += 1;
    }
    // Boost by agent-specific keywords
    if (s.agent === 'termination' && (lower.includes('terminat') || lower.includes('notice') || lower.includes('cure') || lower.includes('exit'))) score += 3;
    if (s.agent === 'pricing' && (lower.includes('price') || lower.includes('fee') || lower.includes('cost') || lower.includes('payment') || lower.includes('credit') || lower.includes('damage'))) score += 3;
    if (s.agent === 'realestate' && (lower.includes('property') || lower.includes('title') || lower.includes('inspection') || lower.includes('deed'))) score += 3;
    if (s.agent === 'chief' && (lower.includes('party') || lower.includes('parties') || lower.includes('overview') || lower.includes('signature') || lower.includes('definition'))) score += 3;
    return { idx, score };
  });

  sectionScores.sort((a, b) => b.score - a.score);
  const bestIdx = sectionScores[0].idx;
  const section = sections[bestIdx];

  // Build a human-readable diff summary
  let diffSummary = `Revised the "${section.title}" section based on your request: "${editRequest}"`;

  // Try to be more specific
  if (lower.includes('days') || lower.includes('day')) {
    const dayMatch = editRequest.match(/(\d+)\s*days?/i);
    if (dayMatch) diffSummary = `Changed the period to ${dayMatch[1]} days in "${section.title}".`;
  }
  if (lower.includes('$') || lower.includes('amount') || lower.includes('fee')) {
    const amtMatch = editRequest.match(/\$[\d,]+/);
    if (amtMatch) diffSummary = `Updated the amount to ${amtMatch[0]} in "${section.title}".`;
  }
  if (lower.includes('add') || lower.includes('include')) {
    diffSummary = `Added the requested clause to "${section.title}".`;
  }
  if (lower.includes('remove') || lower.includes('delete')) {
    diffSummary = `Removed the specified content from "${section.title}".`;
  }

  return { sectionIdx: bestIdx, diffSummary };
}

function applySimulatedEdit(originalContent, editRequest, match) {
  // In a real system this would call an LLM. Here we append a note showing the edit was applied.
  const lower = editRequest.toLowerCase();

  // Try to do a simple numeric substitution if the request mentions a number
  let content = originalContent;
  const dayMatch = editRequest.match(/(\d+)\s*days?/i);
  if (dayMatch) {
    // Replace the first [SOMETHING_DAYS] placeholder or numeric day reference
    content = content.replace(/\[\w*DAYS?\w*\]/i, dayMatch[1]);
    if (content === originalContent) {
      content = content.replace(/\d+\s*days?/i, `${dayMatch[1]} days`);
    }
  }

  const amtMatch = editRequest.match(/\$([\d,]+)/);
  if (amtMatch) {
    content = content.replace(/\$\[\w+\]/i, `$${amtMatch[1]}`);
    if (content === originalContent) {
      content = content.replace(/\$[\d,]+/, `$${amtMatch[1]}`);
    }
  }

  const yearMatch = editRequest.match(/(\d+)\s*years?/i);
  if (yearMatch) {
    content = content.replace(/\[\w*YEAR\w*\]/i, yearMatch[1]);
    if (content === originalContent) {
      content = content.replace(/\d+\s*year\(s\)/i, `${yearMatch[1]} year(s)`);
    }
  }

  return content;
}

function getAgentName(agentId) {
  const names = { chief: 'Chief of Staff', termination: 'Termination Clause', realestate: 'Real Estate', pricing: 'Pricing', quality: 'Quality Review' };
  return names[agentId] || agentId;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
