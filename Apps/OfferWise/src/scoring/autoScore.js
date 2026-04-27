// Converts raw offer facts into 1-10 ratings for the scoring engine.
// All internal computations run on a 0-100 scale; results are mapped to 1-10.

import { BENCHMARKS } from "../data/benchmarks.js";
import { getMonthlyExpenseEstimate, getTakeHomeRate } from "./compensation.js?v=entry-internship";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
});

// ── Public API ────────────────────────────────────────────────────────────────

export function autoScoreAll(inputs, cityData, roleData) {
  const entries = {
    pay:              () => scorePay(inputs.salary, roleData),
    costOfLiving:     () => scoreColAdjustedPay(inputs.salary, cityData, inputs.offerType),
    benefits:         () => scoreBenefits(inputs.healthPremium, inputs.retirement401k, inputs.offerType),
    pto:              () => scorePto(inputs.ptoDays, inputs.sickDays, inputs.holidays, inputs.offerType),
    workLifeBalance:  () => scoreWorkLifeBalance(inputs.weeklyHours, inputs.flexibility),
    careerGrowth:     () => scaleRating(inputs.careerGrowth),
    jobDescription:   () => scaleRating(inputs.jobDescription),
    location:         () => scaleRating(inputs.location),
    relocation:       () => scoreRelocation(inputs.relocation),
    risk:             () => scoreRisk(inputs.risk, inputs.redFlags ?? [], inputs.companyType),
  };

  const ratings = {};
  const unknownCategories = [];

  for (const [key, fn] of Object.entries(entries)) {
    const val = fn();
    ratings[key] = val ?? "unknown";
    if (val == null) unknownCategories.push(key);
  }

  return { ratings, unknownCategories };
}

// Returns a plain-English summary of what the scores mean for the results page.
export function buildFactSummary(inputs, cityData, roleData) {
  const summary = {};

  if (inputs.salary && roleData) {
    const pct = Math.round((inputs.salary / roleData.salaryMedian) * 100);
    const pos = getSalaryPositionLabel(inputs.salary, roleData);
    summary.pay = `${fmt.format(inputs.salary)} — ${pct}% of the ${roleData.label} median (${pos})`;
  }

  if (inputs.salary && cityData) {
    const monthlyNet = (inputs.salary * getTakeHomeRate(inputs.offerType)) / 12;
    const monthlyExpenses = getMonthlyExpenseEstimate(cityData, inputs.offerType);
    const surplus = Math.round(monthlyNet - monthlyExpenses);
    summary.costOfLiving = surplus >= 0
      ? `~${fmt.format(surplus)}/mo surplus after estimated ${cityData.label} expenses`
      : `~${fmt.format(Math.abs(surplus))}/mo shortfall vs. estimated ${cityData.label} expenses`;
  }

  if (inputs.healthPremium != null || inputs.retirement401k != null) {
    const parts = [];
    if (inputs.healthPremium != null)
      parts.push(`${fmt.format(inputs.healthPremium)}/mo premium (avg: ${fmt.format(BENCHMARKS.health.avgEmployeePremiumMonthly)}/mo)`);
    if (inputs.retirement401k != null)
      parts.push(`${inputs.retirement401k}% 401k match (avg: ${BENCHMARKS.retirement.avgMatch}%)`);
    summary.benefits = parts.join(" · ");
  }

  if (inputs.ptoDays != null) {
    const total = inputs.ptoDays + (inputs.sickDays ?? BENCHMARKS.pto.avgSickDays) + (inputs.holidays ?? BENCHMARKS.pto.avgCompanyHolidays);
    summary.pto = `${inputs.ptoDays} vacation + ${inputs.sickDays ?? BENCHMARKS.pto.avgSickDays} sick + ${inputs.holidays ?? BENCHMARKS.pto.avgCompanyHolidays} holidays = ${total} total days off`;
  }

  if (inputs.weeklyHours != null) {
    const diff = inputs.weeklyHours - BENCHMARKS.hours.standard;
    summary.workLifeBalance = diff <= 0
      ? `${inputs.weeklyHours} hrs/wk — at or below standard`
      : `${inputs.weeklyHours} hrs/wk — ${diff} hrs above standard 40`;
  }

  return summary;
}

// ── Internal scoring functions ─────────────────────────────────────────────────

function toRating(score100) {
  if (score100 == null) return null;
  return Math.max(1, Math.min(10, Math.round(score100 / 10)));
}

// 1-5 guided scale → 0-100 → 1-10 rating
function scaleRating(value) {
  if (value == null) return null;
  const map = { 1: 12, 2: 30, 3: 52, 4: 73, 5: 92 };
  return toRating(map[value] ?? null);
}

function scorePay(salary, role) {
  if (!salary || !role) return null;
  const { salaryLow, salaryMedian, salaryHigh } = role;

  let score;
  if (salary < salaryLow * 0.8)      score = lerp(5, 25, (salary) / (salaryLow * 0.8));
  else if (salary < salaryLow)        score = lerp(25, 38, (salary - salaryLow * 0.8) / (salaryLow * 0.2));
  else if (salary < salaryMedian)     score = lerp(38, 62, (salary - salaryLow) / (salaryMedian - salaryLow));
  else if (salary < salaryHigh)       score = lerp(62, 80, (salary - salaryMedian) / (salaryHigh - salaryMedian));
  else                                score = Math.min(95, 80 + ((salary - salaryHigh) / salaryHigh) * 120);

  return toRating(score);
}

