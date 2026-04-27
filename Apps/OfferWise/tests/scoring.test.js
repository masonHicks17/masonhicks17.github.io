import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateOffer, evaluateOfferFromFacts } from "../src/scoring/index.js";

test("evaluates a complete simple-mode offer on a 100-point scale", () => {
  const result = evaluateOffer({
    name: "Complete Offer",
    ratings: {
      pay: 8,
      costOfLiving: 7,
      benefits: 9,
      jobDescription: 8,
      careerGrowth: 8,
      workLifeBalance: 7,
      location: 6,
      pto: 7,
      relocation: 5,
      risk: 8,
    },
    details: {
      salary: 95000,
      cityId: "raleigh",
      roleId: "businessAnalyst",
    },
  });

  assert.equal(result.score, 76);
  assert.equal(result.totalKnownWeight, 100);
  assert.equal(result.confidence, 100);
  assert.equal(result.scoreLabel.label, "Strong Offer");
  assert.equal(result.marketComparison.salaryPosition, "top-of-range");
});

test("excludes unknown categories and reports follow-up prompts", () => {
  const result = evaluateOffer({
    name: "Incomplete Offer",
    ratings: {
      pay: 8,
      costOfLiving: 7,
      benefits: "unknown",
      jobDescription: 8,
      careerGrowth: 8,
      workLifeBalance: 7,
      location: 6,
      pto: 7,
      relocation: "unknown",
      risk: 8,
    },
    unknownCategories: ["benefits", "relocation"],
  });

  assert.equal(result.totalKnownWeight, 85);
  assert.equal(result.unknowns.length, 2);
  assert.ok(result.confidence < 85);
  assert.ok(result.unknowns[0].followUpPrompts.length > 0);
});

test("adds a salary counter recommendation when pay is below market range", () => {
  const result = evaluateOffer({
    ratings: {
      pay: 5,
      costOfLiving: 6,
      benefits: 7,
      jobDescription: 8,
      careerGrowth: 8,
      workLifeBalance: 7,
      location: 7,
      pto: 7,
      relocation: 7,
      risk: 7,
    },
    details: {
      salary: 82000,
      cityId: "austin",
      roleId: "softwareEngineer",
    },
  });

  assert.equal(result.marketComparison.salaryPosition, "below-market");
  assert.ok(
    result.recommendations.some((item) =>
      item.category === "pay" && item.recommendation,
    ),
  );
});

test("scores internship pay using hourly internship benchmarks", () => {
  const result = evaluateOfferFromFacts({
    offerType: "internship",
    compensationPeriod: "hourly",
    roleId: "softwareEngineer",
    cityId: "miami",
    salary: 28,
    companyType: "enterprise",
    weeklyHours: 40,
    flexibility: 3,
    careerGrowth: 4,
    jobDescription: 4,
    location: 3,
    risk: 4,
    redFlags: [],
  });

  assert.equal(result.marketComparison.offerType, "internship");
  assert.equal(result.marketComparison.compensationPeriod, "hourly");
  assert.equal(result.marketComparison.formattedSalary, "$28/hr");
  assert.equal(result.marketComparison.salaryPosition, "market");
  assert.ok(result.score >= 60);
});

test("includes executive assistant as a business role with entry-level benchmarks", () => {
  const result = evaluateOfferFromFacts({
    offerType: "newGrad",
    compensationPeriod: "annual",
    roleId: "executiveAssistant",
    cityId: "atlanta",
    salary: 52000,
    companyType: "established",
    weeklyHours: 40,
    flexibility: 3,
    careerGrowth: 3,
    jobDescription: 4,
    location: 4,
    risk: 4,
    redFlags: [],
  });

  assert.equal(result.roleData.label, "Executive Assistant");
  assert.equal(result.roleData.category, "Business");
  assert.equal(result.marketComparison.roleLabel, "Executive Assistant entry-level");
  assert.equal(result.marketComparison.salaryPosition, "market");
});
