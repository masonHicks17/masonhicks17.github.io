const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const USD_HOURLY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const OFFER_TYPE_LABELS = Object.freeze({
  newGrad: "New Grad / Entry-Level",
  internship: "Internship / Co-op",
});

export const COMPENSATION_PERIOD_LABELS = Object.freeze({
  annual: "Annual salary",
  monthly: "Monthly pay",
  hourly: "Hourly pay",
});

export function getDefaultCompensationPeriod(offerType) {
  return offerType === "internship" ? "hourly" : "annual";
}

export function normalizeCompensation(inputs = {}) {
  const amount = Number(inputs.salary);
  if (!amount || Number.isNaN(amount)) {
    return null;
  }

  const offerType = inputs.offerType || "newGrad";
  const period = inputs.compensationPeriod || getDefaultCompensationPeriod(offerType);
  const annualized = {
    hourly: amount * 40 * 52,
    monthly: amount * 12,
    annual: amount,
  }[period] ?? amount;

  return {
    amount,
    annualized,
    monthlyGross: annualized / 12,
    period,
    offerType,
    formattedAmount: formatCompensation(amount, period),
    formattedAnnualized: formatUsd(annualized),
  };
}

export function getRoleBenchmarkForOfferType(role, offerType = "newGrad") {
  if (!role) {
    return null;
  }

  if (offerType === "internship") {
    return {
      ...role,
      salaryLow: Math.round((role.salaryLow * 0.42) / 1000) * 1000,
      salaryMedian: Math.round((role.salaryMedian * 0.45) / 1000) * 1000,
      salaryHigh: Math.round((role.salaryHigh * 0.5) / 1000) * 1000,
      benchmarkLabel: `${role.label} internship`,
      offerType,
    };
  }

  return {
    ...role,
    salaryLow: Math.round((role.salaryLow * 0.62) / 1000) * 1000,
    salaryMedian: Math.round((role.salaryMedian * 0.72) / 1000) * 1000,
    salaryHigh: Math.round((role.salaryHigh * 0.82) / 1000) * 1000,
    benchmarkLabel: `${role.label} entry-level`,
    offerType: "newGrad",
  };
}

export function getMonthlyExpenseEstimate(city, offerType = "newGrad") {
  if (!city) {
    return null;
  }

  if (offerType === "internship") {
    return Math.round(city.monthlyExpenseEstimate * 0.72);
  }

  return city.monthlyExpenseEstimate;
}

export function getTakeHomeRate(offerType = "newGrad") {
  return offerType === "internship" ? 0.82 : 0.72;
}

export function formatCompensation(value, period = "annual") {
  if (period === "hourly") {
    return `${USD_HOURLY_FORMATTER.format(value)}/hr`;
  }

  if (period === "monthly") {
    return `${USD_FORMATTER.format(value)}/mo`;
  }

  return formatUsd(value);
}

export function formatBenchmarkRange(role, period = "annual") {
  if (!role) {
    return "";
  }

  if (period === "hourly") {
    return `${formatCompensation(role.salaryLow / 2080, "hourly")}–${formatCompensation(role.salaryHigh / 2080, "hourly")}`;
  }

  if (period === "monthly") {
    return `${formatCompensation(role.salaryLow / 12, "monthly")}–${formatCompensation(role.salaryHigh / 12, "monthly")}`;
  }

  return `${formatUsd(role.salaryLow)}–${formatUsd(role.salaryHigh)}`;
}

export function annualToPeriodAmount(annualValue, period = "annual") {
  if (period === "hourly") {
    return annualValue / 2080;
  }

  if (period === "monthly") {
    return annualValue / 12;
  }

  return annualValue;
}

function formatUsd(value) {
  return USD_FORMATTER.format(value);
}
