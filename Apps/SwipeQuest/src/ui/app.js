import { categories, difficulties, modes } from "../data/challenges.js";
import { calculateXp, drawChallenge, getAccuracy, getLevelProgress, scoreAnswer, scoreSkip } from "../services/game.js";
import { loadProfile, resetProfile, saveProfile } from "../services/storage.js";

const app = document.getElementById("app");

const state = {
  screen: "challenge",
  profile: loadProfile(),
  activeModeId: "swipe",
  categoryIds: ["all"],
  difficulty: "normal",
  deck: [],
  currentIndex: 0,
  lastResult: null,
  showTuning: false,
  session: createEmptySession(),
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0,
  timerValue: 0,
  timerId: null,
  mini: {},
  miniTimerId: null,
};

document.addEventListener("DOMContentLoaded", () => {
  state.activeModeId = state.profile.lastMode || "swipe";
  state.categoryIds = state.profile.categoryIds || ["all"];
  state.difficulty = state.profile.difficulty || "normal";
  startSession();
  app.addEventListener("click", handleClick);
  app.addEventListener("pointerdown", handlePointerDown);
  app.addEventListener("pointermove", handlePointerMove);
  app.addEventListener("pointerup", handlePointerUp);
  app.addEventListener("pointercancel", resetDrag);
  window.addEventListener("keydown", handleKeydown);
});

function createEmptySession() {
  return {
    startedAt: Date.now(),
    correct: 0,
    incorrect: 0,
    skipped: 0,
    completed: 0,
    xp: 0,
    bestCombo: 0,
  };
}

function handleClick(event) {
  const action = event.target.closest("[data-action]");
  if (!action) return;

  const { action: actionName, modeId, categoryId, difficultyId, answer } = action.dataset;

  if (actionName === "play") setScreen("challenge");
  if (actionName === "modes") setScreen("modes");
  if (actionName === "stats") setScreen("stats");
  if (actionName === "summary") finishSession();
  if (actionName === "back") goBackToPortfolio();
  if (actionName === "mode") selectMode(modeId);
  if (actionName === "category") toggleCategory(categoryId);
  if (actionName === "difficulty") selectDifficulty(difficultyId);
  if (actionName === "answer") submitAnswer(parseAnswer(answer));
  if (actionName === "skip") skipChallenge();
  if (actionName === "next") nextChallenge();
  if (actionName === "reset") resetStats();
  if (actionName === "newSession") startSession();
  if (actionName === "toggleTuning") toggleTuning();
  if (actionName === "stopTimer") stopTimerChallenge();
  if (actionName === "mini") handleMiniAction(action.dataset);
}

function handleKeydown(event) {
  if (state.screen !== "challenge") return;
  const challenge = getCurrentChallenge();
  if (!challenge) return;

  if (state.lastResult && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(event.key)) {
    nextChallenge();
    return;
  }

  const options = getCardOptions(challenge);
  if (options.length) {
    const index = Number(event.key) - 1;
    if (index >= 0 && index < options.length) submitAnswer(options[index]);
    return;
  }

  if (event.key === "ArrowLeft") submitAnswer(false);
  if (event.key === "ArrowRight") submitAnswer(true);
  if (event.key.toLowerCase() === "s") skipChallenge();
}

function handlePointerDown(event) {
  if (event.target.closest("button")) return;
  if (event.target.closest(".interactive-game")) {
    handleMiniPointerDown(event);
    return;
  }
  const card = event.target.closest(".challenge-card");
  if (!card) return;
  state.isDragging = true;
  state.dragStartX = event.clientX;
  state.dragStartY = event.clientY;
  state.dragOffsetX = 0;
  state.dragOffsetY = 0;
  card.setPointerCapture?.(event.pointerId);
}

function handlePointerMove(event) {
  if (state.mini.drawing) {
    handleMiniPointerMove(event);
    return;
  }
  if (!state.isDragging) return;
  const card = event.target.closest(".challenge-card");
  if (!card) return;

  state.dragOffsetX = event.clientX - state.dragStartX;
  state.dragOffsetY = event.clientY - state.dragStartY;
  const rotate = Math.max(-8, Math.min(8, state.dragOffsetX / 16));
  card.style.transform = `translate(${state.dragOffsetX}px, ${state.dragOffsetY * 0.18}px) rotate(${rotate}deg)`;
  card.classList.toggle("drag-right", state.dragOffsetX > 24);
  card.classList.toggle("drag-left", state.dragOffsetX < -24);
  card.classList.toggle("drag-next", state.lastResult && Math.abs(state.dragOffsetY) > 28);
}

function handlePointerUp(event) {
  if (state.mini.drawing) {
    handleMiniPointerUp(event);
    return;
  }
  if (!state.isDragging) return;
  const horizontal = Math.abs(state.dragOffsetX);
  const vertical = Math.abs(state.dragOffsetY);
  const answer = state.dragOffsetX > 0;
  const canAnswer = !state.lastResult && !getCardOptions(getCurrentChallenge()).length;
  const shouldAnswer = canAnswer && horizontal > 90 && horizontal > vertical;
  const shouldAdvance = state.lastResult && (horizontal > 70 || vertical > 70);

  resetDrag(event);

  if (shouldAdvance) nextChallenge();
  if (shouldAnswer) submitAnswer(answer);
}

function resetDrag(event) {
  const card = event?.target?.closest?.(".challenge-card") || document.querySelector(".challenge-card");
  if (card) {
    card.style.transform = "";
    card.classList.remove("drag-left", "drag-right", "drag-next");
  }
  state.isDragging = false;
  state.dragStartX = 0;
  state.dragStartY = 0;
  state.dragOffsetX = 0;
  state.dragOffsetY = 0;
}

