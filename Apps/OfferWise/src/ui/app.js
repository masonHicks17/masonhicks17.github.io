import {
  evaluateOfferFromFacts,
  CITY_BENCHMARKS,
  ROLE_BENCHMARKS,
  BENCHMARKS,
  CATEGORY_DEFINITIONS,
  CATEGORY_WEIGHTS,
  COMPENSATION_PERIOD_LABELS,
  OFFER_TYPE_LABELS,
  formatBenchmarkRange,
  formatCompensation,
  getDefaultCompensationPeriod,
  getRoleBenchmarkForOfferType,
  normalizeCompensation,
} from "../scoring/index.js?v=entry-internship";

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  step: 1,
  inputs: {
    // Step 1
    offerName: "",
    offerType: "newGrad",
    roleId: "",
    cityId: "",
    companyType: "",
    workArrangement: "",
    // Step 2
    compensationPeriod: "annual",
    salary: null,
    bonus: null,
    equityAnnual: null,
    healthPremium: null,
    retirement401k: null,
    signingBonus: null,
    // Step 3
    ptoDays: null,
    sickDaysSeparate: false,
    sickDays: null,
    holidays: null,
    weeklyHours: null,
    flexibility: null,
    careerGrowth: null,
    jobDescription: null,
    location: null,
    relocation: null,
    risk: null,
    redFlags: [],
  },
};

// ── Bootstrap ──────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  render();
  document.getElementById("app").addEventListener("click", handleClick);
  document.getElementById("app").addEventListener("change", handleChange);
  document.getElementById("app").addEventListener("input", handleInput);
});

// ── Event delegation ───────────────────────────────────────────────────────

function handleClick(e) {
  // Scale option selection
  const scaleOpt = e.target.closest(".scale-option");
  if (scaleOpt) {
    const field = scaleOpt.dataset.field;
    const raw = scaleOpt.dataset.value;
    const val = raw !== "" && !isNaN(raw) ? Number(raw) : raw;
    state.inputs[field] = val;
    if (field === "offerType") {
      state.inputs.compensationPeriod = getDefaultCompensationPeriod(raw);
    }
    document.querySelectorAll(`.scale-option[data-field="${field}"]`).forEach(el => {
      el.classList.toggle("selected", el.dataset.value === raw);
    });
    return;
  }

  // Flag item toggle
  const flagItem = e.target.closest(".flag-item");
  if (flagItem) {
    const id = flagItem.dataset.flagId;
    const flags = state.inputs.redFlags;
    if (flags.includes(id)) {
      state.inputs.redFlags = flags.filter(f => f !== id);
    } else {
      state.inputs.redFlags = [...flags, id];
    }
    flagItem.classList.toggle("checked", state.inputs.redFlags.includes(id));
    const check = flagItem.querySelector(".flag-check");
    if (check) check.innerHTML = state.inputs.redFlags.includes(id) ? "✓" : "";
    return;
  }

  // Rec accordion toggle
  const recTop = e.target.closest(".rec-card-top");
  if (recTop) {
    recTop.closest(".rec-card").classList.toggle("open");
    return;
  }

  // Nav buttons
  if (e.target.closest("#btnBack"))  { goBack(); return; }
  if (e.target.closest("#btnNext"))  { goNext(); return; }
  if (e.target.closest("#btnRestart")) { restart(); return; }
}

function handleChange(e) {
  const el = e.target;
  const name = el.name;
  if (!name) return;

  if (el.type === "checkbox" && name === "sickDaysSeparate") {
    state.inputs.sickDaysSeparate = el.checked;
    // Re-render just the sick days field
    const sickField = document.getElementById("sickDaysField");
    if (sickField) {
      sickField.style.display = el.checked ? "" : "none";
    }
    return;
  }

  state.inputs[name] = el.value === "" ? null : el.value;
  if (name === "compensationPeriod") {
    render();
  }
}

function handleInput(e) {
  const el = e.target;
  const name = el.name;
  if (!name) return;

  if (el.type === "number") {
    const val = el.value === "" ? null : Number(el.value);
    state.inputs[name] = val;
  } else {
    state.inputs[name] = el.value || null;
  }
}

