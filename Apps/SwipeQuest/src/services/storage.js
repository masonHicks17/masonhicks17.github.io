const STORAGE_KEY = "swipequest.profile.v1";

const defaultProfile = {
  xp: 0,
  level: 1,
  combo: 0,
  bestCombo: 0,
  correct: 0,
  incorrect: 0,
  skipped: 0,
  completed: 0,
  sessions: 0,
  lastMode: "swipe",
  categoryId: "all",
  categoryIds: ["all"],
  difficulty: "normal",
  completedIds: [],
  modeTotals: {},
  typeTotals: {},
  miniStats: {},
};

export function loadProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProfile };
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProfile(profile)));
}

export function resetProfile() {
  window.localStorage.removeItem(STORAGE_KEY);
  return { ...defaultProfile };
}

function normalizeProfile(profile) {
  return {
    ...defaultProfile,
    ...profile,
    categoryIds: Array.isArray(profile?.categoryIds)
      ? profile.categoryIds
      : profile?.categoryId && profile.categoryId !== "all"
        ? [profile.categoryId]
        : ["all"],
    completedIds: Array.isArray(profile?.completedIds) ? profile.completedIds : [],
    modeTotals: profile?.modeTotals && typeof profile.modeTotals === "object" ? profile.modeTotals : {},
    typeTotals: profile?.typeTotals && typeof profile.typeTotals === "object" ? profile.typeTotals : {},
    miniStats: profile?.miniStats && typeof profile.miniStats === "object" ? profile.miniStats : {},
  };
}
