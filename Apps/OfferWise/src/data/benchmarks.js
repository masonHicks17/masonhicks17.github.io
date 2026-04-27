// Industry benchmark norms used by the auto-scoring layer
// Sources: BLS, KFF Employer Health Benefits Survey, SHRM, Glassdoor data

export const BENCHMARKS = Object.freeze({
  health: {
    // Employee contribution to monthly health insurance premium (individual plan)
    avgEmployeePremiumMonthly: 150,
    greatPremiumMonthly: 50,     // employer covers most of it
    highPremiumMonthly: 300,     // employee is bearing significant cost
    avgFamilyPremiumMonthly: 460,
  },

  retirement: {
    // 401k employer match as % of salary
    noMatch: 0,
    lowMatch: 2,
    avgMatch: 3.5,
    goodMatch: 5,
    excellentMatch: 6,
  },

  pto: {
    // Vacation days (excluding sick/holidays)
    entryLevelAvg: 10,
    midLevelAvg: 15,
    seniorAvg: 20,
    excellentDays: 25,
    // Sick days
    avgSickDays: 5,
    // Paid holidays
    federalHolidays: 11,
    avgCompanyHolidays: 10,
  },

  hours: {
    partTime: 32,
    standard: 40,
    heavy: 50,
    unsustainable: 60,
  },

  // Company type risk profiles (1 = highest risk, 5 = most stable)
  companyStability: {
    "startup-seed":     1,
    "startup-series-a": 2,
    "startup-series-b": 2.5,
    "established":      4,
    "enterprise":       4.5,
    "public":           4,
    "government":       5,
    "nonprofit":        3.5,
  },

  // Company type labels for display
  companyTypeLabels: {
    "startup-seed":     "Seed-Stage Startup",
    "startup-series-a": "Series A Startup",
    "startup-series-b": "Series B+ Startup",
    "established":      "Established Company",
    "enterprise":       "Large Enterprise",
    "public":           "Publicly Traded Company",
    "government":       "Government / Public Sector",
    "nonprofit":        "Nonprofit / Mission-Driven",
  },

  // Relocation support options
  relocationLabels: {
    "full":         "Full support (covered or reimbursed)",
    "partial":      "Partial support (stipend or partial reimbursement)",
    "none-moving":  "No support — I would need to move at my own cost",
    "none-local":   "Not applicable — I already live nearby",
    "unknown":      "I haven't asked yet",
  },

  // Flexibility scale labels (1–5)
  flexibilityLabels: {
    1: "Very rigid — strict 9–5, always on-site",
    2: "Mostly rigid — rare exceptions allowed",
    3: "Moderate — some flexibility on hours or location",
    4: "Quite flexible — hybrid or flexible hours",
    5: "Fully flexible — outcomes-based, no micromanagement",
  },

  // Career growth scale labels (1–5)
  careerGrowthLabels: {
    1: "No real path — lateral or stagnant",
    2: "Unclear — growth seems possible but not defined",
    3: "Some room — paths exist with effort",
    4: "Strong — promotions are real and timely",
    5: "Exceptional — fast track, mentorship, high visibility",
  },

  // Job interest scale labels (1–5)
  jobDescriptionLabels: {
    1: "Would dread the daily work",
    2: "Mixed — some interesting parts, some not",
    3: "Solid — I'd do this without complaint",
    4: "Interested — genuinely looking forward to it",
    5: "Excited — feels like exactly the right fit",
  },

  // Location fit scale labels (1–5)
  locationLabels: {
    1: "Would strongly prefer to live elsewhere",
    2: "It's workable but not ideal",
    3: "Neutral — fine either way",
    4: "I'd enjoy living here",
    5: "Ideal city for my life right now",
  },

  // Risk / company stability scale labels (1–5)
  riskLabels: {
    1: "Major red flags — funding unclear, high turnover",
    2: "Some concerns — a few things don't add up",
    3: "Seems stable — no obvious warning signs",
    4: "Strong indicators — established track record",
    5: "Very confident — rock-solid, long-term stable",
  },

  // Common red flags (each lowers the risk score)
  redFlagOptions: [
    { id: "high-turnover",     label: "High turnover / people leaving often" },
    { id: "unclear-role",      label: "Role scope is vague or undefined" },
    { id: "funding-unclear",   label: "Company funding or runway is unclear" },
    { id: "layoff-history",    label: "Recent layoffs or known instability" },
    { id: "slow-process",      label: "Disorganized hiring process" },
    { id: "culture-concerns",  label: "Culture concerns from interviews" },
    { id: "mgmt-concerns",     label: "Concerns about management style" },
    { id: "no-remote-clarity", label: "Remote / return-to-office policy unclear" },
  ],
});
