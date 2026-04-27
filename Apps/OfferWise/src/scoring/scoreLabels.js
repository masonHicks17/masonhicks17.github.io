export function getOfferRating(score) {
  if (score >= 85) {
    return {
      label: "Excellent Offer",
      tone: "strong",
      summary: "This offer is compelling across most decision factors.",
    };
  }

  if (score >= 75) {
    return {
      label: "Strong Offer",
      tone: "positive",
      summary: "This offer is attractive, with a few details worth clarifying.",
    };
  }

  if (score >= 60) {
    return {
      label: "Mixed Offer",
      tone: "caution",
      summary: "This offer has real upside, but several factors need attention.",
    };
  }

  if (score >= 45) {
    return {
      label: "Weak Offer",
      tone: "warning",
      summary: "This offer may be workable only with meaningful improvements.",
    };
  }

  return {
    label: "High-Risk Offer",
    tone: "danger",
    summary: "This offer carries enough downside that declining or renegotiating should be seriously considered.",
  };
}