function parseAnswer(answer) {
  if (answer === "true") return true;
  if (answer === "false") return false;
  return answer;
}

function setScreen(screen) {
  state.screen = screen;
  state.lastResult = null;
  if (screen !== "challenge") clearAllTimers();
  render();
  if (screen === "challenge") beginTimerIfNeeded();
}

function selectMode(modeId) {
  state.activeModeId = modeId;
  if (modeId === "couch") state.difficulty = "easy";
  if (modeId === "chaos") state.difficulty = "hard";
  state.profile = { ...state.profile, lastMode: modeId, difficulty: state.difficulty };
  saveProfile(state.profile);
  refreshDeck();
  render();
  beginTimerIfNeeded();
}

function toggleCategory(categoryId) {
  if (categoryId === "all") {
    state.categoryIds = ["all"];
  } else {
    const current = state.categoryIds.includes("all") ? [] : [...state.categoryIds];
    state.categoryIds = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    if (state.categoryIds.length === 0) state.categoryIds = ["all"];
  }

  state.profile = { ...state.profile, categoryIds: state.categoryIds };
  saveProfile(state.profile);
  refreshDeck();
  render();
  beginTimerIfNeeded();
}

function selectDifficulty(difficultyId) {
  state.difficulty = difficultyId;
  state.profile = { ...state.profile, difficulty: difficultyId };
  saveProfile(state.profile);
  refreshDeck();
  render();
  beginTimerIfNeeded();
}

function toggleTuning() {
  state.showTuning = !state.showTuning;
  render();
  beginTimerIfNeeded();
}

function startSession() {
  clearAllTimers();
  state.session = createEmptySession();
  state.deck = [drawChallenge(getActiveMode(), state.categoryIds, state.difficulty)];
  state.currentIndex = 0;
  state.lastResult = null;
  state.showTuning = false;
  state.screen = "challenge";
  state.profile = {
    ...state.profile,
    sessions: state.profile.sessions + 1,
    lastMode: state.activeModeId,
    categoryIds: state.categoryIds,
    difficulty: state.difficulty,
  };
  saveProfile(state.profile);
  initMiniGame();
  render();
  beginTimerIfNeeded();
}

function refreshDeck() {
  const previousIds = state.deck.map((challenge) => challenge.id);
  state.deck[state.currentIndex] = drawChallenge(getActiveMode(), state.categoryIds, state.difficulty, previousIds);
  state.lastResult = null;
  clearAllTimers();
  initMiniGame();
}

function submitAnswer(userAnswer) {
  if (state.screen !== "challenge" || state.lastResult) return;
  const challenge = getCurrentChallenge();
  if (!challenge) return;

  const mode = getActiveMode();
  const correct = userAnswer === challenge.answer;
  const nextCombo = correct ? state.profile.combo + 1 : 0;
  const gained = calculateXp(challenge, correct, mode, nextCombo);
  state.profile = scoreAnswer(state.profile, challenge, correct, mode);
  state.session = {
    ...state.session,
    correct: state.session.correct + (correct ? 1 : 0),
    incorrect: state.session.incorrect + (correct ? 0 : 1),
    completed: state.session.completed + 1,
    xp: state.session.xp + gained,
    bestCombo: Math.max(state.session.bestCombo, nextCombo),
  };
  saveProfile(state.profile);
  state.lastResult = {
    status: correct ? "correct" : "wrong",
    label: correct ? getCorrectPraise() : "Missed it",
    gained,
    userAnswer,
  };
  clearTimer();
  render();
}

function submitTimeout() {
  if (state.screen !== "challenge" || state.lastResult) return;
  const challenge = getCurrentChallenge();
  if (!challenge) return;

  const mode = getActiveMode();
  const gained = calculateXp(challenge, false, mode, 0);
  state.profile = scoreAnswer(state.profile, challenge, false, mode);
  state.session = {
    ...state.session,
    incorrect: state.session.incorrect + 1,
    completed: state.session.completed + 1,
    xp: state.session.xp + gained,
  };
  saveProfile(state.profile);
  state.lastResult = {
    status: "wrong",
    label: "Time",
    gained,
    userAnswer: "Timed out",
  };
  clearAllTimers();
  render();
}

function skipChallenge() {
  if (state.screen !== "challenge" || state.lastResult) return;
  const mode = getActiveMode();
  state.profile = scoreSkip(state.profile, mode);
  state.session = {
    ...state.session,
    skipped: state.session.skipped + 1,
  };
  saveProfile(state.profile);
  state.lastResult = {
    status: "skip",
    label: "Combo dropped",
    gained: 0,
    userAnswer: "Skipped",
  };
  clearAllTimers();
  render();
}

function stopTimerChallenge() {
  const challenge = getCurrentChallenge();
  if (!challenge || challenge.miniGame !== "timer" || state.lastResult) return;
  submitAnswer(state.timerValue % 2 === 0);
}

function nextChallenge() {
  clearAllTimers();
  const previousIds = state.deck.slice(-10).map((challenge) => challenge.id);
  const next = drawChallenge(getActiveMode(), state.categoryIds, state.difficulty, previousIds);
  state.deck.push(next);
  state.currentIndex = state.deck.length - 1;
  state.lastResult = null;
  state.showTuning = false;
  state.screen = "challenge";
  initMiniGame();
  render();
  beginTimerIfNeeded();
}

