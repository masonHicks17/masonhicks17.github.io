// City and role benchmark data
// Salaries: national BLS OES approximations (25th / 50th / 75th percentile)
// City costs: ACCRA/Numbeo-based approximations, costIndex 100 = US national average

export const CITY_BENCHMARKS = Object.freeze({
  // ── Northeast ─────────────────────────────────────────────────────────────
  newYork: {
    label: "New York, NY", region: "Northeast",
    costIndex: 187, livingWageMonthly: 6200, averageRentMonthly: 3400, monthlyExpenseEstimate: 7800,
  },
  boston: {
    label: "Boston, MA", region: "Northeast",
    costIndex: 152, livingWageMonthly: 5200, averageRentMonthly: 2850, monthlyExpenseEstimate: 6500,
  },
  washingtonDC: {
    label: "Washington, DC", region: "Northeast",
    costIndex: 152, livingWageMonthly: 5000, averageRentMonthly: 2600, monthlyExpenseEstimate: 6200,
  },
  philadelphia: {
    label: "Philadelphia, PA", region: "Northeast",
    costIndex: 116, livingWageMonthly: 4400, averageRentMonthly: 2100, monthlyExpenseEstimate: 5200,
  },
  pittsburgh: {
    label: "Pittsburgh, PA", region: "Northeast",
    costIndex: 98, livingWageMonthly: 3450, averageRentMonthly: 1550, monthlyExpenseEstimate: 4000,
  },
  baltimore: {
    label: "Baltimore, MD", region: "Northeast",
    costIndex: 121, livingWageMonthly: 4200, averageRentMonthly: 2000, monthlyExpenseEstimate: 5000,
  },
  hartford: {
    label: "Hartford, CT", region: "Northeast",
    costIndex: 118, livingWageMonthly: 4100, averageRentMonthly: 1900, monthlyExpenseEstimate: 4800,
  },
  providence: {
    label: "Providence, RI", region: "Northeast",
    costIndex: 128, livingWageMonthly: 4400, averageRentMonthly: 2000, monthlyExpenseEstimate: 5100,
  },
  buffalo: {
    label: "Buffalo, NY", region: "Northeast",
    costIndex: 96, livingWageMonthly: 3500, averageRentMonthly: 1400, monthlyExpenseEstimate: 3900,
  },

  // ── Southeast ─────────────────────────────────────────────────────────────
  miami: {
    label: "Miami, FL", region: "Southeast",
    costIndex: 133, livingWageMonthly: 4900, averageRentMonthly: 2600, monthlyExpenseEstimate: 6000,
  },
  atlanta: {
    label: "Atlanta, GA", region: "Southeast",
    costIndex: 103, livingWageMonthly: 3600, averageRentMonthly: 1650, monthlyExpenseEstimate: 4300,
  },
  charlotte: {
    label: "Charlotte, NC", region: "Southeast",
    costIndex: 98, livingWageMonthly: 3500, averageRentMonthly: 1550, monthlyExpenseEstimate: 4100,
  },
  raleigh: {
    label: "Raleigh, NC", region: "Southeast",
    costIndex: 96, livingWageMonthly: 3450, averageRentMonthly: 1500, monthlyExpenseEstimate: 4000,
  },
  nashville: {
    label: "Nashville, TN", region: "Southeast",
    costIndex: 102, livingWageMonthly: 3800, averageRentMonthly: 1700, monthlyExpenseEstimate: 4400,
  },
  tampa: {
    label: "Tampa, FL", region: "Southeast",
    costIndex: 104, livingWageMonthly: 3700, averageRentMonthly: 1700, monthlyExpenseEstimate: 4400,
  },
  orlando: {
    label: "Orlando, FL", region: "Southeast",
    costIndex: 101, livingWageMonthly: 3600, averageRentMonthly: 1650, monthlyExpenseEstimate: 4200,
  },
  richmond: {
    label: "Richmond, VA", region: "Southeast",
    costIndex: 100, livingWageMonthly: 3500, averageRentMonthly: 1600, monthlyExpenseEstimate: 4100,
  },
  jacksonville: {
    label: "Jacksonville, FL", region: "Southeast",
    costIndex: 95, livingWageMonthly: 3400, averageRentMonthly: 1500, monthlyExpenseEstimate: 3900,
  },
  gainesville: {
    label: "Gainesville, FL", region: "Southeast",
    costIndex: 88, livingWageMonthly: 3100, averageRentMonthly: 1200, monthlyExpenseEstimate: 3400,
  },
  memphis: {
    label: "Memphis, TN", region: "Southeast",
    costIndex: 85, livingWageMonthly: 3100, averageRentMonthly: 1300, monthlyExpenseEstimate: 3500,
  },
  newOrleans: {
    label: "New Orleans, LA", region: "Southeast",
    costIndex: 94, livingWageMonthly: 3400, averageRentMonthly: 1500, monthlyExpenseEstimate: 3900,
  },

  // ── Midwest ───────────────────────────────────────────────────────────────
  chicago: {
    label: "Chicago, IL", region: "Midwest",
    costIndex: 116, livingWageMonthly: 4100, averageRentMonthly: 1900, monthlyExpenseEstimate: 5000,
  },
  minneapolis: {
    label: "Minneapolis, MN", region: "Midwest",
    costIndex: 108, livingWageMonthly: 3900, averageRentMonthly: 1750, monthlyExpenseEstimate: 4600,
  },
  detroit: {
    label: "Detroit, MI", region: "Midwest",
    costIndex: 96, livingWageMonthly: 3400, averageRentMonthly: 1400, monthlyExpenseEstimate: 3900,
  },
  columbus: {
    label: "Columbus, OH", region: "Midwest",
    costIndex: 94, livingWageMonthly: 3400, averageRentMonthly: 1500, monthlyExpenseEstimate: 3900,
  },
  indianapolis: {
    label: "Indianapolis, IN", region: "Midwest",
    costIndex: 92, livingWageMonthly: 3300, averageRentMonthly: 1400, monthlyExpenseEstimate: 3700,
  },
  cincinnati: {
    label: "Cincinnati, OH", region: "Midwest",
    costIndex: 91, livingWageMonthly: 3200, averageRentMonthly: 1400, monthlyExpenseEstimate: 3600,
  },
  kansasCity: {
    label: "Kansas City, MO", region: "Midwest",
    costIndex: 93, livingWageMonthly: 3350, averageRentMonthly: 1400, monthlyExpenseEstimate: 3700,
  },
  stLouis: {
    label: "St. Louis, MO", region: "Midwest",
    costIndex: 89, livingWageMonthly: 3100, averageRentMonthly: 1350, monthlyExpenseEstimate: 3500,
  },
  milwaukee: {
    label: "Milwaukee, WI", region: "Midwest",
    costIndex: 100, livingWageMonthly: 3500, averageRentMonthly: 1600, monthlyExpenseEstimate: 4000,
  },
  cleveland: {
    label: "Cleveland, OH", region: "Midwest",
    costIndex: 90, livingWageMonthly: 3200, averageRentMonthly: 1400, monthlyExpenseEstimate: 3600,
  },
  omaha: {
    label: "Omaha, NE", region: "Midwest",
    costIndex: 87, livingWageMonthly: 3150, averageRentMonthly: 1300, monthlyExpenseEstimate: 3500,
  },

  // ── Southwest / Mountain ──────────────────────────────────────────────────
  dallas: {
    label: "Dallas, TX", region: "Southwest",
    costIndex: 99, livingWageMonthly: 3600, averageRentMonthly: 1600, monthlyExpenseEstimate: 4200,
  },
  houston: {
    label: "Houston, TX", region: "Southwest",
    costIndex: 96, livingWageMonthly: 3500, averageRentMonthly: 1550, monthlyExpenseEstimate: 4100,
  },
  austin: {
    label: "Austin, TX", region: "Southwest",
    costIndex: 112, livingWageMonthly: 3900, averageRentMonthly: 1750, monthlyExpenseEstimate: 4600,
  },
  sanAntonio: {
    label: "San Antonio, TX", region: "Southwest",
    costIndex: 88, livingWageMonthly: 3200, averageRentMonthly: 1350, monthlyExpenseEstimate: 3600,
  },
  denver: {
    label: "Denver, CO", region: "Southwest",
    costIndex: 125, livingWageMonthly: 4300, averageRentMonthly: 2050, monthlyExpenseEstimate: 5200,
  },
  phoenix: {
    label: "Phoenix, AZ", region: "Southwest",
    costIndex: 104, livingWageMonthly: 3700, averageRentMonthly: 1650, monthlyExpenseEstimate: 4300,
  },
  saltLakeCity: {
    label: "Salt Lake City, UT", region: "Southwest",
    costIndex: 115, livingWageMonthly: 4000, averageRentMonthly: 1850, monthlyExpenseEstimate: 4800,
  },
  albuquerque: {
    label: "Albuquerque, NM", region: "Southwest",
    costIndex: 92, livingWageMonthly: 3300, averageRentMonthly: 1350, monthlyExpenseEstimate: 3700,
  },

  // ── West ──────────────────────────────────────────────────────────────────
  seattle: {
    label: "Seattle, WA", region: "West",
    costIndex: 150, livingWageMonthly: 5200, averageRentMonthly: 2600, monthlyExpenseEstimate: 6400,
  },
  portland: {
    label: "Portland, OR", region: "West",
    costIndex: 131, livingWageMonthly: 4600, averageRentMonthly: 2200, monthlyExpenseEstimate: 5500,
  },
  sanFrancisco: {
    label: "San Francisco, CA", region: "West",
    costIndex: 191, livingWageMonthly: 6800, averageRentMonthly: 3600, monthlyExpenseEstimate: 8500,
  },
  sanJose: {
    label: "San Jose, CA", region: "West",
    costIndex: 178, livingWageMonthly: 6400, averageRentMonthly: 3300, monthlyExpenseEstimate: 8000,
  },
  losAngeles: {
    label: "Los Angeles, CA", region: "West",
    costIndex: 154, livingWageMonthly: 5400, averageRentMonthly: 2700, monthlyExpenseEstimate: 6800,
  },
  sanDiego: {
    label: "San Diego, CA", region: "West",
    costIndex: 148, livingWageMonthly: 5100, averageRentMonthly: 2600, monthlyExpenseEstimate: 6500,
  },
  sacramento: {
    label: "Sacramento, CA", region: "West",
    costIndex: 131, livingWageMonthly: 4500, averageRentMonthly: 2100, monthlyExpenseEstimate: 5400,
  },
  lasVegas: {
    label: "Las Vegas, NV", region: "West",
    costIndex: 105, livingWageMonthly: 3700, averageRentMonthly: 1650, monthlyExpenseEstimate: 4200,
  },
  boise: {
    label: "Boise, ID", region: "West",
    costIndex: 104, livingWageMonthly: 3700, averageRentMonthly: 1700, monthlyExpenseEstimate: 4300,
  },

  // ── Remote / Flexible ─────────────────────────────────────────────────────
  remote: {
    label: "Remote (No Fixed City)", region: "Remote",
    costIndex: 100, livingWageMonthly: 3700, averageRentMonthly: 1600, monthlyExpenseEstimate: 4000,
  },
});

