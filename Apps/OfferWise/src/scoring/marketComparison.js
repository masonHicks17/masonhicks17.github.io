import { CITY_BENCHMARKS, ROLE_BENCHMARKS } from "../data/marketData.js";
import {
  annualToPeriodAmount,
  formatCompensation,
  getDefaultCompensationPeriod,
  getMonthlyExpenseEstimate,
  getRoleBenchmarkForOfferType,
  getTakeHomeRate,
  normalizeCompensation,
} from "./compensation.js?v=entry-internship";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function compareAgainstMarket({ salary, cityId, roleId, offerType = "newGrad", compensationPeriod }) {
  const baseRole = ROLE_BENCHMARKS[roleId];
  const role = getRoleBenchmarkForOfferType(baseRole, offerType);
  const city = CITY_BENCHMARKS[cityId];
  const compensation = normalizeCompensation({
    salary,
    offerType,
    compensationPeriod: compensationPeriod || getDefaultCompensationPeriod(offerType),
  });

  if (!compensation || !role) {
    return null;
  }

  const normalizedSalary = compensation.annualized;
  const expenseEstimate = getMonthlyExpenseEstimate(city, offerType);
  const takeHomeRate = getTakeHomeRate(offerType);
  const salaryPosition = getSalaryPosition(normalizedSalary, role);
  const adjustedMonthlyIncome = normalizedSalary / 12;
  const estimatedMonthlySavings = city
    ? Math.round(adjustedMonthlyIncome * takeHomeRate - expenseEstimate)
    : null;
  const suggestedCounterRange = getSuggestedCounterRange({
    salary: normalizedSalary,
    role,
    compensationPeriod: compensation.period,
  });

  return {
    roleLabel: role.benchmarkLabel ?? role.label,
    cityLabel: city?.label ?? null,
    salary: normalizedSalary,
    rawCompensation: compensation.amount,
    compensationPeriod: compensation.period,
    offerType,
    formattedSalary: compensation.formattedAmount,
    formattedAnnualizedSalary: compensation.formattedAnnualized,
    salaryPosition,
    salaryPercentOfMedian: Math.round((normalizedSalary / role.salaryMedian) * 100),
    estimatedMonthlySavings,
    formattedEstimatedMonthlySavings:
      estimatedMonthlySavings === null ? null : formatUsd(estimatedMonthlySavings),
    marketRange: {
      low: role.salaryLow,
      median: role.salaryMedian,
      high: role.salaryHigh,
      formattedLow: formatCompensation(annualToPeriodAmount(role.salaryLow, compensation.period), compensation.period),
      formattedMedian: formatCompensation(annualToPeriodAmount(role.salaryMedian, compensation.period), compensation.period),
      formattedHigh: formatCompensation(annualToPeriodAmount(role.salaryHigh, compensation.period), compensation.period),
    },
    cityCosts: city
      ? {
          averageRentMonthly: city.averageRentMonthly,
          livingWageMonthly: city.livingWageMonthly,
          monthlyExpenseEstimate: expenseEstimate,
          costIndex: city.costIndex,
          formattedAverageRentMonthly: formatUsd(city.averageRentMonthly),
          formattedLivingWageMonthly: formatUsd(city.livingWageMonthly),
          formattedMonthlyExpenseEstimate: formatUsd(expenseEstimate),
        }
      : null,
    suggestedCounterRange,
  };
}

function getSalaryPosition(salary, role) {
  if (salary < role.salaryLow) {
    return "below-range";
  }

  if (salary < role.salaryMedian * 0.95) {
    return "below-market";
  }

  if (salary <= role.salaryMedian * 1.08) {
    return "market";
  }

  if (salary <= role.salaryHigh) {
    return "above-market";
  }

  return "top-of-range";
}

function getSuggestedCounterRange({ salary, role, compensationPeriod = "annual" }) {
  const minimumTarget = Math.max(role.salaryMedian, salary * 1.08);
  const upperTarget = Math.min(role.salaryHigh, Math.max(minimumTarget * 1.08, salary * 1.15));
  const low = Math.round(minimumTarget / 1000) * 1000;
  const high = Math.round(upperTarget / 1000) * 1000;
  const periodLow = annualToPeriodAmount(low, compensationPeriod);
  const periodHigh = annualToPeriodAmount(high, compensationPeriod);

  return {
    low,
    high,
    formattedLow: formatCompensation(periodLow, compensationPeriod),
    formattedHigh: formatCompensation(periodHigh, compensationPeriod),
  };
}

function formatUsd(value) {
  return USD_FORMATTER.format(value);
}
