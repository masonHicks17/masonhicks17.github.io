const ALL_MODES = ["swipe", "couch", "chaos", "sidequest"];
const QUICK_MODES = ["swipe", "couch", "chaos"];
const ACTIVE_MODES = ["swipe", "chaos", "sidequest"];
const SIDEQUEST_MODES = ["sidequest", "swipe"];

export const modes = [
  { id: "swipe", name: "Swipe Mode", shortName: "Swipe", icon: "↔", tone: "Mixed and balanced.", description: "A steady blend of quick questions and active challenges.", roundSize: 999, xpMultiplier: 1, timer: 12 },
  { id: "couch", name: "Couch Mode", shortName: "Couch", icon: "◔", tone: "Easy, cozy, slightly ridiculous.", description: "Softer questions, slower pace, and kinder feedback for couch-brain mode.", roundSize: 999, xpMultiplier: 0.9, timer: 18 },
  { id: "chaos", name: "Chaos Mode", shortName: "Chaos", icon: "✦", tone: "Fast, intense, no coasting.", description: "Harder cards, a short fuse, and louder rewards for streaks.", roundSize: 999, xpMultiplier: 1.45, timer: 5 },
  { id: "sidequest", name: "Side Quest Mode", shortName: "Quest", icon: "◇", tone: "Tiny themed missions.", description: "Special objective rounds built around active challenge types.", roundSize: 999, xpMultiplier: 1.2, timer: 10 },
];

export const difficulties = [
  { id: "easy", name: "Easy", label: "Cozy" },
  { id: "normal", name: "Normal", label: "Balanced" },
  { id: "hard", name: "Hard", label: "Spicy" },
];

export const categories = [
  { id: "math", name: "Brain Sprints", icon: "×", color: "#ff6b35" },
  { id: "brands", name: "Brand Radar", icon: "◆", color: "#2f80ed" },
  { id: "pop", name: "Pop Guess", icon: "★", color: "#a855f7" },
  { id: "memory", name: "Memory Sparks", icon: "◈", color: "#f7b801" },
  { id: "trivia", name: "Truth Filter", icon: "?", color: "#ef476f" },
  { id: "sidequest", name: "Side Quests", icon: "◇", color: "#00a878" },
];