// ── Navigation ─────────────────────────────────────────────────────────────

function goNext() {
  const errors = validateStep(state.step);
  if (errors.length > 0) {
    renderValidationErrors(errors);
    return;
  }
  state.step = Math.min(4, state.step + 1);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack() {
  state.step = Math.max(1, state.step - 1);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function restart() {
  state.step = 1;
  state.inputs = {
    offerName: "", offerType: "newGrad", roleId: "", cityId: "", companyType: "", workArrangement: "",
    compensationPeriod: "annual", salary: null, bonus: null, equityAnnual: null, healthPremium: null,
    retirement401k: null, signingBonus: null,
    ptoDays: null, sickDaysSeparate: false, sickDays: null, holidays: null,
    weeklyHours: null, flexibility: null, careerGrowth: null,
    jobDescription: null, location: null, relocation: null, risk: null, redFlags: [],
  };
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Validation ─────────────────────────────────────────────────────────────

function validateStep(step) {
  const { inputs } = state;
  const errors = [];

  if (step === 1) {
    if (!inputs.roleId)  errors.push("Please select a role.");
    if (!inputs.cityId)  errors.push("Please select a city.");
  }
  if (step === 2) {
    if (!inputs.salary || inputs.salary <= 0) errors.push("Please enter the offer pay.");
  }

  return errors;
}

function renderValidationErrors(errors) {
  let banner = document.getElementById("validationBanner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "validationBanner";
    banner.className = "validation-banner";
    const nav = document.querySelector(".step-nav");
    if (nav) nav.before(banner);
  }
  banner.textContent = errors[0];
  banner.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ── Master render ──────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page-shell">
      ${renderHeader()}
      <div class="page-content">
        ${renderProgress()}
        ${state.step === 4
          ? renderResultsPage()
          : renderStepCard()
        }
      </div>
    </div>
  `;
}

function renderHeader() {
  return `
    <header class="page-header">
      <a class="page-header-brand" href="../../index.html">
        <div class="brand-mark">OW</div>
        <div>
          <div class="brand-name">OfferWise</div>
          <div class="brand-sub">Job Offer Evaluator</div>
        </div>
      </a>
    </header>
  `;
}

function renderProgress() {
  const labels = ["Basics", "Compensation", "Role & Life", "Results"];
  return `
    <div class="progress-wrap">
      <div class="progress-steps">
        ${labels.map((lbl, i) => {
          const n = i + 1;
          const cls = n < state.step ? "done" : n === state.step ? "active" : "";
          const dot = n < state.step ? "✓" : n;
          return `
            <div class="progress-step ${cls}">
              <div class="step-dot">${dot}</div>
              <div class="step-label">${lbl}</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderStepCard() {
  const steps = [renderStep1, renderStep2, renderStep3];
  const body = steps[state.step - 1]();

  return `
    <div class="step-card">
      ${body}
      <div class="step-nav">
        ${state.step > 1
          ? `<button class="btn btn-ghost" id="btnBack">← Back</button>`
          : `<div></div>`
        }
        <button class="btn btn-primary" id="btnNext">
          ${state.step === 3 ? "See Results" : "Continue"}
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

// ── Step 1: Basics ─────────────────────────────────────────────────────────

function renderStep1() {
  const { inputs } = state;

  return `
    <div class="step-card-header">
      <div class="step-eyebrow">Step 1 of 3</div>
      <div class="step-title">Tell us about the offer</div>
      <div class="step-subtitle">The basics help us pull the right market benchmarks.</div>
    </div>
    <div class="step-body">

      <div class="field-group">
        <label class="field-label" for="offerName">Offer nickname <span style="font-weight:400;color:var(--faint)">(optional)</span></label>
        <input type="text" id="offerName" name="offerName"
          placeholder="e.g. Acme Corp Senior Analyst"
          value="${esc(inputs.offerName)}" autocomplete="off">
      </div>

      <div class="field-group">
        <label class="field-label">Offer type</label>
        <div class="scale-selector" style="gap:10px">
          ${Object.entries(OFFER_TYPE_LABELS).map(([id, lbl]) => `
            <div class="scale-option${inputs.offerType === id ? " selected" : ""}"
              style="flex:1;padding:13px 12px"
              data-field="offerType" data-value="${id}">
              <span class="scale-desc" style="display:block;font-size:13px;font-weight:700;color:var(--ink)">${lbl}</span>
              <span style="display:block;font-size:12px;color:var(--muted);margin-top:4px">
                ${id === "internship" ? "Hourly, monthly, or annual intern pay" : "First full-time role after college"}
              </span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="field-group">
        <div class="field-row">
          <div>
            <label class="field-label" for="roleId">Role <span style="color:var(--red)">*</span></label>
            <select id="roleId" name="roleId">
              <option value="">Select your role…</option>
              ${renderRoleOptions(inputs.roleId)}
            </select>
          </div>
          <div>
            <label class="field-label" for="cityId">City <span style="color:var(--red)">*</span></label>
            <select id="cityId" name="cityId">
              <option value="">Select city…</option>
              ${renderCityOptions(inputs.cityId)}
            </select>
          </div>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">Company type</label>
        <div class="scale-selector" style="flex-wrap:wrap;gap:8px;">
          ${Object.entries(BENCHMARKS.companyTypeLabels).map(([id, lbl]) => `
            <label style="cursor:pointer;">
              <input type="radio" name="companyType" value="${id}"
                ${inputs.companyType === id ? "checked" : ""} style="display:none">
              <div class="scale-option${inputs.companyType === id ? " selected" : ""}"
                style="flex:none;width:auto;padding:8px 14px;min-width:0;text-align:left"
                data-field="companyType" data-value="${id}">
                <span style="font-size:13px;font-weight:600;color:var(--ink)">${lbl}</span>
              </div>
            </label>
          `).join("")}
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">Work arrangement</label>
        <div class="scale-selector" style="gap:10px">
          ${[["remote","Remote"],["hybrid","Hybrid"],["onsite","On-Site"]].map(([id, lbl]) => `
            <div class="scale-option${inputs.workArrangement === id ? " selected" : ""}"
              style="flex:1;padding:12px 8px"
              data-field="workArrangement" data-value="${id}">
              <span class="scale-num" style="font-size:20px">${id === "remote" ? "🏠" : id === "hybrid" ? "🔄" : "🏢"}</span>
              <span class="scale-desc" style="display:block;font-size:13px;font-weight:600;color:var(--ink);margin-top:4px">${lbl}</span>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;
}

// ── Step 2: Compensation ────────────────────────────────────────────────────

function renderStep2() {
  const { inputs } = state;
  const role = getRoleBenchmarkForOfferType(ROLE_BENCHMARKS[inputs.roleId], inputs.offerType);
  const period = inputs.compensationPeriod || getDefaultCompensationPeriod(inputs.offerType);
  const marketHint = role
    ? `Market median: ${formatCompensation(period === "hourly" ? role.salaryMedian / 2080 : period === "monthly" ? role.salaryMedian / 12 : role.salaryMedian, period)} · Range: ${formatBenchmarkRange(role, period)}`
    : null;
  const salaryLabel = inputs.offerType === "internship" ? "Intern pay" : "Base salary";
  const salaryPlaceholder = period === "hourly" ? "e.g. 28" : period === "monthly" ? "e.g. 4500" : "e.g. 85000";
  const salarySuffix = period === "hourly" ? "/ hr" : period === "monthly" ? "/ mo" : null;

  return `
    <div class="step-card-header">
      <div class="step-eyebrow">Step 2 of 3</div>
      <div class="step-title">Compensation package</div>
      <div class="step-subtitle">Enter what's in the offer. Skip anything you haven't received details on — we'll flag it as unknown.</div>
    </div>
    <div class="step-body">

      <div class="section-label">Pay</div>
      <div class="field-group">
        <label class="field-label" for="compensationPeriod">Pay format</label>
        <select id="compensationPeriod" name="compensationPeriod">
          ${Object.entries(COMPENSATION_PERIOD_LABELS).map(([id, lbl]) =>
            `<option value="${id}" ${period === id ? "selected" : ""}>${lbl}</option>`
          ).join("")}
        </select>
        <div class="field-hint">${inputs.offerType === "internship" ? "Hourly is usually best for internships; monthly works for stipends." : "Annual salary is standard for new-grad full-time offers."}</div>
      </div>

      <div class="field-group">
        <label class="field-label" for="salary">${salaryLabel} <span style="color:var(--red)">*</span></label>
        <div class="input-wrap">
          <span class="input-prefix">$</span>
          <input type="number" id="salary" name="salary" class="has-prefix${salarySuffix ? " has-suffix" : ""}"
            placeholder="${salaryPlaceholder}" min="0" step="${period === "hourly" ? "1" : "1000"}"
            value="${inputs.salary ?? ""}">
          ${salarySuffix ? `<span class="input-suffix">${salarySuffix}</span>` : ""}
        </div>
        ${marketHint ? `<div class="field-hint market">${marketHint}</div>` : ""}
      </div>

      <div class="field-group">
        <div class="field-row">
          <div>
            <label class="field-label" for="bonus">Annual bonus target</label>
            <div class="input-wrap">
              <input type="number" id="bonus" name="bonus" class="has-suffix"
                placeholder="e.g. 10" min="0" max="200"
                value="${inputs.bonus ?? ""}">
              <span class="input-suffix">% of base</span>
            </div>
            <div class="field-hint">Leave blank if none</div>
          </div>
          <div>
            <label class="field-label" for="signingBonus">Signing bonus</label>
            <div class="input-wrap">
              <span class="input-prefix">$</span>
              <input type="number" id="signingBonus" name="signingBonus" class="has-prefix"
                placeholder="e.g. 10000" min="0"
                value="${inputs.signingBonus ?? ""}">
            </div>
            <div class="field-hint">Leave blank if none</div>
          </div>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="equityAnnual">Equity / RSU value (estimated annual)</label>
        <div class="input-wrap">
          <span class="input-prefix">$</span>
          <input type="number" id="equityAnnual" name="equityAnnual" class="has-prefix"
            placeholder="e.g. 20000" min="0"
            value="${inputs.equityAnnual ?? ""}">
        </div>
        <div class="field-hint">Annual vesting value, or leave blank if none / unknown</div>
      </div>

      <div class="section-divider"></div>
      <div class="section-label">Benefits</div>

      <div class="field-group">
        <div class="field-row">
          <div>
            <label class="field-label" for="healthPremium">Your health insurance premium</label>
            <div class="input-wrap">
              <span class="input-prefix">$</span>
              <input type="number" id="healthPremium" name="healthPremium" class="has-prefix has-suffix"
                placeholder="e.g. 150" min="0"
                value="${inputs.healthPremium ?? ""}">
              <span class="input-suffix">/ mo</span>
            </div>
            <div class="field-hint">Industry avg: ~$150/mo (individual plan)</div>
          </div>
          <div>
            <label class="field-label" for="retirement401k">401k employer match</label>
            <div class="input-wrap">
              <input type="number" id="retirement401k" name="retirement401k" class="has-suffix"
                placeholder="e.g. 4" min="0" max="20" step="0.5"
                value="${inputs.retirement401k ?? ""}">
              <span class="input-suffix">% of salary</span>
            </div>
            <div class="field-hint">Industry avg: 3–4% · Leave blank if none</div>
          </div>
        </div>
      </div>

    </div>
  `;
}

// ── Step 3: Role & Life ────────────────────────────────────────────────────

function renderStep3() {
  const { inputs } = state;
  const isInternship = inputs.offerType === "internship";

  return `
    <div class="step-card-header">
      <div class="step-eyebrow">Step 3 of 3</div>
      <div class="step-title">Role and quality of life</div>
      <div class="step-subtitle">Concrete facts where possible. Use the guided scales for qualitative factors.</div>
    </div>
    <div class="step-body">

      <div class="section-label">Time Off</div>
      <div class="field-group">
        <div class="field-row thirds">
          <div>
            <label class="field-label" for="ptoDays">Vacation / PTO days</label>
            <input type="number" id="ptoDays" name="ptoDays"
              placeholder="e.g. 15" min="0" max="60"
              value="${inputs.ptoDays ?? ""}">
            <div class="field-hint">${isInternship ? "Often 0–5 paid days for summer internships" : "Avg: 10 days entry-level · Great: 15+"}</div>
          </div>
          <div>
            <label class="field-label" for="holidays">Paid holidays</label>
            <input type="number" id="holidays" name="holidays"
              placeholder="e.g. 10" min="0" max="20"
              value="${inputs.holidays ?? ""}">
            <div class="field-hint">${isInternship ? "Use only paid holidays during the internship term" : "Federal avg: 11 days"}</div>
          </div>
          <div>
            <label class="field-label">Sick days separate?</label>
            <div class="toggle-row" style="margin-top:8px">
              <div class="toggle-label-block">
                <label>Separate sick leave</label>
                <small>Not bundled with PTO</small>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" name="sickDaysSeparate"
                  ${inputs.sickDaysSeparate ? "checked" : ""}>
                <span class="toggle-track"></span>
              </label>
            </div>
            <div id="sickDaysField" style="${inputs.sickDaysSeparate ? "" : "display:none"}; margin-top:8px">
              <input type="number" name="sickDays"
                placeholder="e.g. 5" min="0" max="30"
                value="${inputs.sickDays ?? ""}">
              <div class="field-hint">Avg: 5 days</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-divider"></div>
      <div class="section-label">Schedule</div>

      <div class="field-group">
        <div class="field-row">
          <div>
            <label class="field-label" for="weeklyHours">Expected weekly hours</label>
            <div class="input-wrap">
              <input type="number" id="weeklyHours" name="weeklyHours" class="has-suffix"
                placeholder="e.g. 40" min="20" max="80"
                value="${inputs.weeklyHours ?? ""}">
              <span class="input-suffix">hrs/wk</span>
            </div>
            <div class="field-hint">Standard: 40 hrs</div>
          </div>
          <div>
            <label class="field-label">Relocation support</label>
            <select name="relocation">
              <option value="">Not sure / skip</option>
              ${Object.entries(BENCHMARKS.relocationLabels).map(([id, lbl]) =>
                `<option value="${id}" ${inputs.relocation === id ? "selected" : ""}>${lbl}</option>`
              ).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">Schedule flexibility</label>
        ${renderScaleSelector("flexibility", inputs.flexibility, BENCHMARKS.flexibilityLabels)}
      </div>

      <div class="section-divider"></div>
      <div class="section-label">Career & Role</div>

      <div class="field-group">
        <label class="field-label">Career growth potential</label>
        ${renderScaleSelector("careerGrowth", inputs.careerGrowth, BENCHMARKS.careerGrowthLabels)}
      </div>

      <div class="field-group">
        <label class="field-label">How interesting is the actual work?</label>
        ${renderScaleSelector("jobDescription", inputs.jobDescription, BENCHMARKS.jobDescriptionLabels)}
      </div>

      <div class="field-group">
        <label class="field-label">Location fit for your life</label>
        ${renderScaleSelector("location", inputs.location, BENCHMARKS.locationLabels)}
      </div>

      <div class="section-divider"></div>
      <div class="section-label">Stability & Risk</div>

      <div class="field-group">
        <label class="field-label">Company stability impression</label>
        ${renderScaleSelector("risk", inputs.risk, BENCHMARKS.riskLabels)}
      </div>

      <div class="field-group">
        <label class="field-label">Red flags <span style="font-weight:400;color:var(--faint)">(check any that apply)</span></label>
        <div class="flag-grid">
          ${BENCHMARKS.redFlagOptions.map(flag => {
            const checked = inputs.redFlags.includes(flag.id);
            return `
              <div class="flag-item${checked ? " checked" : ""}" data-flag-id="${flag.id}">
                <div class="flag-check">${checked ? "✓" : ""}</div>
                <span>${flag.label}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>

    </div>
  `;
}

// ── Results ────────────────────────────────────────────────────────────────

function renderResultsPage() {
  const result = evaluateOfferFromFacts(state.inputs);
  const tone = result.scoreLabel.tone;

  return `
    <div class="results-layout">
      ${renderScorePanel(result, tone)}
      <div class="results-main">
        ${renderMarketCard(result)}
        ${renderBreakdownCard(result)}
        ${renderNegotiationCard(result)}
        ${renderFactSummaryCard(result)}
      </div>
    </div>
    <div class="restart-bar" style="margin-top:32px">
      <button class="btn btn-secondary" id="btnRestart">← Evaluate a different offer</button>
    </div>
  `;
}

function renderScorePanel(result, tone) {
  const { score, scoreLabel, confidence, totalKnownWeight, offerName } = result;
  const gaugeColor = {
    strong: "#1d6a46", positive: "#2d8a5e",
    caution: "#c4820a", warning: "#c4500a", danger: "#b02c2c",
  }[tone] ?? "#315f8d";

  return `
    <div class="score-panel tone-${tone}">
      <div class="score-hero">
        <div class="score-offer-name">${esc(offerName || "Your Offer")}</div>
        <div class="score-gauge-wrap">
          ${renderGaugeSvg(score, gaugeColor)}
        </div>
        <span class="score-label-text">${scoreLabel.label}</span>
        <p class="score-summary-text">${scoreLabel.summary}</p>
      </div>
      <div class="confidence-row">
        <span class="confidence-label">Score confidence</span>
        <span class="confidence-value">${confidence}%</span>
      </div>
      <div class="confidence-row">
        <span class="confidence-label">Categories scored</span>
        <span class="confidence-value">${totalKnownWeight}% weight</span>
      </div>
      <div class="score-actions">
        <button class="btn btn-primary" id="btnRestart" style="width:100%">← Evaluate New Offer</button>
      </div>
    </div>
  `;
}

function renderGaugeSvg(score, color) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return `
    <svg class="score-gauge" viewBox="0 0 128 128" width="160" height="160" aria-label="Score: ${score} out of 100">
      <circle cx="64" cy="64" r="${r}" fill="none" stroke="#e8eef5" stroke-width="11"/>
      <circle cx="64" cy="64" r="${r}" fill="none"
        stroke="${color}" stroke-width="11"
        stroke-dasharray="${circ.toFixed(2)}"
        stroke-dashoffset="${offset.toFixed(2)}"
        stroke-linecap="round"
        transform="rotate(-90 64 64)"
        style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"
      />
      <text x="64" y="56" text-anchor="middle"
        font-family="Inter,-apple-system,sans-serif"
        font-size="30" font-weight="800" fill="${color}">${score}</text>
      <text x="64" y="74" text-anchor="middle"
        font-family="Inter,-apple-system,sans-serif"
        font-size="11" fill="#8fa8c4">out of 100</text>
    </svg>
  `;
}

function renderMarketCard(result) {
  const market = result.marketComparison;
  if (!market) return "";

  const role = result.roleData;
  const city = result.cityData;
  const rangeTotal = role.salaryHigh - role.salaryLow;
  const clampedSalary = Math.max(role.salaryLow * 0.7, Math.min(role.salaryHigh * 1.15, market.salary));
  const markerPct = rangeTotal > 0
    ? ((clampedSalary - role.salaryLow * 0.7) / ((role.salaryHigh * 1.15) - (role.salaryLow * 0.7))) * 100
    : 50;

  const posLabels = {
    "below-range":  "Below Range",
    "below-market": "Below Market",
    "market":       "At Market",
    "above-market": "Above Market",
    "top-of-range": "Top of Range",
  };

  const surplus = market.estimatedMonthlySavings;

  return `
    <div class="result-card">
      <div class="result-card-header">
        <div class="result-card-icon">📊</div>
        <div class="result-card-title">Market Analysis</div>
      </div>
      <div class="result-card-body">
        <div style="font-size:13px;color:var(--muted);margin-bottom:6px">
          <strong style="color:var(--ink)">${market.roleLabel}</strong> pay range
          ${city ? `in <strong style="color:var(--ink)">${city.label}</strong>` : ""}
        </div>

        <div class="market-range-viz">
          <div class="market-bar-track">
            <div class="market-bar-fill" style="width:100%"></div>
            <div class="market-bar-marker"
              style="left:${markerPct.toFixed(1)}%"
              data-label="${market.formattedSalary}"></div>
          </div>
          <div class="market-axis">
            <span>${market.marketRange.formattedLow}</span>
            <span style="color:var(--accent);font-weight:700">Median ${market.marketRange.formattedMedian}</span>
            <span>${market.marketRange.formattedHigh}</span>
          </div>
        </div>

        <div class="market-stat-row">
          <div class="market-stat">
            <span class="market-stat-value">${market.salaryPercentOfMedian}%</span>
            <div class="market-stat-label">of market median</div>
          </div>
          <div class="market-stat">
            <span class="market-stat-value">${posLabels[market.salaryPosition] ?? market.salaryPosition}</span>
            <div class="market-stat-label">salary position</div>
          </div>
          <div class="market-stat">
            <span class="market-stat-value"
              style="color:${surplus != null && surplus < 200 ? "var(--red)" : "var(--green)"}">
              ${surplus != null ? fmtUsd(Math.abs(surplus)) + "/mo" : "—"}
            </span>
            <div class="market-stat-label">${surplus != null ? (surplus >= 0 ? "est. monthly surplus" : "est. monthly shortfall") : "city data unavailable"}</div>
          </div>
        </div>

        ${["below-range","below-market"].includes(market.salaryPosition) ? `
          <div style="margin-top:16px;padding:12px 14px;background:var(--yellow-bg);border-radius:var(--r-sm);font-size:13px;color:var(--yellow)">
            <strong>Suggested counter:</strong> ${market.suggestedCounterRange.formattedLow}–${market.suggestedCounterRange.formattedHigh}
            — anchored at market median and adjusted for your experience band.
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderBreakdownCard(result) {
  const categories = result.breakdown;

  return `
    <div class="result-card">
      <div class="result-card-header">
        <div class="result-card-icon">🎯</div>
        <div class="result-card-title">Category Breakdown</div>
      </div>
      <div class="result-card-body">
        <div class="breakdown-list">
          ${categories.map(item => {
            const score = item.normalizedScore;
            const barClass = score == null ? "" : barColorClass(score);
            const weight = CATEGORY_WEIGHTS[item.category] ?? 0;
            return `
              <div class="breakdown-row">
                <div class="breakdown-name">
                  ${item.label}
                  <span class="breakdown-weight">${weight}%</span>
                </div>
                <div class="breakdown-bar-track">
                  ${score != null
                    ? `<div class="breakdown-bar-fill ${barClass}" style="width:${score}%"></div>`
                    : `<div class="breakdown-bar-fill" style="width:0%"></div>`
                  }
                </div>
                ${score != null
                  ? `<div class="breakdown-score" style="color:${barHexColor(score)}">${score}</div>`
                  : `<div class="breakdown-unknown">Unknown</div>`
                }
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderNegotiationCard(result) {
  const recs = result.recommendations.filter(r => r.script || r.context);
  if (recs.length === 0) return "";

  return `
    <div class="result-card">
      <div class="result-card-header">
        <div class="result-card-icon">💬</div>
        <div class="result-card-title">Negotiation Playbook</div>
      </div>
      <div class="result-card-body">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
          Click any item to see context and a ready-to-use script — ranked by potential impact.
        </p>
        <div class="recs-list">
          ${recs.map((rec, i) => `
            <div class="rec-card${i === 0 ? " open" : ""}">
              <div class="rec-card-top">
                <div class="rec-priority">${i + 1}</div>
                <div class="rec-meta">
                  <div class="rec-category">${rec.label}</div>
                  <div class="rec-headline">${rec.headline}</div>
                </div>
                <div class="rec-toggle">⌄</div>
              </div>
              <div class="rec-detail">
                ${rec.context ? `<p class="rec-context">${rec.context}</p>` : ""}
                ${rec.script ? `
                  <div class="rec-script-label">Script — say this:</div>
                  <div class="rec-script">${rec.script}</div>
                ` : ""}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderFactSummaryCard(result) {
  const { inputs } = state;
  const city = result.cityData;
  const role = result.roleData;
  const facts = [];

  if (role)  facts.push({ key: "Role",     val: role.label });
  if (city)  facts.push({ key: "City",     val: city.label });
  if (inputs.companyType) facts.push({ key: "Company", val: BENCHMARKS.companyTypeLabels[inputs.companyType] ?? inputs.companyType });
  const compensation = normalizeCompensation(inputs);
  if (inputs.salary) {
    facts.push({
      key: inputs.offerType === "internship" ? "Intern Pay" : "Base Salary",
      val: compensation
        ? `${compensation.formattedAmount}${compensation.period !== "annual" ? ` (${compensation.formattedAnnualized} annualized)` : ""}`
        : fmtUsd(inputs.salary),
    });
  }
  if (inputs.bonus)  facts.push({ key: "Bonus Target", val: `${inputs.bonus}% of base` });
  if (inputs.equityAnnual) facts.push({ key: "Equity", val: `${fmtUsd(inputs.equityAnnual)}/yr est.` });
  if (inputs.healthPremium != null) facts.push({ key: "Health Premium", val: `${fmtUsd(inputs.healthPremium)}/mo` });
  if (inputs.retirement401k != null) facts.push({ key: "401k Match", val: `${inputs.retirement401k}%` });
  if (inputs.ptoDays != null) {
    const total = inputs.ptoDays + (inputs.sickDays ?? 5) + (inputs.holidays ?? 10);
    facts.push({ key: "Time Off", val: `${inputs.ptoDays}v + ${inputs.sickDays ?? "~5"}s + ${inputs.holidays ?? "~10"}h = ${total} days` });
  }
  if (inputs.weeklyHours) facts.push({ key: "Weekly Hours", val: `${inputs.weeklyHours} hrs` });
  if (inputs.redFlags?.length) facts.push({ key: "Red Flags", val: `${inputs.redFlags.length} flagged` });

  if (facts.length === 0) return "";

  return `
    <div class="result-card">
      <div class="result-card-header">
        <div class="result-card-icon">📋</div>
        <div class="result-card-title">Offer Summary</div>
      </div>
      <div class="result-card-body">
        <div class="fact-summary-list">
          ${facts.map(f => `
            <div class="fact-summary-item">
              <span class="fact-key">${f.key}</span>
              <span class="fact-val">${f.val}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// ── Shared render helpers ──────────────────────────────────────────────────

function renderScaleSelector(field, selected, labels) {
  return `
    <div class="scale-selector">
      ${Object.entries(labels).map(([val, desc]) => `
        <div class="scale-option${Number(selected) === Number(val) ? " selected" : ""}"
          data-field="${field}" data-value="${val}">
          <span class="scale-num">${val}</span>
          <span class="scale-desc">${desc}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderRoleOptions(selected) {
  const groups = {};
  for (const [id, role] of Object.entries(ROLE_BENCHMARKS)) {
    (groups[role.category] ??= []).push({ id, label: role.label });
  }
  return Object.entries(groups).map(([cat, roles]) => `
    <optgroup label="${cat}">
      ${roles.map(r =>
        `<option value="${r.id}"${r.id === selected ? " selected" : ""}>${r.label}</option>`
      ).join("")}
    </optgroup>
  `).join("");
}

function renderCityOptions(selected) {
  const regions = {};
  for (const [id, city] of Object.entries(CITY_BENCHMARKS)) {
    (regions[city.region] ??= []).push({ id, label: city.label });
  }
  return Object.entries(regions).map(([region, cities]) => `
    <optgroup label="${region}">
      ${cities.map(c =>
        `<option value="${c.id}"${c.id === selected ? " selected" : ""}>${c.label}</option>`
      ).join("")}
    </optgroup>
  `).join("");
}

// ── Utilities ──────────────────────────────────────────────────────────────

const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
});

function fmtUsd(n) { return usdFmt.format(n); }

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function barColorClass(score) {
  if (score >= 80) return "bar-strong";
  if (score >= 68) return "bar-positive";
  if (score >= 55) return "bar-ok";
  if (score >= 42) return "bar-caution";
  if (score >= 28) return "bar-warning";
  return "bar-danger";
}

function barHexColor(score) {
  if (score >= 80) return "#1d6a46";
  if (score >= 68) return "#2d8a5e";
  if (score >= 55) return "#315f8d";
  if (score >= 42) return "#c4820a";
  if (score >= 28) return "#c4500a";
  return "#b02c2c";
}
