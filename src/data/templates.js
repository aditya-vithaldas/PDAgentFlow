export const TEMPLATES = {
  nda: {
    title: 'Non-Disclosure Agreement',
    chatResponse: 'Generating your NDA. The Chief of Staff is coordinating the structure and delegating to specialist agents.',
    sections: [
      {
        id: 'overview',
        title: '1. Overview & Parties',
        agent: 'chief',
        agentTask: 'Structuring document and identifying parties',
        content: `This Non-Disclosure Agreement ("Agreement") is entered into as of [DATE], by and between:

Disclosing Party: [PARTY_A_NAME], a [STATE] [ENTITY_TYPE], at [PARTY_A_ADDRESS] ("Disclosing Party");
Receiving Party: [PARTY_B_NAME], a [STATE] [ENTITY_TYPE], at [PARTY_B_ADDRESS] ("Receiving Party").`,
      },
      {
        id: 'definitions',
        title: '2. Definitions',
        agent: 'chief',
        agentTask: 'Defining key terms and scope of confidential information',
        content: `"Confidential Information" means any non-public information disclosed by either Party, including trade secrets, business plans, financial data, and technical specifications.

Exclusions: information that is publicly available, independently developed, or disclosed by a third party without restriction.`,
      },
      {
        id: 'termination',
        title: '3. Term & Termination',
        agent: 'termination',
        agentTask: 'Drafting termination conditions and notice periods',
        content: `This Agreement is effective for [TERM_YEARS] year(s) from the Effective Date. Either Party may terminate with [NOTICE_DAYS] days' written notice.

Termination for breach requires [CURE_DAYS] days to cure. Confidentiality obligations survive for [SURVIVAL_YEARS] year(s) after termination.`,
      },
      {
        id: 'pricing',
        title: '4. Remedies & Penalties',
        agent: 'pricing',
        agentTask: 'Defining financial remedies and liquidated damages',
        content: `Unauthorized disclosure incurs liquidated damages of $[LIQUIDATED_DAMAGES_AMOUNT] per incident. The Disclosing Party may seek injunctive relief without posting bond.

The Receiving Party shall indemnify the Disclosing Party for all losses arising from breach, including reasonable attorney's fees.`,
      },
      {
        id: 'quality-review',
        title: '5. Quality Review',
        agent: 'quality',
        agentTask: 'Verifying consistency and cross-references',
        content: `All section cross-references verified. Defined terms are consistent throughout. Termination survival period does not conflict with base term. Remedies are complementary, not contradictory.`,
      },
      {
        id: 'signatures',
        title: '6. Signatures',
        agent: 'chief',
        agentTask: 'Preparing signature blocks',
        content: `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date last written below.

Disclosing Party: [PARTY_A_NAME]
Signature: ___________________________  Date: __________

Receiving Party: [PARTY_B_NAME]
Signature: ___________________________  Date: __________`,
      },
    ],
  },

  realestate: {
    title: 'Real Estate Purchase Agreement',
    chatResponse: 'Generating your Real Estate Purchase Agreement. Coordinating property, pricing, and termination agents.',
    sections: [
      {
        id: 'overview',
        title: '1. Agreement Overview',
        agent: 'chief',
        agentTask: 'Structuring purchase agreement and identifying parties',
        content: `This Real Estate Purchase Agreement is entered into as of [DATE] by and between:

Seller: [SELLER_NAME], at [SELLER_ADDRESS] ("Seller");
Buyer: [BUYER_NAME], at [BUYER_ADDRESS] ("Buyer").`,
      },
      {
        id: 'property',
        title: '2. Property Description',
        agent: 'realestate',
        agentTask: 'Drafting legal property description',
        content: `The property at [PROPERTY_ADDRESS], legally described as [LEGAL_DESCRIPTION], including all improvements and fixtures.

The property is sold "as-is," subject to Buyer's right of inspection within [INSPECTION_DAYS] days of the Effective Date.`,
      },
      {
        id: 'title',
        title: '3. Title & Encumbrances',
        agent: 'realestate',
        agentTask: 'Preparing title warranties',
        content: `Seller shall convey marketable title by general warranty deed, free of all liens except current-year taxes and recorded easements.

Buyer shall obtain title insurance at Buyer's expense. Title defects must be cured within [TITLE_CURE_DAYS] days or Buyer may terminate with full refund.`,
      },
      {
        id: 'pricing',
        title: '4. Purchase Price & Payment',
        agent: 'pricing',
        agentTask: 'Structuring purchase price and payment milestones',
        content: `Purchase Price: $[PURCHASE_PRICE]. Earnest money deposit: $[EARNEST_MONEY] within 3 business days.

Buyer shall obtain financing of $[LOAN_AMOUNT] at a rate not exceeding [INTEREST_RATE]%. Closing costs split per standard allocation.`,
      },
      {
        id: 'termination',
        title: '5. Default & Termination',
        agent: 'termination',
        agentTask: 'Drafting default remedies and termination rights',
        content: `Buyer default: Seller retains earnest money as liquidated damages. Seller default: Buyer may seek specific performance or terminate with full refund.

Either Party may terminate mutually in writing. Contingency failures entitle Buyer to a full earnest money refund.`,
      },
      {
        id: 'quality-review',
        title: '6. Quality Review',
        agent: 'quality',
        agentTask: 'Verifying financial consistency and completeness',
        content: `Financial amounts cross-referenced correctly. Timeline logic verified: inspection, title, and financing deadlines are non-overlapping. Default remedies are distinct for each party.`,
      },
      {
        id: 'signatures',
        title: '7. Signatures',
        agent: 'chief',
        agentTask: 'Preparing signature blocks',
        content: `Seller: [SELLER_NAME]
Signature: ___________________________  Date: __________

Buyer: [BUYER_NAME]
Signature: ___________________________  Date: __________`,
      },
    ],
  },

  sla: {
    title: 'Service Level Agreement',
    chatResponse: 'Generating your SLA. Coordinating agents for service metrics, pricing, and termination terms.',
    sections: [
      {
        id: 'overview',
        title: '1. Agreement Overview',
        agent: 'chief',
        agentTask: 'Defining service scope and parties',
        content: `This Service Level Agreement is entered into as of [DATE] by and between:

Provider: [PROVIDER_NAME] ("Provider");
Client: [CLIENT_NAME] ("Client").`,
      },
      {
        id: 'metrics',
        title: '2. Service Levels',
        agent: 'chief',
        agentTask: 'Defining uptime targets and response times',
        content: `Provider guarantees [UPTIME_PERCENT]% monthly uptime. Response times: Critical (P1): 15 min, High (P2): 1 hour, Medium (P3): 4 hours, Low (P4): 1 business day.

Scheduled maintenance windows: [MAINTENANCE_WINDOW]. Downtime during maintenance is excluded from SLA calculations.`,
      },
      {
        id: 'pricing',
        title: '3. Pricing & Credits',
        agent: 'pricing',
        agentTask: 'Structuring fees and service credit tiers',
        content: `Monthly fee: $[MONTHLY_FEE], due within 30 days of invoice. Service credits for SLA breaches: 10% (99-99.9% uptime), 25% (95-99%), 50% (below 95%).

Credits cap at 50% of monthly fee. Late payments accrue interest at [LATE_INTEREST_RATE]% per month.`,
      },
      {
        id: 'termination',
        title: '4. Term & Termination',
        agent: 'termination',
        agentTask: 'Drafting contract duration and exit procedures',
        content: `Initial term: [INITIAL_TERM_MONTHS] months, auto-renewing annually. Non-renewal requires [NON_RENEWAL_NOTICE_DAYS] days' notice.

Termination for cause: 30 days to cure. Termination for convenience: [CONVENIENCE_NOTICE_DAYS] days' notice plus early termination fee of [EARLY_TERM_FEE_MONTHS] months' fee.`,
      },
      {
        id: 'quality-review',
        title: '5. Quality Review',
        agent: 'quality',
        agentTask: 'Checking metric consistency and clause coherence',
        content: `Uptime math verified against resolution targets. Credit tiers are non-overlapping and capped. Renewal and termination notice periods are distinct and non-conflicting.`,
      },
      {
        id: 'signatures',
        title: '6. Signatures',
        agent: 'chief',
        agentTask: 'Preparing signature blocks',
        content: `Provider: [PROVIDER_NAME]
Signature: ___________________________  Date: __________

Client: [CLIENT_NAME]
Signature: ___________________________  Date: __________`,
      },
    ],
  },
};
