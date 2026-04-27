import { CATEGORY_DEFINITIONS } from "../data/categories.js";
import { BENCHMARKS } from "../data/benchmarks.js";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
});

// ── Public API ────────────────────────────────────────────────────────────────

export function buildRecommendations({ breakdown, unknowns, marketComparison, rawInputs }) {
  const recs = [];

  addPayRec(recs, breakdown, marketComparison);
  addColRec(recs, breakdown, marketComparison, rawInputs);
  addBenefitsRec(recs, breakdown, rawInputs);
  addPtoRec(recs, breakdown, rawInputs);
  addWorkLifeRec(recs, breakdown, rawInputs);
  addCareerRec(recs, breakdown);
  addJobDescRec(recs, breakdown);
  addRiskRec(recs, breakdown, rawInputs);
  addUnknownsRec(recs, unknowns);

  // Dedupe by headline, cap at 6, sort by priority
  const seen = new Set();
  return recs
    .filter(r => { if (seen.has(r.headline)) return false; seen.add(r.headline); return true; })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6)
    .map(r => ({ ...r, recommendation: r.context ?? r.headline }));
}

// ── Individual recommendation builders ───────────────────────────────────────

function addPayRec(recs, breakdown, market) {
  if (!market) return;

  const payItem = breakdown.find(b => b.category === "pay");
  const isLow = ["below-range", "below-market"].includes(market.salaryPosition);
  const payLabel = market.offerType === "internship" ? "Intern Pay" : "Base Salary";
  const payTerm = market.offerType === "internship" ? "pay" : "base salary";

  if (isLow) {
    const counter = market.suggestedCounterRange;
    const pct = market.salaryPercentOfMedian;
    recs.push({
      priority: 1,
      category: "pay",
      label: payLabel,
      headline: `Counter at ${counter.formattedLow}–${counter.formattedHigh}`,
      context: `Your offer of ${market.formattedSalary} is ${pct}% of the ${market.roleLabel} market median. That puts you ${market.salaryPosition === "below-range" ? "below the typical entry point for this role" : "below median for your experience band"}.`,
      script: `"I'm genuinely excited about this role and the team. Before I sign, I'd like to revisit the ${payTerm}. I've researched the ${market.roleLabel} market and was expecting something closer to ${counter.formattedLow}. Is there room to get there, or could we discuss a signing bonus to bridge the gap?"`,
    });
  } else if (payItem && payItem.normalizedScore >= 75) {
    recs.push({
      priority: 6,
      category: "pay",
      label: payLabel,
      headline: "Pay is competitive — protect it",
      context: `${market.formattedSalary} is ${market.salaryPercentOfMedian}% of the ${market.roleLabel} median. Strong position — make sure other terms don't erode this advantage.`,
      script: null,
    });
  }
}

function addColRec(recs, breakdown, market, inputs) {
  if (!market?.estimatedMonthlySavings == null) return;
  const surplus = market?.estimatedMonthlySavings ?? null;
  if (surplus == null) return;

  const colItem = breakdown.find(b => b.category === "costOfLiving");
  if (colItem && colItem.normalizedScore < 55) {
    const shortfall = Math.abs(surplus);
    const annualEquiv = shortfall * 12;
    recs.push({
      priority: 2,
      category: "costOfLiving",
      label: "Cost of Living",
      headline: surplus < 0
        ? `Address ${fmt.format(annualEquiv)}/yr COL gap`
        : "Thin monthly margin — ask for a buffer",
      context: surplus < 0
        ? `After taxes and estimated monthly expenses in ${market.cityLabel}, the salary leaves a ~${fmt.format(shortfall)}/mo shortfall. This will create financial pressure quickly.`
        : `Your estimated monthly surplus in ${market.cityLabel} is only ${fmt.format(surplus)} — a single unexpected expense could stress your finances.`,
      script: `"I've run the numbers for ${market.cityLabel ?? "this area"}, and the current base leaves a thin margin after expenses. Could we discuss a cost-of-living adjustment or a higher base to give me a bit more runway? Even ${fmt.format(Math.round(annualEquiv / 1000) * 1000 || 5000)} more annually would make a meaningful difference."`,
    });
  }
}

function addBenefitsRec(recs, breakdown, inputs) {
  const item = breakdown.find(b => b.category === "benefits");
  if (!item || item.normalizedScore === null || item.normalizedScore >= 65) return;

  const parts = [];
  const scripts = [];

  if (inputs?.healthPremium != null && inputs.healthPremium > BENCHMARKS.health.avgEmployeePremiumMonthly) {
    const extra = inputs.healthPremium - BENCHMARKS.health.avgEmployeePremiumMonthly;
    parts.push(`Your health premium (${fmt.format(inputs.healthPremium)}/mo) is ${fmt.format(extra)}/mo above the industry average.`);
    scripts.push(`ask whether a plan with lower employee premiums is available, or whether the company would cover a larger share`);
  }

  if (inputs?.retirement401k != null && inputs.retirement401k < BENCHMARKS.retirement.avgMatch) {
    parts.push(`A ${inputs.retirement401k}% 401k match is below the industry average of ${BENCHMARKS.retirement.avgMatch}%.`);
    scripts.push(`request a higher match, or confirm when the match vests`);
  }

  if (parts.length === 0) {
    parts.push("Benefits package scores below market standards.");
    scripts.push("clarify the full benefits package before deciding");
  }

  recs.push({
    priority: 3,
    category: "benefits",
    label: "Benefits",
    headline: "Negotiate the benefits package",
    context: parts.join(" "),
    script: `"Could you walk me through the benefits package in more detail? I'd like to understand the health insurance options and ${scripts.join(", and ")}."`,
  });
}

