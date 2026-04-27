import {
  CATEGORY_DEFINITIONS,
  CATEGORY_IDS,
  CATEGORY_WEIGHTS,
  SCORE_MAX,
  SCORE_MIN,
} from "../data/categories.js";
import { compareAgainstMarket } from "./marketComparison.js?v=entry-internship";
import { buildRecommendations } from "./recommendations.js?v=entry-internship";
import { getOfferRating } from "./scoreLabels.js";

const DEFAULT_OPTIONS = Object.freeze({
  missingDataStrategy: "exclude",
  strengthThreshold: 80,
  weaknessThreshold: 60,
});

export function evaluateOffer(offer, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const inputs = offer?.ratings ?? {};
  const unknownCategoryIds = new Set(offer?.unknownCategories ?? []);
  const breakdown = CATEGORY_IDS.map((category) => buildCategoryScore(category, inputs, unknownCategoryIds));
  const knownBreakdown = breakdown.filter((item) => item.normalizedScore !== null);
  const totalKnownWeight = knownBreakdown.reduce((sum, item) => sum + item.weight, 0);

  const weightedScore =
    totalKnownWeight === 0
      ? 0
      : knownBreakdown.reduce((sum, item) => sum + item.weightedContribution, 0) *
        (100 / totalKnownWeight);

  const score = Math.round(weightedScore);
  const unknowns = breakdown.filter((item) => item.normalizedScore === null);
  const marketComparison = compareAgainstMarket({
    salary: offer?.details?.salary,
    cityId: offer?.details?.cityId,
    roleId: offer?.details?.roleId,
    offerType: offer?.details?.offerType,
    compensationPeriod: offer?.details?.compensationPeriod,
  });

  return {
    offerName: offer?.name ?? "Untitled Offer",
    score,
    scoreLabel: getOfferRating(score),
    totalKnownWeight,
    confidence: calculateConfidence(totalKnownWeight, unknowns.length),
    missingDataStrategy: config.missingDataStrategy,
    breakdown,
    strengths: findCategorySignals(breakdown, config.strengthThreshold, "strength"),
    weaknesses: findCategorySignals(breakdown, config.weaknessThreshold, "weakness"),
    unknowns: unknowns.map((item) => ({
      category: item.category,
      label: item.label,
      weight: item.weight,
      followUpPrompts: CATEGORY_DEFINITIONS[item.category].prompts,
    })),
    marketComparison,
    recommendations: buildRecommendations({ breakdown, unknowns, marketComparison }),
    metadata: {
      evaluatedAt: new Date().toISOString(),
      scoringScale: `${SCORE_MIN}-${SCORE_MAX}`,
      totalModelWeight: 100,
    },
  };
}

function buildCategoryScore(category, inputs, unknownCategoryIds) {
  const weight = CATEGORY_WEIGHTS[category];
  const definition = CATEGORY_DEFINITIONS[category];
  const rawValue = inputs[category];
  const isUnknown =
    unknownCategoryIds.has(category) ||
    rawValue === undefined ||
    rawValue === null ||
    rawValue === "" ||
    rawValue === "unknown";

  if (isUnknown) {
    return {
      category,
      label: definition.label,
      weight,
      rawScore: null,
      normalizedScore: null,
      weightedContribution: 0,
      status: "unknown",
    };
  }

  const rawScore = clampScore(Number(rawValue));
  const normalizedScore = Math.round((rawScore / SCORE_MAX) * 100);

  return {
    category,
    label: definition.label,
    weight,
    rawScore,
    normalizedScore,
    weightedContribution: (normalizedScore * weight) / 100,
    status: "scored",
  };
}

function clampScore(value) {
  if (Number.isNaN(value)) {
    return SCORE_MIN;
  }

  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
}

function findCategorySignals(breakdown, threshold, type) {
  return breakdown
    .filter((item) => {
      if (item.normalizedScore === null) {
        return false;
      }

      return type === "strength"
        ? item.normalizedScore >= threshold
        : item.normalizedScore <= threshold;
    })
    .sort((a, b) => b.weight - a.weight)
    .map((item) => ({
      category: item.category,
      label: item.label,
      score: item.normalizedScore,
      weight: item.weight,
    }));
}

function calculateConfidence(totalKnownWeight, unknownCount) {
  const weightConfidence = totalKnownWeight / 100;
  const unknownPenalty = Math.max(0, 1 - unknownCount * 0.04);

  return Math.round(weightConfidence * unknownPenalty * 100);
}