export const challenges = [
  // 20 math challenges
  mc("math-001", "quick addition", "math", "Mental Sprint", "38 + 47", "85", ["83", "85", "87", "95"], "85", "38 + 47 = 85.", "easy", 10, QUICK_MODES),
  mc("math-002", "multiplication", "math", "Table Snap", "7 × 8", "56", ["48", "54", "56", "64"], "56", "Seven eights make 56.", "easy", 10, QUICK_MODES),
  mc("math-003", "percentages", "math", "Tip Brain", "20% of $45", "$9", ["$6", "$8", "$9", "$12"], "$9", "10% is $4.50, so 20% is $9.", "easy", 12, QUICK_MODES),
  mc("math-004", "subtraction", "math", "Change Check", "100 - 37", "63", ["53", "61", "63", "73"], "63", "100 minus 37 is 63.", "easy", 10, QUICK_MODES),
  mc("math-005", "division", "math", "Split It", "144 ÷ 12", "12", ["10", "11", "12", "14"], "12", "12 × 12 = 144.", "easy", 12, QUICK_MODES),
  mc("math-006", "multiplication", "math", "Sneaky Product", "9 × 6", "54", ["52", "54", "56", "64"], "54", "9 × 6 = 54.", "normal", 12, QUICK_MODES),
  mc("math-007", "percentages", "math", "Sale Tag", "30% off $50 saves", "$15", ["$10", "$12", "$15", "$20"], "$15", "30% of 50 is 15.", "normal", 13, QUICK_MODES),
  mc("math-008", "fractions", "math", "Fraction Flip", "3/4 of 64", "48", ["42", "46", "48", "52"], "48", "One quarter is 16, so three quarters is 48.", "normal", 14, QUICK_MODES),
  mc("math-009", "quick addition", "math", "Two-Step Sum", "26 + 39 + 15", "80", ["70", "78", "80", "84"], "80", "26 + 39 is 65, plus 15 is 80.", "normal", 14, QUICK_MODES),
  mc("math-010", "squares", "math", "Square Tap", "13²", "169", ["139", "156", "169", "196"], "169", "13 squared is 169.", "normal", 15, QUICK_MODES),
  mc("math-011", "averages", "math", "Average It", "Average of 6, 10, 14", "10", ["8", "9", "10", "12"], "10", "30 divided by 3 is 10.", "normal", 13, QUICK_MODES),
  mc("math-012", "estimation", "math", "Fast Estimate", "198 + 403 is closest to", "600", ["500", "580", "600", "700"], "600", "198 + 403 = 601.", "normal", 12, QUICK_MODES),
  mc("math-013", "percentages", "math", "Hard Percent", "15% of 200", "30", ["20", "25", "30", "35"], "30", "10% is 20 and 5% is 10.", "hard", 15, ["swipe", "chaos"]),
  mc("math-014", "multiplication", "math", "Double Digit", "14 × 6", "84", ["74", "80", "84", "96"], "84", "10×6 plus 4×6 is 84.", "hard", 15, ["swipe", "chaos"]),
  mc("math-015", "division", "math", "Divide Fast", "225 ÷ 15", "15", ["12", "15", "18", "21"], "15", "15 × 15 = 225.", "hard", 16, ["swipe", "chaos"]),
  mc("math-016", "order numbers", "math", "Number Line", "Smallest number", "-7", ["-3", "0", "-7", "2"], "-7", "-7 is the smallest.", "easy", 10, QUICK_MODES),
  mc("math-017", "ratio", "math", "Ratio Read", "2:5 scaled to 10:?", "25", ["15", "20", "25", "30"], "25", "Multiply both sides by 5.", "hard", 16, ["swipe", "chaos"]),
  mc("math-018", "sequence tap", "math", "Next Number", "4, 9, 14, 19, __", "24", ["22", "23", "24", "29"], "24", "The sequence adds 5.", "normal", 14, QUICK_MODES),
  mc("math-019", "money math", "math", "Checkout Math", "$18 item, 10% tax", "$19.80", ["$18.90", "$19.00", "$19.80", "$20.20"], "$19.80", "10% of 18 is 1.80.", "normal", 14, QUICK_MODES),
  mc("math-020", "exponents", "math", "Power Move", "2⁶", "64", ["16", "32", "64", "128"], "64", "2 doubled six times is 64.", "easy", 12, QUICK_MODES),

  // 15 pop culture challenges
  mc("pop-001", "guess the character", "pop", "Red Cap Clue", "Red cap, mustache, plumber", "Mario", ["Luigi", "Mario", "Wario", "Toad"], "Mario", "Mario owns that silhouette.", "easy", 10, QUICK_MODES),
  mc("pop-002", "guess the character", "pop", "Sword Hero", "Green tunic, Master Sword", "Link", ["Zelda", "Link", "Ganondorf", "Kirby"], "Link", "Zelda is the princess; Link is the hero.", "easy", 12, QUICK_MODES),
  mc("pop-003", "movie quote", "pop", "Force Quote", "\"May the Force be with you\"", "Star Wars", ["Star Trek", "Star Wars", "Dune", "Avatar"], "Star Wars", "Classic Star Wars line.", "easy", 10, QUICK_MODES),
  mc("pop-004", "movie quote", "pop", "Boat Quote", "\"You're gonna need a bigger boat\"", "Jaws", ["Jaws", "Titanic", "Moana", "The Meg"], "Jaws", "That line is from Jaws.", "normal", 12, QUICK_MODES),
  mc("pop-005", "music trivia", "pop", "Album Color", "Artist strongly linked with the album 1989", "Taylor Swift", ["Adele", "Taylor Swift", "Billie Eilish", "Dua Lipa"], "Taylor Swift", "1989 is Taylor Swift.", "easy", 10, QUICK_MODES),
  mc("pop-006", "guess the character", "pop", "Electric Mascot", "Yellow electric mascot with red cheeks", "Pikachu", ["Kirby", "Pikachu", "Sonic", "Yoshi"], "Pikachu", "Tiny lightning friend.", "easy", 12, QUICK_MODES),
  mc("pop-007", "movie trivia", "pop", "Blue People", "Pandora is the world in", "Avatar", ["Avatar", "Dune", "Interstellar", "Moana"], "Avatar", "Pandora is central to Avatar.", "easy", 11, QUICK_MODES),
  mc("pop-008", "tv trivia", "pop", "Paper Company", "Dunder Mifflin appears in", "The Office", ["Parks and Recreation", "The Office", "Friends", "Community"], "The Office", "Dunder Mifflin is The Office.", "easy", 10, QUICK_MODES),
  mc("pop-009", "game trivia", "pop", "Ring Runner", "Collects golden rings at high speed", "Sonic", ["Sonic", "Crash", "Mario", "Mega Man"], "Sonic", "Sonic is the speedy ring collector.", "easy", 10, QUICK_MODES),
  mc("pop-010", "movie quote", "pop", "Home Quote", "\"There's no place like home\"", "The Wizard of Oz", ["Jaws", "The Wizard of Oz", "Frozen", "Up"], "The Wizard of Oz", "Dorothy says it.", "normal", 12, QUICK_MODES),
  mc("pop-011", "superhero", "pop", "Web Clue", "Friendly neighborhood hero", "Spider-Man", ["Batman", "Spider-Man", "Iron Man", "Flash"], "Spider-Man", "That phrase belongs to Spider-Man.", "easy", 10, QUICK_MODES),
  mc("pop-012", "animation", "pop", "Blue Alien", "Stitch is from", "Lilo & Stitch", ["Moana", "Lilo & Stitch", "Toy Story", "Inside Out"], "Lilo & Stitch", "Stitch is the blue chaos machine.", "easy", 10, QUICK_MODES),
  mc("pop-013", "movie trivia", "pop", "One Ring", "The One Ring belongs to", "Lord of the Rings", ["Harry Potter", "Lord of the Rings", "Dune", "Narnia"], "Lord of the Rings", "One does not simply miss this.", "normal", 13, QUICK_MODES),
  mc("pop-014", "character clue", "pop", "Pink Puff", "Round pink Nintendo character", "Kirby", ["Kirby", "Jigglypuff", "Peach", "Toadette"], "Kirby", "Kirby is the pink round one.", "easy", 10, QUICK_MODES),
  mc("pop-015", "movie trivia", "pop", "Infinity Stones", "The Infinity Stones are central to", "Marvel", ["Marvel", "DC", "Pixar", "Nintendo"], "Marvel", "The Infinity Saga is Marvel.", "normal", 13, QUICK_MODES),

  // 10 visual/logo-style challenges with placeholder visuals
  visual("visual-001", "guess the correct logo", "brands", "Bullseye", "Which brand does this target-like mark suggest?", "Target", ["Target", "Best Buy", "Spotify", "Nike"], "Target", "The bullseye cue points to Target.", "easy", 12, "◎", { swatch: "#e63946" }),
  visual("visual-002", "brand color match", "brands", "Green Waves", "Bright green plus sound-wave curves suggests", "Spotify", ["Spotify", "Netflix", "YouTube", "IKEA"], "Spotify", "Spotify is strongly green.", "easy", 12, "≋", { swatch: "#1ed760" }),
  visual("visual-003", "fake logo detector", "brands", "Red Play", "A red rounded play button most suggests", "YouTube", ["Twitch", "YouTube", "Apple", "Discord"], "YouTube", "A red play button is YouTube-coded.", "easy", 12, "▶", { swatch: "#ff0033" }),
  visual("visual-004", "brand color match", "brands", "Blue Yellow Block", "Blue and yellow store palette", "IKEA", ["IKEA", "Target", "Netflix", "Hulu"], "IKEA", "IKEA uses blue and yellow.", "easy", 12, "▣", { swatch: "#0058a3" }),
  visual("visual-005", "logo silhouette", "brands", "Check Mark", "A simple swoosh/check shape most suggests", "Nike", ["Nike", "Adidas", "Puma", "Apple"], "Nike", "The swoosh is Nike's signature cue.", "easy", 12, "✓"),
  visual("visual-006", "fake logo detector", "brands", "Green N", "A green N would be a fake version of", "Netflix", ["Netflix", "Spotify", "Xbox", "Hulu"], "Netflix", "Netflix's N is red, not green.", "normal", 14, "N", { swatch: "#22c55e" }),
  visual("visual-007", "logo clue", "brands", "Bite Shape", "A bitten fruit silhouette suggests", "Apple", ["Apple", "Target", "Samsung", "Sony"], "Apple", "The bite is the giveaway.", "easy", 12, "◖"),
  visual("visual-008", "brand color match", "brands", "Purple Chat", "Purple chat/gaming icon energy suggests", "Discord", ["Discord", "Slack", "Zoom", "Reddit"], "Discord", "Discord leans into bluish purple.", "normal", 14, "☯", { swatch: "#5865f2" }),
  visual("visual-009", "logo clue", "brands", "Four Window", "Four simple panes suggest", "Microsoft", ["Google", "Microsoft", "Meta", "Amazon"], "Microsoft", "The four-pane window cue points to Microsoft.", "normal", 14, "▦"),
  visual("visual-010", "brand color match", "brands", "Orange Smile", "An orange smile/arrow cue suggests", "Amazon", ["Amazon", "Walmart", "Etsy", "Target"], "Amazon", "Amazon's smile arrow is the clue.", "normal", 14, "⌣", { swatch: "#ff9900" }),

  // 10 memory challenges
  mc("memory-001", "pattern memory", "memory", "Pattern Echo", "Dot, dash, dot, __", "dash", ["dot", "dash", "star", "square"], "dash", "The pattern alternates.", "easy", 12, QUICK_MODES),
  mc("memory-002", "number flash", "memory", "Number Flash", "Recall: 4829", "4829", ["4829", "4892", "4289", "8429"], "4829", "The recall matches the flash.", "easy", 12, QUICK_MODES),
  mc("memory-003", "sequence tap", "memory", "Letter Order", "Shown: A → B → C. Correct next tap?", "A → B → C", ["A → C → B", "A → B → C", "B → A → C", "C → B → A"], "A → B → C", "The shown order is A then B then C.", "easy", 12, QUICK_MODES),
  mc("memory-004", "pattern memory", "memory", "Color Loop", "Red, blue, red, blue, __", "red", ["red", "blue", "green", "yellow"], "red", "It alternates red and blue.", "easy", 12, QUICK_MODES),
  mc("memory-005", "number flash", "memory", "Code Blink", "Remember 7316", "7316", ["7136", "7316", "7361", "3716"], "7316", "7316 is the code.", "normal", 14, QUICK_MODES),
  mc("memory-006", "pattern memory", "memory", "Shape Chain", "▲ ● ▲ ● __", "▲", ["▲", "●", "◆", "■"], "▲", "The next symbol loops back to triangle.", "normal", 14, QUICK_MODES),
  stage("memory-007", "match pairs", "memory", "Snack Match", "Match the snack pairs.", "Pair all 4 matches.", "Match each snack with its clue.", "normal", 24, QUICK_MODES, { miniGame: "matchPairs", pairs: [["Taco", "Shell"], ["Sushi", "Rice"], ["Pizza", "Slice"], ["Donut", "Ring"]] }),
  stage("memory-008", "order numbers", "memory", "Low to High", "Tap the numbers from low to high.", "3 → 8 → 14 → 21 → 34", "Sort the scattered number tiles ascending.", "easy", 20, QUICK_MODES, { miniGame: "orderNumbers", numbers: [14, 3, 34, 8, 21] }),
  stage("memory-009", "memory match", "memory", "Hidden Symbols", "Find the hidden matching symbols.", "Clear 4 pairs.", "Flip two cards at a time and clear the board.", "normal", 26, QUICK_MODES, { miniGame: "memoryMatch", symbols: ["◆", "◆", "★", "★", "●", "●", "▲", "▲"] }),
  stage("memory-010", "spot the difference", "memory", "Missing Dot", "Spot the odd tile in the mini gallery.", "Tap the tile with one missing dot.", "Only one tile breaks the pattern.", "easy", 20, QUICK_MODES, { miniGame: "spotDifference", answer: 5 }),

  // 10 trivia/fake fact challenges
  mc("trivia-001", "which came first", "trivia", "Launch Order", "Which came first?", "Google", ["Facebook", "Instagram", "Google", "TikTok"], "Google", "Google began in 1998.", "easy", 12, QUICK_MODES),
  mc("trivia-002", "fake fact", "trivia", "Three Hearts", "Octopuses have how many hearts?", "3", ["1", "2", "3", "4"], "3", "Octopuses have three hearts.", "normal", 14, QUICK_MODES),
  mc("trivia-003", "fake fact", "trivia", "Lightning Myth", "Lightning can strike the same place", "more than once", ["never", "more than once", "only at sea", "only at night"], "more than once", "It can strike the same place repeatedly.", "easy", 12, QUICK_MODES),
  mc("trivia-004", "rank by metric", "trivia", "Planet Size", "Which is larger?", "Earth", ["Mars", "Earth", "Mercury", "Pluto"], "Earth", "Earth is larger than Mars.", "easy", 12, QUICK_MODES),
  mc("trivia-005", "guess the price", "trivia", "Coffee Price", "A basic coffee is usually closer to", "$4", ["$1", "$4", "$14", "$40"], "$4", "$4 is the closer everyday guess.", "easy", 11, QUICK_MODES),
  mc("trivia-006", "which came first", "trivia", "Video Era", "Which launched first?", "YouTube", ["TikTok", "YouTube", "Instagram Reels", "Threads"], "YouTube", "YouTube launched in 2005.", "normal", 14, QUICK_MODES),
  mc("trivia-007", "fake fact", "trivia", "Banana Berry", "Botanically, a banana is a", "berry", ["nut", "berry", "root", "leaf"], "berry", "Bananas are botanically berries.", "hard", 16, ["swipe", "chaos"]),
  mc("trivia-008", "guess the price", "trivia", "Console Price", "A new game console is closer to", "$500", ["$50", "$150", "$500", "$1500"], "$500", "Modern consoles are much closer to $500.", "easy", 12, QUICK_MODES),
  mc("trivia-009", "rank by metric", "trivia", "Tallest Animal", "Tallest living land animal", "Giraffe", ["Elephant", "Giraffe", "Horse", "Moose"], "Giraffe", "Giraffes are the tallest land animals.", "easy", 12, QUICK_MODES),
  mc("trivia-010", "fake fact", "trivia", "Sound Space", "Sound travels through empty space", "No", ["Yes", "No", "Only bass", "Only sunlight"], "No", "Sound needs a medium.", "normal", 14, QUICK_MODES),

  // 10 side quests
  stage("side-001", "tap target", "sidequest", "Biggest Circle", "Tap the biggest circle.", "Biggest circle wins.", "The biggest circle was the warm orange one.", "easy", 18, SIDEQUEST_MODES, { miniGame: "circleTargets", answer: "orange", targetRule: "biggest" }),
  stage("side-002", "tap target", "sidequest", "Second Blue", "Touch the second biggest blue circle.", "Second biggest blue circle wins.", "Ignore the largest blue circle. Tap the next one down.", "hard", 24, SIDEQUEST_MODES, { miniGame: "circleTargets", answer: "blue-mid", targetRule: "secondBlue" }),
  stage("side-003", "stop the timer", "sidequest", "Precision Stop", "Stop as close to 5.00s as you can.", "Within 0.35s wins.", "Stop near 5.00s. Inside 0.35s counts.", "normal", 22, SIDEQUEST_MODES, { miniGame: "precisionTimer", targetMs: 5000, toleranceMs: 350 }),
  stage("side-004", "sequence tap", "sidequest", "Orbit Order", "Tap the orbit numbers in order.", "1 → 2 → 3 → 4 → 5", "Hit the orbit numbers from 1 to 5.", "normal", 22, SIDEQUEST_MODES, { miniGame: "tapSequence", sequence: ["1", "2", "3", "4", "5"] }),
  stage("side-005", "speed games", "sidequest", "Tap Sprint", "Charge the meter with 18 taps.", "18 taps before time runs out.", "A tiny thumb sprint. Eighteen taps clears it.", "hard", 24, SIDEQUEST_MODES, { miniGame: "speedTap", goal: 18, seconds: 8 }),
  stage("side-006", "draw a perfect circle", "sidequest", "Circle Judge", "Draw the roundest circle you can.", "75% circle score wins.", "Score is based on how closely your line follows the ideal ring.", "hard", 26, SIDEQUEST_MODES, { miniGame: "circleDraw", targetScore: 75 }),
  stage("side-007", "memory match", "sidequest", "Symbol Pairs", "Clear the hidden symbol board.", "Clear 4 pairs.", "Flip two cards at a time and clear the board.", "normal", 26, SIDEQUEST_MODES, { miniGame: "memoryMatch", symbols: ["◆", "◆", "★", "★", "●", "●", "▲", "▲"] }),
  stage("side-008", "order numbers", "sidequest", "Number Scatter", "Tap numbers from low to high.", "2 → 11 → 19 → 27 → 41", "Sort the scattered numbers ascending.", "normal", 22, SIDEQUEST_MODES, { miniGame: "orderNumbers", numbers: [27, 2, 41, 11, 19] }),
  stage("side-009", "spot the difference", "sidequest", "Odd Dot", "Find the tile with a missing dot.", "Tap the odd tile.", "Only one tile breaks the pattern.", "easy", 20, SIDEQUEST_MODES, { miniGame: "spotDifference", answer: 5 }),
  stage("side-010", "match pairs", "sidequest", "Micro Match", "Match the mini pairs.", "Pair all 4 matches.", "Match each item with its partner.", "normal", 24, SIDEQUEST_MODES, { miniGame: "matchPairs", pairs: [["Moon", "Night"], ["Sun", "Day"], ["Key", "Lock"], ["Bee", "Honey"]] }),
];

function card(base) {
  return {
    options: [],
    modeCompatibility: ALL_MODES,
    ...base,
  };
}

function mc(id, type, category, title, prompt, answer, options, correctText, detail, difficulty, xp, modeCompatibility, extra = {}) {
  return card({ id, type, category, title, prompt, options, answer, correctText, detail, difficulty, xp, modeCompatibility, ...extra });
}

function visual(id, type, category, title, prompt, answer, options, correctText, detail, difficulty, xp, visual, extra = {}) {
  return mc(id, type, category, title, prompt, answer, options, correctText, detail, difficulty, xp, QUICK_MODES, { visual, ...extra });
}

function stage(id, type, category, title, prompt, correctText, detail, difficulty, xp, modeCompatibility, extra = {}) {
  return card({ id, type, category, title, prompt, options: [], answer: extra.answer ?? true, correctText, detail, difficulty, xp, modeCompatibility, isStage: true, ...extra });
}