function finishSession() {
  clearAllTimers();
  state.screen = "summary";
  state.lastResult = null;
  render();
}

function resetStats() {
  clearAllTimers();
  state.profile = resetProfile();
  state.activeModeId = "swipe";
  state.categoryIds = ["all"];
  state.difficulty = "normal";
  state.session = createEmptySession();
  state.deck = [];
  startSession();
}

function beginTimerIfNeeded() {
  clearTimer();
  if (state.screen !== "challenge" || state.lastResult) return;

  const mode = getActiveMode();
  const challenge = getCurrentChallenge();
  if (challenge?.isStage) return;
  const seconds = challenge?.miniGame === "timer" ? 9 : getTimerForMode(mode);
  if (!seconds) return;

  state.timerValue = seconds;
  renderTimerOnly();
  state.timerId = window.setInterval(() => {
    state.timerValue -= 1;
    renderTimerOnly();
    if (state.timerValue <= 0) submitTimeout();
  }, 1000);
}

function getTimerForMode(mode) {
  if (state.difficulty === "easy" && mode.id !== "chaos") return mode.timer + 4;
  if (state.difficulty === "hard") return Math.max(4, mode.timer - 2);
  return mode.timer;
}

function renderTimerOnly() {
  const node = document.querySelector("[data-timer]");
  if (node) node.textContent = getHudStatus(getCurrentChallenge());
}

function clearTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function clearMiniTimer() {
  if (state.miniTimerId) window.clearInterval(state.miniTimerId);
  state.miniTimerId = null;
}

function clearAllTimers() {
  clearTimer();
  clearMiniTimer();
}

function goBackToPortfolio() {
  window.location.href = "../../apps.html";
}

function getActiveMode() {
  return modes.find((mode) => mode.id === state.activeModeId) || modes[0];
}

function getCurrentChallenge() {
  return state.deck[state.currentIndex];
}

function getHudStatus(challenge) {
  if (!challenge) return "Ready";
  if (challenge.miniGame === "precisionTimer") return `${((state.mini.elapsedMs || 0) / 1000).toFixed(2)}s`;
  if (challenge.miniGame === "speedTap") return `${state.mini.remaining ?? challenge.seconds}s`;
  if (state.timerId) return `${state.timerValue}s`;
  return challenge.isStage ? "Live" : "Ready";
}

function initMiniGame() {
  const challenge = getCurrentChallenge();
  clearMiniTimer();
  if (!challenge?.isStage) {
    state.mini = {};
    return;
  }

  if (challenge.miniGame === "precisionTimer") {
    state.mini = { elapsedMs: 0, running: true };
    const started = Date.now();
    state.miniTimerId = window.setInterval(() => {
      state.mini.elapsedMs = Date.now() - started;
      renderMiniOnly();
    }, 33);
    return;
  }

  if (challenge.miniGame === "speedTap") {
    state.mini = { taps: 0, remaining: challenge.seconds };
    state.miniTimerId = window.setInterval(() => {
      state.mini.remaining -= 1;
      renderMiniOnly();
      if (state.mini.remaining <= 0) {
        completeStage(false, `${state.mini.taps}/${challenge.goal} taps`, {
          value: state.mini.taps,
          label: `${state.mini.taps} taps`,
        });
      }
    }, 1000);
    return;
  }

  if (challenge.miniGame === "tapSequence") {
    state.mini = { index: 0, tapped: [] };
    return;
  }

  if (challenge.miniGame === "matchPairs") {
    state.mini = { selectedLeft: null, selectedRight: null, matched: [] };
    return;
  }

  if (challenge.miniGame === "orderNumbers") {
    state.mini = { chosen: [] };
    return;
  }

  if (challenge.miniGame === "memoryMatch") {
    const cards = shuffleForMini(challenge.symbols).map((symbol, index) => ({ id: index, symbol }));
    state.mini = { cards, flipped: [], matched: [] };
    return;
  }

  if (challenge.miniGame === "spotDifference") {
    state.mini = { picked: null };
    return;
  }

  if (challenge.miniGame === "circleDraw") {
    state.mini = { points: [], drawing: false, score: 0 };
    return;
  }

  if (challenge.miniGame === "circleTargets") {
    state.mini = {};
  }
}

function renderMiniOnly() {
  const host = document.querySelector("[data-mini-host]");
  if (host && !state.lastResult) host.innerHTML = renderStageGame(getCurrentChallenge());
  renderTimerOnly();
}

