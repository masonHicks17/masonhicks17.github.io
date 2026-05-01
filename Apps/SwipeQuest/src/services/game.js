import { challenges } from "../data/challenges.js";

export function getAccuracy(profile) {
  const answered = profile.correct + profile.incorrect;
  return answered === 0 ? 0 : Math.round((profile.correct / answered) * 100);
}

export function getLevel(xp) {
  return Math.max(1, Math.floor(xp / 160) + 1);
}

export function getLevelProgress(xp) {
  return Math.round(((xp % 160) / 160) * 100);
}

export function getChallengePool(modeId, categoryIds = ["all"], difficultyId = "normal") {
  let pool = [...challenges];
  const selectedCategories = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

  if (!selectedCategories.includes("all")) {
    pool = pool.filter((challenge) => selectedCategories.includes(challenge.category));
  }

  pool = pool.filter((challenge) => !challenge.modeCompatibility || challenge.modeCompatibility.includes(modeId));

  if (modeId === "couch") {
    pool = pool.filter((challenge) => challenge.difficulty !== "hard" && !["stop the timer", "swipe direction"].includes(challenge.type));
  } else if (modeId === "chaos") {
    pool = pool.filter((challenge) => challenge.difficulty !== "easy" || challenge.category === "sidequest");
  } else if (difficultyId !== "normal") {
    pool = pool.filter((challenge) => challenge.difficulty === difficultyId || (difficultyId === "easy" && challenge.difficulty === "normal"));
  }

  if (!pool.length) {
    pool = challenges.filter((challenge) => !challenge.modeCompatibility || challenge.modeCompatibility.includes(modeId));
  }

  return shuffle(pool.length ? pool : challenges);
}

export function createRound(mode, categoryIds, difficultyId) {
  const pool = getChallengePool(mode.id, categoryIds, difficultyId);
  return pool.slice(0, mode.roundSize).map((challenge, index) => ({
    ...challenge,
    roundIndex: index,
  }));
}

export function drawChallenge(mode, categoryIds, difficultyId, previousIds = []) {
  const pool = getChallengePool(mode.id, categoryIds, difficultyId);
  const freshPool = pool.filter((challenge) => !previousIds.includes(challenge.id));
  const preferred = freshPool.filter((challenge) => challenge.isStage || challenge.options?.length);
  const classic = freshPool.filter((challenge) => !challenge.isStage && !challenge.options?.length);

  if (preferred.length && Math.random() < 0.72) return preferred[0];
  return classic[0] || preferred[0] || pool[0] || challenges[0];
}

export function scoreAnswer(profile, challenge, isCorrect, mode) {
  const combo = isCorrect ? profile.combo + 1 : 0;
  const gainedXp = calculateXp(challenge, isCorrect, mode, combo);
  const completedIds = profile.completedIds.includes(challenge.id)
    ? profile.completedIds
    : [...profile.completedIds, challenge.id];

  return {
    ...profile,
    xp: profile.xp + gainedXp,
    level: getLevel(profile.xp + gainedXp),
    combo,
    bestCombo: Math.max(profile.bestCombo, combo),
    correct: profile.correct + (isCorrect ? 1 : 0),
    incorrect: profile.incorrect + (isCorrect ? 0 : 1),
    completed: profile.completed + 1,
    completedIds,
    modeTotals: incrementNested(profile.modeTotals, mode.id, isCorrect ? "correct" : "incorrect"),
    typeTotals: incrementNested(profile.typeTotals, challenge.type, isCorrect ? "correct" : "incorrect"),
  };
}

export function calculateXp(challenge, isCorrect, mode, combo) {
  const comboBonus = isCorrect ? Math.min(10, Math.floor(combo / 3) * 2) : 0;
  const baseXp = isCorrect ? challenge.xp + comboBonus : Math.max(2, Math.round(challenge.xp * 0.2));
  return Math.round(baseXp * mode.xpMultiplier);
}

export function scoreSkip(profile, mode) {
  return {
    ...profile,
    combo: 0,
    skipped: profile.skipped + 1,
    modeTotals: incrementNested(profile.modeTotals, mode.id, "skipped"),
  };
}

function incrementNested(source, key, metric) {
  const next = { ...source };
  const item = { correct: 0, incorrect: 0, skipped: 0, completed: 0, ...(next[key] || {}) };
  item[metric] += 1;
  if (metric !== "skipped") item.completed += 1;
  next[key] = item;
  return next;
}

function shuffle(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}