function addPtoRec(recs, breakdown, inputs) {
  const item = breakdown.find(b => b.category === "pto");
  if (!item || item.normalizedScore === null || item.normalizedScore >= 60) return;

  const days = inputs?.ptoDays;
  const avg = BENCHMARKS.pto.midLevelAvg;

  recs.push({
    priority: 4,
    category: "pto",
    label: "Time Off",
    headline: days != null && days < avg
      ? `Ask for ${avg - days} more vacation days`
      : "Clarify time-off policy",
    context: days != null
      ? `${days} vacation days is below the industry average of ${avg}. Over a year, that gap adds up to real quality-of-life difference.`
      : "PTO terms are unclear — confirm the policy before accepting.",
    script: `"I noticed the offer includes ${days ?? "an unspecified number of"} vacation days. Industry standard for this type of role is typically ${avg}+. Is there flexibility to match that, or could we discuss additional days in lieu of a salary increase?"`,
  });
}

function addWorkLifeRec(recs, breakdown, inputs) {
  const item = breakdown.find(b => b.category === "workLifeBalance");
  if (!item || item.normalizedScore === null || item.normalizedScore >= 55) return;

  const hours = inputs?.weeklyHours;
  const overagePerWeek = hours != null ? hours - BENCHMARKS.hours.standard : null;
  const overagePerYear = overagePerWeek != null ? overagePerWeek * 48 : null;

  recs.push({
    priority: 4,
    category: "workLifeBalance",
    label: "Work-Life Balance",
    headline: hours != null && hours > 45
      ? `${hours}-hr weeks — clarify expectations and comp`
      : "Clarify schedule and flexibility terms",
    context: overagePerWeek != null && overagePerWeek > 0
      ? `Expected ${hours} hrs/wk is ${overagePerWeek} hrs above standard — roughly ${overagePerYear?.toLocaleString()} extra hours per year. That's significant and should be reflected in comp.`
      : "Low flexibility score reduces effective quality of life even at standard hours.",
    script: `"I want to make sure I have a clear picture of expectations. ${hours != null ? `Are ${hours}-hour weeks typical, or is that peak-season? ` : ""}Is there flexibility on hours or location when the work gets done? And for extended crunch periods, how does the team handle comp or recovery time?"`,
  });
}

function addCareerRec(recs, breakdown) {
  const item = breakdown.find(b => b.category === "careerGrowth");
  if (!item || item.normalizedScore === null || item.normalizedScore >= 55) return;

  recs.push({
    priority: 5,
    category: "careerGrowth",
    label: "Career Growth",
    headline: "Pin down the growth path before signing",
    context: "Career growth scored low — vague paths or missing mentorship are common regret drivers 12–18 months in.",
    script: `"Before I decide, I'd love to understand the growth path from this role. What does progression typically look like — is there a defined timeline? Is there a mentorship program or dedicated training budget? And who would I be working with most closely on the senior side?"`,
  });
}

function addJobDescRec(recs, breakdown) {
  const item = breakdown.find(b => b.category === "jobDescription");
  if (!item || item.normalizedScore === null || item.normalizedScore >= 50) return;

  recs.push({
    priority: 5,
    category: "jobDescription",
    label: "Role Clarity",
    headline: "Get the role scope in writing",
    context: "Low interest or clarity in the job description is a leading predictor of early departure. Resolve this before accepting.",
    script: `"I want to make sure I'm set up for success from day one. Could you share more about the day-to-day responsibilities and the most important priorities for this role in the first 90 days? And is there a written role scope or success metrics I could review?"`,
  });
}

function addRiskRec(recs, breakdown, inputs) {
  const item = breakdown.find(b => b.category === "risk");
  if (!item || item.normalizedScore === null || item.normalizedScore >= 50) return;

  const flags = inputs?.redFlags ?? [];
  const flagLabels = flags.slice(0, 3).join(", ");

  recs.push({
    priority: 2,
    category: "risk",
    label: "Company Stability",
    headline: "Resolve stability concerns before signing",
    context: `Risk score is low${flags.length ? ` — flagged concerns: ${flagLabels}` : ""}. A weak comp offer is doubly bad if the company isn't stable.`,
    script: `"I want to be transparent — I'm excited about the role, but I want to feel confident about the company's position before I commit. Could you walk me through the current funding runway / business stability? And is there anything you'd want a new hire to know going in?"`,
  });
}

function addUnknownsRec(recs, unknowns) {
  if (!unknowns || unknowns.length === 0) return;

  const highWeightUnknowns = unknowns
    .filter(u => ["pay", "costOfLiving", "benefits", "careerGrowth", "risk"].includes(u.category ?? u))
    .slice(0, 3);

  if (highWeightUnknowns.length === 0) return;

  const labels = highWeightUnknowns
    .map(u => CATEGORY_DEFINITIONS[u.category ?? u]?.label ?? u)
    .join(", ");

  recs.push({
    priority: 3,
    category: "unknowns",
    label: "Missing Information",
    headline: `Clarify unknowns: ${labels}`,
    context: "Your score excludes categories you marked as unknown. Getting answers on these before deciding will give you a more accurate picture.",
    script: `"Before I make a final decision, I have a few questions: ${labels.split(", ").map(l => `What can you tell me about the ${l.toLowerCase()} situation?`).join(" ")}"`,
  });
}