function handleMiniAction(data) {
  const challenge = getCurrentChallenge();
  if (!challenge?.isStage || state.lastResult) return;

  if (challenge.miniGame === "precisionTimer" && data.miniAction === "stop") {
    const delta = Math.abs(state.mini.elapsedMs - challenge.targetMs);
    completeStage(delta <= challenge.toleranceMs, `${(state.mini.elapsedMs / 1000).toFixed(2)}s`, {
      value: Math.round(delta),
      label: `${Math.round(delta)}ms from target`,
      lowerIsBetter: true,
    });
  }

  if (challenge.miniGame === "speedTap" && data.miniAction === "tap") {
    state.mini.taps += 1;
    if (state.mini.taps >= challenge.goal) {
      completeStage(true, `${state.mini.taps} taps`, {
        value: state.mini.taps,
        label: `${state.mini.taps} taps`,
      });
    } else {
      renderMiniOnly();
    }
  }

  if (challenge.miniGame === "tapSequence" && data.value) {
    const expected = challenge.sequence[state.mini.index];
    if (data.value !== expected) {
      completeStage(false, `Tapped ${data.value}`);
      return;
    }
    state.mini.tapped.push(data.value);
    state.mini.index += 1;
    if (state.mini.index >= challenge.sequence.length) {
      completeStage(true, challenge.sequence.join(" → "), {
        value: challenge.sequence.length,
        label: `${challenge.sequence.length} taps in order`,
      });
    }
    else renderMiniOnly();
  }

  if (challenge.miniGame === "matchPairs") handlePairTap(data);
  if (challenge.miniGame === "orderNumbers") handleOrderTap(data);
  if (challenge.miniGame === "memoryMatch") handleMemoryTap(data);
  if (challenge.miniGame === "circleTargets" && data.value) {
    completeStage(data.value === challenge.answer, data.label || data.value, {
      value: data.value === challenge.answer ? 1 : 0,
      label: data.value === challenge.answer ? "target found" : "wrong circle",
    });
  }
  if (challenge.miniGame === "spotDifference" && data.value) {
    const picked = Number(data.value);
    state.mini.picked = picked;
    completeStage(picked === challenge.answer, `Tile ${picked}`, {
      value: picked === challenge.answer ? 1 : 0,
      label: picked === challenge.answer ? "difference found" : "wrong tile",
    });
  }
}

function handlePairTap(data) {
  const challenge = getCurrentChallenge();
  if (data.side === "left") state.mini.selectedLeft = data.value;
  if (data.side === "right") state.mini.selectedRight = data.value;

  if (state.mini.selectedLeft && state.mini.selectedRight) {
    const isMatch = challenge.pairs.some(([left, right]) => left === state.mini.selectedLeft && right === state.mini.selectedRight);
    if (isMatch) {
      state.mini.matched.push(state.mini.selectedLeft);
      state.mini.selectedLeft = null;
      state.mini.selectedRight = null;
      if (state.mini.matched.length === challenge.pairs.length) {
        completeStage(true, "All pairs matched", {
          value: challenge.pairs.length,
          label: `${challenge.pairs.length} pairs`,
        });
      }
      else renderMiniOnly();
    } else {
      completeStage(false, `${state.mini.selectedLeft} + ${state.mini.selectedRight}`, {
        value: state.mini.matched.length,
        label: `${state.mini.matched.length} pairs before miss`,
      });
    }
  } else {
    renderMiniOnly();
  }
}

function handleOrderTap(data) {
  const challenge = getCurrentChallenge();
  const value = Number(data.value);
  const sorted = [...challenge.numbers].sort((a, b) => a - b);
  const expected = sorted[state.mini.chosen.length];
  if (value !== expected) {
    completeStage(false, `Tapped ${value}`);
    return;
  }
  state.mini.chosen.push(value);
  if (state.mini.chosen.length === sorted.length) {
    completeStage(true, sorted.join(" → "), {
      value: sorted.length,
      label: `${sorted.length} numbers sorted`,
    });
  }
  else renderMiniOnly();
}

function handleMemoryTap(data) {
  const id = Number(data.value);
  if (state.mini.matched.includes(id) || state.mini.flipped.includes(id)) return;
  state.mini.flipped.push(id);

  if (state.mini.flipped.length === 2) {
    const [first, second] = state.mini.flipped;
    const firstCard = state.mini.cards.find((card) => card.id === first);
    const secondCard = state.mini.cards.find((card) => card.id === second);
    if (firstCard.symbol === secondCard.symbol) {
      state.mini.matched.push(first, second);
      state.mini.flipped = [];
      if (state.mini.matched.length === state.mini.cards.length) {
        completeStage(true, "Board cleared", {
          value: state.mini.cards.length / 2,
          label: `${state.mini.cards.length / 2} pairs cleared`,
        });
      }
      else renderMiniOnly();
    } else {
      renderMiniOnly();
      window.setTimeout(() => {
        if (!state.lastResult) {
          state.mini.flipped = [];
          renderMiniOnly();
        }
      }, 450);
    }
    return;
  }

  renderMiniOnly();
}

function handleMiniPointerDown(event) {
  const challenge = getCurrentChallenge();
  if (challenge?.miniGame !== "circleDraw" || state.lastResult) return;
  const pad = event.target.closest(".circle-pad");
  if (!pad) return;
  state.mini.drawing = true;
  state.mini.points = [getRelativePoint(event, pad)];
  pad.setPointerCapture?.(event.pointerId);
  renderMiniOnly();
}

function handleMiniPointerMove(event) {
  const challenge = getCurrentChallenge();
  if (challenge?.miniGame !== "circleDraw" || !state.mini.drawing) return;
  const pad = document.querySelector(".circle-pad");
  if (!pad) return;
  state.mini.points.push(getRelativePoint(event, pad));
  renderMiniOnly();
}

function handleMiniPointerUp() {
  const challenge = getCurrentChallenge();
  if (challenge?.miniGame !== "circleDraw" || !state.mini.drawing) return;
  state.mini.drawing = false;
  const score = scoreCircle(state.mini.points);
  state.mini.score = score;
  completeStage(score >= challenge.targetScore, `${score}% circle`, {
    value: score,
    label: `${score}% perfect`,
  });
}

function completeStage(correct, userAnswer, metric = null) {
  clearMiniTimer();
  submitAnswerWithResult(correct, userAnswer, metric);
}