function scoreColAdjustedPay(salary, city, offerType = "newGrad") {
  if (!salary || !city) return null;
  const monthlyNet = (salary * getTakeHomeRate(offerType)) / 12;
  const ratio = monthlyNet / getMonthlyExpenseEstimate(city, offerType);

  let score;
  if (ratio < 0.6)       score = lerp(3, 18, ratio / 0.6);
  else if (ratio < 0.85) score = lerp(18, 35, (ratio - 0.6) / 0.25);
  else if (ratio < 1.05) score = lerp(35, 54, (ratio - 0.85) / 0.2);
  else if (ratio < 1.35) score = lerp(54, 72, (ratio - 1.05) / 0.3);
  else if (ratio < 1.8)  score = lerp(72, 86, (ratio - 1.35) / 0.45);
  else                   score = Math.min(96, 86 + ((ratio - 1.8) / 0.6) * 10);

  return toRating(score);
}

function scoreBenefits(healthPremium, retirement401k, offerType = "newGrad") {
  if (healthPremium == null && retirement401k == null) return null;
  if (offerType === "internship") {
    let healthScore = 55;
    if (healthPremium != null) {
      if (healthPremium <= 0)        healthScore = 92;
      else if (healthPremium <= 150) healthScore = 72;
      else if (healthPremium <= 300) healthScore = 45;
      else                          healthScore = 20;
    }

    let retScore = 60;
    if (retirement401k != null) {
      if (retirement401k >= 3)       retScore = 90;
      else if (retirement401k >= 1)  retScore = 70;
      else                           retScore = 55;
    }

    return toRating(healthScore * 0.7 + retScore * 0.3);
  }

  let healthScore = 55;
  if (healthPremium != null) {
    if (healthPremium <= 0)   healthScore = 96;
    else if (healthPremium <= 50)  healthScore = 90;
    else if (healthPremium <= 120) healthScore = 78;
    else if (healthPremium <= 200) healthScore = 62;
    else if (healthPremium <= 320) healthScore = 42;
    else                           healthScore = 18;
  }

  let retScore = 50;
  if (retirement401k != null) {
    if (retirement401k >= 6)       retScore = 95;
    else if (retirement401k >= 5)  retScore = 85;
    else if (retirement401k >= 4)  retScore = 74;
    else if (retirement401k >= 3)  retScore = 62;
    else if (retirement401k >= 1)  retScore = 42;
    else                           retScore = 18;
  }

  return toRating(healthScore * 0.55 + retScore * 0.45);
}

function scorePto(ptoDays, sickDays, holidays, offerType = "newGrad") {
  if (ptoDays == null) return null;
  if (offerType === "internship") {
    const sick = sickDays ?? 0;
    const hols = holidays ?? 0;
    const total = ptoDays + sick + hols;

    let score;
    if (total <= 0)       score = 48;
    else if (total < 3)   score = lerp(55, 65, total / 3);
    else if (total < 6)   score = lerp(65, 78, (total - 3) / 3);
    else if (total < 10)  score = lerp(78, 90, (total - 6) / 4);
    else                  score = 94;

    return toRating(score);
  }

  const sick = sickDays ?? BENCHMARKS.pto.avgSickDays;
  const hols = holidays ?? BENCHMARKS.pto.avgCompanyHolidays;
  const total = ptoDays + sick + hols;

  let score;
  if (total < 18)      score = lerp(5, 22, total / 18);
  else if (total < 25) score = lerp(22, 45, (total - 18) / 7);
  else if (total < 31) score = lerp(45, 65, (total - 25) / 6);
  else if (total < 38) score = lerp(65, 80, (total - 31) / 7);
  else if (total < 46) score = lerp(80, 92, (total - 38) / 8);
  else                 score = 94;

  return toRating(score);
}

function scoreWorkLifeBalance(weeklyHours, flexibility) {
  if (weeklyHours == null && flexibility == null) return null;

  let hoursScore = 60;
  if (weeklyHours != null) {
    if (weeklyHours <= 37)      hoursScore = 94;
    else if (weeklyHours <= 40) hoursScore = 82;
    else if (weeklyHours <= 43) hoursScore = 68;
    else if (weeklyHours <= 47) hoursScore = 50;
    else if (weeklyHours <= 52) hoursScore = 30;
    else                        hoursScore = 10;
  }

  let flexScore = 60;
  if (flexibility != null) {
    const map = { 1: 12, 2: 30, 3: 55, 4: 76, 5: 93 };
    flexScore = map[flexibility] ?? 60;
  }

  return toRating(hoursScore * 0.62 + flexScore * 0.38);
}

function scoreRelocation(relocation) {
  if (relocation === "full")         return toRating(92);
  if (relocation === "partial")      return toRating(62);
  if (relocation === "none-local")   return toRating(80);
  if (relocation === "none-moving")  return toRating(14);
  return null;
}

function scoreRisk(risk, redFlags, companyType) {
  if (risk == null) return null;

  const base = { 1: 12, 2: 30, 3: 52, 4: 73, 5: 92 }[risk] ?? 52;
  const penalty = (redFlags ?? []).length * 9;
  const typeBonus = {
    "government":       12,
    "enterprise":        9,
    "public":            6,
    "established":       3,
    "nonprofit":         0,
    "startup-series-b": -6,
    "startup-series-a": -12,
    "startup-seed":     -20,
  }[companyType] ?? 0;

  return toRating(Math.max(5, Math.min(97, base - penalty + typeBonus)));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function getSalaryPositionLabel(salary, role) {
  if (salary < role.salaryLow)                    return "below range";
  if (salary < role.salaryMedian * 0.95)          return "below market";
  if (salary <= role.salaryMedian * 1.08)         return "at market";
  if (salary <= role.salaryHigh)                  return "above market";
  return "top of range";
}
