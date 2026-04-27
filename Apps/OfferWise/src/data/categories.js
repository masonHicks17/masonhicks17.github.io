export const SCORE_MIN = 1;
export const SCORE_MAX = 10;

export const CATEGORY_WEIGHTS = Object.freeze({
  pay: 20,
  costOfLiving: 15,
  benefits: 12,
  jobDescription: 12,
  careerGrowth: 12,
  workLifeBalance: 10,
  location: 8,
  pto: 5,
  relocation: 3,
  risk: 3,
});

export const CATEGORY_DEFINITIONS = Object.freeze({
  pay: {
    label: "Pay",
    description: "Salary, bonus, equity, commission, and perceived fairness.",
    prompts: [
      "Does the salary meet your needs?",
      "Is the pay competitive for your experience?",
      "Can you save money after expenses?",
      "Are bonus, equity, or commission terms meaningful?",
      "Would you still feel fairly paid after six months?",
    ],
  },
  costOfLiving: {
    label: "Cost of Living",
    description: "How well compensation translates into actual quality of life.",
    prompts: [
      "Can you afford rent comfortably?",
      "Will expenses be higher than expected?",
      "Can you still save monthly?",
      "Does salary match location costs?",
      "Will quality of life improve or decline?",
    ],
  },
  benefits: {
    label: "Benefits",
    description: "Health insurance, retirement match, perks, and start dates.",
    prompts: [
      "Is the health insurance strong?",
      "Are monthly premiums reasonable?",
      "Is there a retirement match?",
      "Are additional perks useful?",
      "Do benefits start quickly?",
    ],
  },
  jobDescription: {
    label: "Job Description",
    description: "Role clarity, responsibility fit, and day-to-day interest.",
    prompts: [
      "Do the responsibilities sound interesting?",
      "Are expectations clear?",
      "Does it match your skills?",
      "Will you learn valuable skills?",
      "Are there tasks you would strongly dislike?",
    ],
  },
  careerGrowth: {
    label: "Career Growth",
    description: "Promotion path, mentorship, skill growth, and resume value.",
    prompts: [
      "Is there a promotion path?",
      "Will this help your next job?",
      "Is mentorship available?",
      "Does the company name help your resume?",
      "Will you gain meaningful experience?",
    ],
  },
  workLifeBalance: {
    label: "Work-Life Balance",
    description: "Expected hours, schedule flexibility, and workload predictability.",
    prompts: [
      "Are expected hours reasonable?",
      "Are nights or weekends expected?",
      "Is the schedule flexible?",
      "Is the workload predictable?",
      "Would this leave enough room for your life outside work?",
    ],
  },
  location: {
    label: "Location",
    description: "City fit, safety, lifestyle, proximity, and daily convenience.",
    prompts: [
      "Would you enjoy living here?",
      "Is it close to people you care about?",
      "Does it match your lifestyle?",
      "Is it safe and convenient?",
      "Would you choose this city without the job?",
    ],
  },
  pto: {
    label: "PTO / Time Off",
    description: "Vacation days, sick time, paid holidays, and time-off culture.",
    prompts: [
      "Are PTO days adequate?",
      "Are sick days separate?",
      "Are paid holidays included?",
      "Is taking time off encouraged?",
      "Does the policy support rest during busy seasons?",
    ],
  },
  relocation: {
    label: "Relocation",
    description: "Moving support, signing bonus, temporary housing, and transition costs.",
    prompts: [
      "Are moving costs covered?",
      "Is there a signing bonus?",
      "Is temporary housing provided?",
      "Will moving create financial strain?",
      "Is the relocation timeline realistic?",
    ],
  },
  risk: {
    label: "Risk",
    description: "Company stability, turnover, role clarity, and red flags.",
    prompts: [
      "Does the company seem stable?",
      "Is there a layoff history?",
      "Is the role clearly defined?",
      "Is turnover low?",
      "Are there unresolved red flags?",
    ],
  },
});

export const OPTIONAL_SIGNAL_DEFINITIONS = Object.freeze({
  companyFit: {
    label: "Company Fit",
    prompts: [
      "Do you like the culture?",
      "Did the team seem supportive?",
      "Do values align with yours?",
      "Would you enjoy working there daily?",
    ],
  },
  commuteFlexibility: {
    label: "Commute / Remote Flexibility",
    prompts: [
      "Is the commute reasonable?",
      "Are remote or hybrid options available?",
      "Is scheduling flexible?",
      "Are commute costs manageable?",
    ],
  },
  personalExcitement: {
    label: "Personal Excitement",
    prompts: [
      "Are you excited about this role?",
      "Does it feel like a step forward?",
      "Would you regret declining?",
      "Are you choosing it for the right reasons?",
    ],
  },
});

export const CATEGORY_IDS = Object.freeze(Object.keys(CATEGORY_WEIGHTS));