function submitAnswerWithResult(correct, userAnswer, metric = null) {
  if (state.screen !== "challenge" || state.lastResult) return;
  const challenge = getCurrentChallenge();
  if (!challenge) return;

  const mode = getActiveMode();
  const nextCombo = correct ? state.profile.combo + 1 : 0;
  const gained = calculateXp(challenge, correct, mode, nextCombo);
  state.profile = scoreAnswer(state.profile, challenge, correct, mode);
  if (challenge.isStage) {
    state.profile = updateMiniStats(state.profile, challenge, correct, metric);
  }
  state.session = {
    ...state.session,
    correct: state.session.correct + (correct ? 1 : 0),
    incorrect: state.session.incorrect + (correct ? 0 : 1),
    completed: state.session.completed + 1,
    xp: state.session.xp + gained,
    bestCombo: Math.max(state.session.bestCombo, nextCombo),
  };
  saveProfile(state.profile);
  state.lastResult = {
    status: correct ? "correct" : "wrong",
    label: correct ? getCorrectPraise() : "Missed it",
    gained,
    userAnswer,
    metric,
  };
  clearTimer();
  render();
}

function updateMiniStats(profile, challenge, correct, metric) {
  const current = profile.miniStats?.[challenge.miniGame] || {
    attempts: 0,
    wins: 0,
    best: null,
    total: 0,
    last: null,
    lowerIsBetter: Boolean(metric?.lowerIsBetter),
  };
  const value = typeof metric?.value === "number" ? metric.value : correct ? 1 : 0;
  const attempts = current.attempts + 1;
  const lowerIsBetter = Boolean(metric?.lowerIsBetter || current.lowerIsBetter);
  const best = current.best === null
    ? value
    : lowerIsBetter
      ? Math.min(current.best, value)
      : Math.max(current.best, value);

  return {
    ...profile,
    miniStats: {
      ...(profile.miniStats || {}),
      [challenge.miniGame]: {
        attempts,
        wins: current.wins + (correct ? 1 : 0),
        best,
        total: current.total + value,
        last: metric?.label || String(value),
        lowerIsBetter,
      },
    },
  };
}

function getRelativePoint(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
    y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
  };
}

function scoreCircle(points) {
  if (points.length < 12) return 0;
  const cx = 50;
  const cy = 50;
  const idealRadius = 30;
  const radii = points.map((point) => Math.hypot(point.x - cx, point.y - cy));
  const lineError = radii.reduce((sum, radius) => sum + Math.abs(radius - idealRadius), 0) / radii.length;
  const closure = Math.hypot(points[0].x - points[points.length - 1].x, points[0].y - points[points.length - 1].y);
  const angles = new Set(points.map((point) => Math.round((((Math.atan2(point.y - cy, point.x - cx) + Math.PI) / (Math.PI * 2)) * 24))));
  const coveragePenalty = Math.max(0, 24 - angles.size) * 1.4;
  return Math.max(0, Math.min(100, Math.round(100 - lineError * 3.2 - closure * 1.2 - coveragePenalty)));
}