export const ROLE_BENCHMARKS = Object.freeze({
  // ── Software & Engineering ────────────────────────────────────────────────
  softwareEngineer: {
    label: "Software Engineer", category: "Tech",
    salaryLow: 85000, salaryMedian: 125000, salaryHigh: 175000,
  },
  frontendDeveloper: {
    label: "Frontend Developer", category: "Tech",
    salaryLow: 75000, salaryMedian: 105000, salaryHigh: 145000,
  },
  backendDeveloper: {
    label: "Backend Developer", category: "Tech",
    salaryLow: 85000, salaryMedian: 115000, salaryHigh: 160000,
  },
  fullStackDeveloper: {
    label: "Full Stack Developer", category: "Tech",
    salaryLow: 80000, salaryMedian: 110000, salaryHigh: 155000,
  },
  mobileEngineer: {
    label: "Mobile Engineer (iOS/Android)", category: "Tech",
    salaryLow: 90000, salaryMedian: 125000, salaryHigh: 170000,
  },
  dataEngineer: {
    label: "Data Engineer", category: "Tech",
    salaryLow: 90000, salaryMedian: 130000, salaryHigh: 175000,
  },
  devOpsEngineer: {
    label: "DevOps / Platform Engineer", category: "Tech",
    salaryLow: 95000, salaryMedian: 130000, salaryHigh: 170000,
  },
  cloudEngineer: {
    label: "Cloud Engineer", category: "Tech",
    salaryLow: 100000, salaryMedian: 135000, salaryHigh: 180000,
  },
  cybersecurityAnalyst: {
    label: "Cybersecurity Analyst", category: "Tech",
    salaryLow: 80000, salaryMedian: 108000, salaryHigh: 150000,
  },
  systemsAdmin: {
    label: "Systems Administrator", category: "Tech",
    salaryLow: 60000, salaryMedian: 80000, salaryHigh: 110000,
  },
  itSupportSpecialist: {
    label: "IT Support Specialist", category: "Tech",
    salaryLow: 45000, salaryMedian: 60000, salaryHigh: 80000,
  },
  qaSoftwareEngineer: {
    label: "QA / Test Engineer", category: "Tech",
    salaryLow: 70000, salaryMedian: 95000, salaryHigh: 130000,
  },
  technicalWriter: {
    label: "Technical Writer", category: "Tech",
    salaryLow: 60000, salaryMedian: 80000, salaryHigh: 108000,
  },
  solutionsEngineer: {
    label: "Solutions / Sales Engineer", category: "Tech",
    salaryLow: 85000, salaryMedian: 120000, salaryHigh: 165000,
  },

  // ── Data & AI ─────────────────────────────────────────────────────────────
  dataAnalyst: {
    label: "Data Analyst", category: "Data & AI",
    salaryLow: 65000, salaryMedian: 88000, salaryHigh: 115000,
  },
  dataScientist: {
    label: "Data Scientist", category: "Data & AI",
    salaryLow: 95000, salaryMedian: 130000, salaryHigh: 175000,
  },
  mlEngineer: {
    label: "ML / AI Engineer", category: "Data & AI",
    salaryLow: 105000, salaryMedian: 145000, salaryHigh: 195000,
  },

  // ── Product & Design ──────────────────────────────────────────────────────
  productManager: {
    label: "Product Manager", category: "Product & Design",
    salaryLow: 90000, salaryMedian: 125000, salaryHigh: 170000,
  },
  uxDesigner: {
    label: "UX Designer", category: "Product & Design",
    salaryLow: 72000, salaryMedian: 98000, salaryHigh: 135000,
  },
  productDesigner: {
    label: "Product Designer", category: "Product & Design",
    salaryLow: 85000, salaryMedian: 115000, salaryHigh: 155000,
  },
  graphicDesigner: {
    label: "Graphic Designer", category: "Product & Design",
    salaryLow: 45000, salaryMedian: 62000, salaryHigh: 85000,
  },

  // ── Business & Operations ─────────────────────────────────────────────────
  businessAnalyst: {
    label: "Business Analyst", category: "Business",
    salaryLow: 62000, salaryMedian: 85000, salaryHigh: 110000,
  },
  projectManager: {
    label: "Project Manager", category: "Business",
    salaryLow: 72000, salaryMedian: 96000, salaryHigh: 130000,
  },
  operationsManager: {
    label: "Operations Manager", category: "Business",
    salaryLow: 68000, salaryMedian: 95000, salaryHigh: 130000,
  },
  supplyChainAnalyst: {
    label: "Supply Chain Analyst", category: "Business",
    salaryLow: 58000, salaryMedian: 78000, salaryHigh: 105000,
  },
  managementConsultant: {
    label: "Management Consultant", category: "Business",
    salaryLow: 75000, salaryMedian: 105000, salaryHigh: 150000,
  },
  researchAnalyst: {
    label: "Research Analyst", category: "Business",
    salaryLow: 55000, salaryMedian: 75000, salaryHigh: 100000,
  },
  executiveAssistant: {
    label: "Executive Assistant", category: "Business",
    salaryLow: 45000, salaryMedian: 70000, salaryHigh: 100000,
  },

  // ── Marketing & Sales ─────────────────────────────────────────────────────
  marketingManager: {
    label: "Marketing Manager", category: "Marketing & Sales",
    salaryLow: 68000, salaryMedian: 94000, salaryHigh: 130000,
  },
  marketingCoordinator: {
    label: "Marketing Coordinator", category: "Marketing & Sales",
    salaryLow: 42000, salaryMedian: 58000, salaryHigh: 78000,
  },
  contentStrategist: {
    label: "Content Strategist", category: "Marketing & Sales",
    salaryLow: 52000, salaryMedian: 72000, salaryHigh: 98000,
  },
  accountExecutive: {
    label: "Account Executive", category: "Marketing & Sales",
    salaryLow: 55000, salaryMedian: 90000, salaryHigh: 145000,
  },
  salesRepresentative: {
    label: "Sales Representative", category: "Marketing & Sales",
    salaryLow: 45000, salaryMedian: 68000, salaryHigh: 100000,
  },

  // ── Human Resources ───────────────────────────────────────────────────────
  humanResourcesGeneralist: {
    label: "HR Generalist", category: "Human Resources",
    salaryLow: 52000, salaryMedian: 68000, salaryHigh: 90000,
  },
  humanResourcesManager: {
    label: "HR Manager", category: "Human Resources",
    salaryLow: 75000, salaryMedian: 100000, salaryHigh: 135000,
  },

  // ── Finance & Accounting ──────────────────────────────────────────────────
  financialAnalyst: {
    label: "Financial Analyst", category: "Finance",
    salaryLow: 68000, salaryMedian: 90000, salaryHigh: 122000,
  },
  accountant: {
    label: "Accountant", category: "Finance",
    salaryLow: 58000, salaryMedian: 78000, salaryHigh: 105000,
  },
  auditAssociate: {
    label: "Audit Associate", category: "Finance",
    salaryLow: 60000, salaryMedian: 82000, salaryHigh: 110000,
  },
  investmentBankingAnalyst: {
    label: "Investment Banking Analyst", category: "Finance",
    salaryLow: 100000, salaryMedian: 145000, salaryHigh: 185000,
  },
  financialAdvisor: {
    label: "Financial Advisor / Planner", category: "Finance",
    salaryLow: 55000, salaryMedian: 90000, salaryHigh: 145000,
  },
  actuary: {
    label: "Actuary", category: "Finance",
    salaryLow: 80000, salaryMedian: 110000, salaryHigh: 155000,
  },
  riskAnalyst: {
    label: "Risk Analyst", category: "Finance",
    salaryLow: 68000, salaryMedian: 92000, salaryHigh: 125000,
  },

  // ── Physical Engineering ──────────────────────────────────────────────────
  mechanicalEngineer: {
    label: "Mechanical Engineer", category: "Engineering",
    salaryLow: 72000, salaryMedian: 94000, salaryHigh: 124000,
  },
  civilEngineer: {
    label: "Civil Engineer", category: "Engineering",
    salaryLow: 66000, salaryMedian: 86000, salaryHigh: 116000,
  },
  electricalEngineer: {
    label: "Electrical Engineer", category: "Engineering",
    salaryLow: 78000, salaryMedian: 100000, salaryHigh: 134000,
  },
  chemicalEngineer: {
    label: "Chemical Engineer", category: "Engineering",
    salaryLow: 80000, salaryMedian: 106000, salaryHigh: 142000,
  },
  industrialEngineer: {
    label: "Industrial Engineer", category: "Engineering",
    salaryLow: 72000, salaryMedian: 94000, salaryHigh: 124000,
  },

  // ── Healthcare ────────────────────────────────────────────────────────────
  registeredNurse: {
    label: "Registered Nurse", category: "Healthcare",
    salaryLow: 65000, salaryMedian: 82000, salaryHigh: 102000,
  },
  physicalTherapist: {
    label: "Physical Therapist", category: "Healthcare",
    salaryLow: 70000, salaryMedian: 88000, salaryHigh: 108000,
  },
  pharmacist: {
    label: "Pharmacist", category: "Healthcare",
    salaryLow: 105000, salaryMedian: 125000, salaryHigh: 148000,
  },
  socialWorker: {
    label: "Social Worker", category: "Healthcare",
    salaryLow: 42000, salaryMedian: 55000, salaryHigh: 72000,
  },
});
