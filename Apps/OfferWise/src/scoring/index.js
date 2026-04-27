export { evaluateOffer } from "./offerScore.js?v=entry-internship";
export { compareAgainstMarket } from "./marketComparison.js?v=entry-internship";
export { getOfferRating } from "./scoreLabels.js";
export { autoScoreAll, buildFactSummary } from "./autoScore.js?v=entry-internship";
export { buildRecommendations } from "./recommendations.js?v=entry-internship";
export {
  COMPENSATION_PERIOD_LABELS,
  OFFER_TYPE_LABELS,
  annualToPeriodAmount,
  formatBenchmarkRange,
  formatCompensation,
  getDefaultCompensationPeriod,
  getRoleBenchmarkForOfferType,
  normalizeCompensation,
} from "./compensation.js?v=entry-internship";
export { CATEGORY_DEFINITIONS, CATEGORY_IDS, CATEGORY_WEIGHTS } from "../data/categories.js";
export { CITY_BENCHMARKS, ROLE_BENCHMARKS } from "../data/marketData.js";
export { BENCHMARKS } from "../data/benchmarks.js";

import { evaluateOffer } from "./offerScore.js?v=entry-internship";
import { compareAgainstMarket } from "./marketComparison.js?v=entry-internship";
import { autoScoreAll } from "./autoScore.js?v=entry-internship";
import { buildRecommendations } from "./recommendations.js?v=entry-internship";
import { getRoleBenchmarkForOfferType, normalizeCompensation } from "./compensation.js?v=entry-internship";
import { CITY_BENCHMARKS, ROLE_BENCHMARKS } from "../data/marketData.js";

// High-level entry point: accepts raw fact inputs, returns a full evaluation result.
export function evaluateOfferFromFacts(inputs) {
  const cityData = CITY_BENCHMARKS[inputs.cityId] ?? null;
  const roleData = ROLE_BENCHMARKS[inputs.roleId] ?? null;
  const compensation = normalizeCompensation(inputs);
  const roleBenchmark = getRoleBenchmarkForOfferType(roleData, inputs.offerType);
  const scoringInputs = compensation
    ? { ...inputs, salary: compensation.annualized }
    : inputs;

  const { ratings, unknownCategories } = autoScoreAll(scoringInputs, cityData, roleBenchmark);

  const marketComparison = compareAgainstMarket({
    salary: inputs.salary,
    compensationPeriod: inputs.compensationPeriod,
    offerType: inputs.offerType,
    cityId: inputs.cityId,
    roleId: inputs.roleId,
  });

  const baseResult = evaluateOffer({
    name: inputs.offerName || "Untitled Offer",
    ratings,
    unknownCategories,
    details: {
      salary: compensation?.annualized ?? inputs.salary,
      cityId: inputs.cityId,
      roleId: inputs.roleId,
      offerType: inputs.offerType,
      compensationPeriod: "annual",
    },
  });

  // Replace generic recommendations with fact-aware ones
  const recommendations = buildRecommendations({
    breakdown: baseResult.breakdown,
    unknowns: baseResult.unknowns,
    marketComparison,
    rawInputs: inputs,
  });

  return { ...baseResult, marketComparison, recommendations, cityData, roleData: roleBenchmark ?? roleData };
}