function shuffleForMini(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function getCorrectPraise() {
  const combo = state.profile.combo;
  if (combo >= 10) return "On fire";
  if (combo >= 5) return "Combo pop";
  return "Nice";
}

function render() {
  app.innerHTML = `
    <div class="app-shell mode-${state.activeModeId}">
      ${renderTopbar()}
      <main class="screen-wrap">
        ${renderScreen()}
      </main>
      ${renderBottomNav()}
    </div>
  `;
}

function renderTopbar() {
  const progress = getLevelProgress(state.profile.xp);
  return `
    <header class="topbar">
      <button class="icon-button" data-action="back" aria-label="Back to apps">‹</button>
      <button class="brand-pill" data-action="play" aria-label="SwipeQuest play">
        <span class="brand-bolt">SQ</span>
        <span>
          <strong>SwipeQuest</strong>
          <small>${getActiveMode().shortName} · ${getDifficulty().label}</small>
        </span>
      </button>
      <button class="xp-pill" data-action="stats" aria-label="View stats">
        <span>${state.profile.xp}</span>
        <small>XP</small>
      </button>
      <div class="level-bar" aria-hidden="true"><span style="width:${progress}%"></span></div>
    </header>
  `;
}

function renderScreen() {
  if (state.screen === "modes") return renderModeScreen();
  if (state.screen === "stats") return renderStatsScreen();
  if (state.screen === "summary") return renderSummaryScreen();
  return renderChallengeScreen();
}

function renderModeScreen() {
  return `
    <section class="stack-screen">
      <div class="section-heading">
        <p class="eyebrow">Tune the scroll</p>
        <h1>Modes</h1>
      </div>
      <div class="mode-grid">
        ${modes.map((mode) => `
          <button class="mode-card ${mode.id === state.activeModeId ? "selected" : ""}" data-action="mode" data-mode-id="${mode.id}">
            <span>${mode.icon}</span>
            <strong>${mode.name}</strong>
            <small>${mode.tone}</small>
          </button>
        `).join("")}
      </div>
      ${renderTuningPanel("always-open")}
    </section>
  `;
}

function renderChallengeScreen() {
  const challenge = getCurrentChallenge();
  if (!challenge) return "";
  const answeredThisSession = state.session.completed + state.session.skipped;
  return `
    <section class="challenge-screen">
      <div class="round-hud">
        <span>${answeredThisSession} played</span>
        <span>Combo ${state.profile.combo}</span>
        <span data-timer>${getHudStatus(challenge)}</span>
      </div>
      <div class="round-progress"><span style="width:${Math.min(100, answeredThisSession * 8)}%"></span></div>
      ${state.currentIndex === 0 ? renderFirstCardControls() : ""}
      <article class="challenge-card ${state.lastResult ? state.lastResult.status : ""}">
        <div class="type-pill">${challenge.type}</div>
        ${renderChallengeVisual(challenge)}
        ${challenge.title ? `<p class="card-title">${challenge.title}</p>` : ""}
        <h1>${challenge.prompt}</h1>
        ${state.lastResult ? "" : renderMiniGame(challenge)}
        ${state.lastResult ? renderResult(challenge) : challenge.isStage ? renderStageFooter(challenge) : renderAnswerControls(challenge)}
      </article>
    </section>
  `;
}

function renderFirstCardControls() {
  return `
    <div class="first-card-tools">
      <button class="tune-button" data-action="toggleTuning">${state.showTuning ? "Hide tuning" : "Mode and categories"}</button>
      <button class="done-button compact" data-action="summary">Done scrolling</button>
    </div>
    ${state.showTuning ? renderTuningPanel("inline") : ""}
  `;
}

function renderTuningPanel(extraClass) {
  return `
    <section class="tuning-panel ${extraClass}">
      <div class="segmented">
        ${difficulties.map((difficulty) => `
          <button class="${state.difficulty === difficulty.id ? "selected" : ""}" data-action="difficulty" data-difficulty-id="${difficulty.id}">
            ${difficulty.name}
          </button>
        `).join("")}
      </div>
      <div class="category-grid multi">
        ${renderCategoryButtons()}
      </div>
    </section>
  `;
}

function renderChallengeVisual(challenge) {
  if (challenge.swatch) return `<div class="brand-swatch" style="background:${challenge.swatch}"></div>`;
  if (challenge.colorWord) return `<div class="color-word" style="color:${challenge.colorWord.color}">${challenge.colorWord.text}</div>`;
  if (challenge.visual) return `<div class="challenge-visual">${challenge.visual}</div>`;
  return `<div class="challenge-visual small">${categories.find((category) => category.id === challenge.category)?.icon || "?"}</div>`;
}

function renderMiniGame(challenge) {
  if (challenge.isStage) {
    return `<div class="interactive-game" data-mini-host>${renderStageGame(challenge)}</div>`;
  }

  if (challenge.miniGame === "tapTarget") {
    return `
      <div class="tap-target-board" aria-hidden="true">
        <span class="target coral"></span>
        <span class="target blue"></span>
        <span class="target yellow"></span>
      </div>
    `;
  }
  if (challenge.miniGame === "timer") {
    return `<button class="timer-stop" data-action="stopTimer">Stop Timer</button>`;
  }
  return "";
}

function renderStageGame(challenge) {
  if (challenge.miniGame === "precisionTimer") {
    const elapsed = ((state.mini.elapsedMs || 0) / 1000).toFixed(2);
    const delta = Math.abs((state.mini.elapsedMs || 0) - challenge.targetMs);
    return `
      <div class="precision-timer">
        <div class="timer-face ${delta <= challenge.toleranceMs ? "sweet" : ""}">${elapsed}s</div>
        <div class="target-line">Target ${(challenge.targetMs / 1000).toFixed(2)}s</div>
        <button class="stage-primary" data-action="mini" data-mini-action="stop">Stop</button>
      </div>
    `;
  }

  if (challenge.miniGame === "tapSequence") {
    const positions = [
      "left:10%;top:54%", "left:33%;top:16%", "left:68%;top:22%", "left:78%;top:62%", "left:42%;top:72%",
    ];
    return `
      <div class="orbit-board">
        ${challenge.sequence.map((value, index) => `
          <button class="orbit-target ${state.mini.tapped?.includes(value) ? "hit" : ""}" style="${positions[index]}" data-action="mini" data-mini-action="tapSequence" data-value="${value}">${value}</button>
        `).join("")}
      </div>
      <div class="stage-caption">Next: ${challenge.sequence[state.mini.index || 0] || "done"}</div>
    `;
  }

  if (challenge.miniGame === "speedTap") {
    const pct = Math.min(100, Math.round(((state.mini.taps || 0) / challenge.goal) * 100));
    return `
      <div class="speed-stage">
        <button class="smash-button" data-action="mini" data-mini-action="tap">Tap</button>
        <div class="speed-meter"><span style="width:${pct}%"></span></div>
        <div class="stage-caption">${state.mini.taps || 0}/${challenge.goal} taps · ${state.mini.remaining ?? challenge.seconds}s</div>
      </div>
    `;
  }

  if (challenge.miniGame === "circleDraw") {
    const points = state.mini.points || [];
    const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    return `
      <div class="circle-pad">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="30"></circle>
          <path d="${path}"></path>
        </svg>
        <span>${points.length ? "keep tracing" : "draw here"}</span>
      </div>
    `;
  }

  if (challenge.miniGame === "circleTargets") {
    const targets = challenge.targetRule === "secondBlue"
      ? [
          { id: "blue-big", label: "biggest blue", color: "blue", size: 94, x: 8, y: 12 },
          { id: "orange", label: "orange decoy", color: "orange", size: 72, x: 58, y: 8 },
          { id: "blue-mid", label: "second biggest blue", color: "blue", size: 66, x: 42, y: 56 },
          { id: "blue-small", label: "tiny blue", color: "blue", size: 42, x: 12, y: 68 },
        ]
      : [
          { id: "green", label: "green circle", color: "green", size: 58, x: 14, y: 16 },
          { id: "orange", label: "biggest circle", color: "orange", size: 108, x: 45, y: 20 },
          { id: "blue", label: "blue circle", color: "blue", size: 76, x: 20, y: 62 },
          { id: "pink", label: "pink circle", color: "pink", size: 48, x: 70, y: 68 },
        ];

    return `
      <div class="circle-target-board">
        ${targets.map((target) => `
          <button
            class="circle-hit ${target.color}"
            style="width:${target.size}px;height:${target.size}px;left:${target.x}%;top:${target.y}%"
            aria-label="${target.label}"
            data-action="mini"
            data-value="${target.id}"
            data-label="${target.label}">
          </button>
        `).join("")}
      </div>
    `;
  }

  if (challenge.miniGame === "matchPairs") {
    const left = challenge.pairs.map(([label]) => label);
    const right = shuffleStable(challenge.pairs.map(([, label]) => label));
    return `
      <div class="pair-board">
        <div>
          ${left.map((label) => `
            <button class="${pairClass("left", label)}" data-action="mini" data-side="left" data-value="${label}">${label}</button>
          `).join("")}
        </div>
        <div>
          ${right.map((label) => `
            <button class="${pairClass("right", label)}" data-action="mini" data-side="right" data-value="${label}">${label}</button>
          `).join("")}
        </div>
      </div>
      <div class="stage-caption">Drag-style matching, tap friendly for phones.</div>
    `;
  }

  if (challenge.miniGame === "orderNumbers") {
    return `
      <div class="number-cloud">
        ${challenge.numbers.map((value, index) => `
          <button class="${state.mini.chosen?.includes(value) ? "picked" : ""}" style="--i:${index}" data-action="mini" data-value="${value}">${value}</button>
        `).join("")}
      </div>
      <div class="stage-caption">Picked: ${(state.mini.chosen || []).join(" → ") || "start low"}</div>
    `;
  }

  if (challenge.miniGame === "memoryMatch") {
    return `
      <div class="memory-grid">
        ${state.mini.cards.map((card) => {
          const open = state.mini.flipped.includes(card.id) || state.mini.matched.includes(card.id);
          return `<button class="${open ? "open" : ""}" data-action="mini" data-value="${card.id}">${open ? card.symbol : "?"}</button>`;
        }).join("")}
      </div>
    `;
  }

  if (challenge.miniGame === "spotDifference") {
    return `
      <div class="spot-grid">
        ${Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          const odd = value === challenge.answer;
          return `<button class="${odd ? "odd" : ""}" data-action="mini" data-value="${value}"><span></span><span></span>${odd ? "" : "<span></span>"}</button>`;
        }).join("")}
      </div>
      <div class="stage-caption">One tile is missing a dot.</div>
    `;
  }

  return "";
}

function renderAnswerControls(challenge) {
  const options = getCardOptions(challenge);
  if (options.length) {
    return `
      <div class="choice-grid">
        ${options.map((choice) => `
          <button class="choice-button" data-action="answer" data-answer="${escapeAttribute(choice)}">${choice}</button>
        `).join("")}
      </div>
      <div class="swipe-hint">
        <span>Tap an answer</span>
        <button class="skip-link" data-action="skip">Skip</button>
      </div>
    `;
  }

  return `
    <div class="answer-dock">
      <button class="answer-button wrong" data-action="answer" data-answer="false">Wrong</button>
      <button class="skip-button" data-action="skip">Skip</button>
      <button class="answer-button right" data-action="answer" data-answer="true">Right</button>
    </div>
    <div class="swipe-hint">
      <span>← Wrong</span>
      <span>Swipe or tap</span>
      <span>Right →</span>
    </div>
  `;
}

function renderStageFooter(challenge) {
  return `
    <div class="stage-footer">
      <span>${challenge.correctText}</span>
      <button class="skip-link" data-action="skip">Skip</button>
    </div>
  `;
}

function renderResult(challenge) {
  const isWrong = state.lastResult.status === "wrong";
  const isSkip = state.lastResult.status === "skip";
  return `
    <div class="result-panel">
      <strong>${state.lastResult.label}</strong>
      ${isWrong ? `<div class="correct-answer">Correct answer: ${challenge.correctText || formatAnswer(challenge.answer)}</div>` : ""}
      ${isSkip ? `<div class="correct-answer">Combo reset. Correct answer: ${challenge.correctText || formatAnswer(challenge.answer)}</div>` : ""}
      ${state.lastResult.metric ? `<div class="metric-chip">Your result: ${state.lastResult.metric.label}</div>` : ""}
      <p>${challenge.detail}</p>
      <div class="result-row">
        <span>+${state.lastResult.gained} XP</span>
        <span>Session +${state.session.xp} XP</span>
      </div>
      <div class="result-actions">
        <button class="secondary-button" data-action="summary">Done</button>
        <button class="primary-button" data-action="next">Next</button>
      </div>
      <div class="next-hint">Swipe any direction for the next challenge.</div>
    </div>
  `;
}

function renderStatsScreen() {
  const accuracy = getAccuracy(state.profile);
  return `
    <section class="stack-screen">
      <div class="profile-card">
        <div class="avatar-ring"><span>SQ</span></div>
        <p class="eyebrow">Stats / Profile</p>
        <h1>Level ${state.profile.level} Challenger</h1>
        <p>${state.profile.completed} completed challenges with ${state.profile.bestCombo} as your best combo.</p>
      </div>
      <div class="stats-grid">
        ${statTile("XP", state.profile.xp)}
        ${statTile("Accuracy", `${accuracy}%`)}
        ${statTile("Correct", state.profile.correct)}
        ${statTile("Wrong", state.profile.incorrect)}
        ${statTile("Skipped", state.profile.skipped)}
        ${statTile("Sessions", state.profile.sessions)}
      </div>
      <div class="insight-card">
        <h2>Challenge Mix</h2>
        ${renderTypeBreakdown()}
      </div>
      <div class="insight-card">
        <h2>Mini Game Stats</h2>
        ${renderMiniStats()}
      </div>
      <div class="home-actions">
        <button class="primary-button" data-action="play">Keep Swiping</button>
        <button class="secondary-button" data-action="reset">Reset Stats</button>
      </div>
    </section>
  `;
}

function renderSummaryScreen() {
  const answered = state.session.correct + state.session.incorrect;
  const accuracy = answered ? Math.round((state.session.correct / answered) * 100) : 0;
  return `
    <section class="stack-screen">
      <div class="profile-card summary-card">
        <p class="eyebrow">Scrolling stopped</p>
        <h1>${state.session.completed} challenges done.</h1>
        <p>${getSummaryLine(accuracy)}</p>
      </div>
      <div class="stats-grid">
        ${statTile("Session XP", state.session.xp)}
        ${statTile("Accuracy", `${accuracy}%`)}
        ${statTile("Correct", state.session.correct)}
        ${statTile("Wrong", state.session.incorrect)}
        ${statTile("Skipped", state.session.skipped)}
        ${statTile("Best Combo", state.session.bestCombo)}
      </div>
      <div class="home-actions">
        <button class="primary-button" data-action="newSession">New Scroll</button>
        <button class="secondary-button" data-action="stats">Profile</button>
      </div>
    </section>
  `;
}

function renderTypeBreakdown() {
  const entries = Object.entries(state.profile.typeTotals).slice(0, 6);
  if (!entries.length) return `<p class="empty-note">Swipe a few cards to start filling your profile.</p>`;
  return entries.map(([type, totals]) => {
    const answered = totals.correct + totals.incorrect;
    const pct = answered ? Math.round((totals.correct / answered) * 100) : 0;
    return `
      <div class="breakdown-row">
        <span>${type}</span>
        <strong>${pct}%</strong>
      </div>
    `;
  }).join("");
}

function renderMiniStats() {
  const entries = Object.entries(state.profile.miniStats || {}).slice(0, 8);
  if (!entries.length) return `<p class="empty-note">Play a stage game to unlock specific stats.</p>`;
  return entries.map(([miniGame, stats]) => {
    const avg = stats.attempts ? Math.round(stats.total / stats.attempts) : 0;
    const bestLabel = stats.lowerIsBetter ? `${stats.best}ms` : `${stats.best}`;
    const avgLabel = stats.lowerIsBetter ? `${avg}ms avg` : `${avg} avg`;
    return `
      <div class="breakdown-row">
        <span>${formatMiniName(miniGame)}<small>${stats.wins}/${stats.attempts} wins · ${stats.last}</small></span>
        <strong>${bestLabel}<small>${avgLabel}</small></strong>
      </div>
    `;
  }).join("");
}

function renderBottomNav() {
  return `
    <nav class="bottom-nav" aria-label="SwipeQuest navigation">
      <button class="${state.screen === "challenge" ? "active" : ""}" data-action="play"><span>↔</span>Swipe</button>
      <button class="${state.screen === "modes" ? "active" : ""}" data-action="modes"><span>◫</span>Tune</button>
      <button data-action="summary"><span>■</span>Done</button>
      <button class="${state.screen === "stats" ? "active" : ""}" data-action="stats"><span>◌</span>Stats</button>
    </nav>
  `;
}

function renderCategoryButtons() {
  const allButton = `
    <button class="category-chip ${state.categoryIds.includes("all") ? "selected" : ""}" data-action="category" data-category-id="all">
      <span>∞</span> All
    </button>
  `;
  return allButton + categories.map((category) => `
    <button class="category-chip ${state.categoryIds.includes(category.id) ? "selected" : ""}" data-action="category" data-category-id="${category.id}">
      <span style="color:${category.color}">${category.icon}</span> ${category.name}
    </button>
  `).join("");
}

function statTile(label, value) {
  return `
    <div class="stat-tile">
      <strong>${value}</strong>
      <span>${label}</span>
    </div>
  `;
}

function pairClass(side, label) {
  const selected = side === "left" ? state.mini.selectedLeft === label : state.mini.selectedRight === label;
  const matched = side === "left"
    ? state.mini.matched?.includes(label)
    : getCurrentChallenge().pairs.some(([left, right]) => right === label && state.mini.matched?.includes(left));
  return `pair-tile ${selected ? "selected" : ""} ${matched ? "matched" : ""}`;
}

function shuffleStable(items) {
  return [...items].sort((a, b) => a.localeCompare(b)).reverse();
}

function getDifficulty() {
  return difficulties.find((difficulty) => difficulty.id === state.difficulty) || difficulties[1];
}

function getCardOptions(challenge) {
  if (!challenge) return [];
  return Array.isArray(challenge.options) ? challenge.options : Array.isArray(challenge.choices) ? challenge.choices : [];
}

function getSummaryLine(accuracy) {
  if (state.session.completed === 0) return "No judgment. Sometimes not scrolling is the win.";
  if (accuracy >= 85) return "Sharp session. Your thumb had purpose.";
  if (accuracy >= 60) return "Solid scroll replacement. A little chaos, a little growth.";
  return "Messy but useful. The combo will forgive you eventually.";
}

function formatAnswer(answer) {
  if (answer === true) return "Right";
  if (answer === false) return "Wrong";
  return answer;
}

function formatMiniName(name) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;");
}
