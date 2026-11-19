const screen2Options = [
  {
    id: "mutual-funds",
    label: "Mutual Funds",
    description: "Balanced funds with less guesswork.",
  },
  {
    id: "sip",
    label: "SIP",
    description: "Automate a fixed monthly investment.",
  },
  {
    id: "daily-contributions",
    label: "Daily contributions",
    description: "Grow through small, frequent deposits.",
  },
  {
    id: "stocks-bonds",
    label: "Stocks and bonds",
    description: "Choose assets directly with more control.",
  },
];

const screens = {
  intro: document.querySelector('[data-screen="intro"]'),
  wizard: document.querySelector('[data-screen="wizard"]'),
  goal: document.querySelector('[data-screen="goal"]'),
  portfolio: document.querySelector('[data-screen="portfolio"]'),
  welcome: document.querySelector('[data-screen="welcome"]'),
};

const startButton = document.querySelector("#start-building");
const screen2Form = document.querySelector("#wizard-form");
const optionList = document.querySelector("#option-list");
const screen2Message = document.querySelector("#form-message");
const goalForm = document.querySelector("#goal-form");
const amountControl = document.querySelector("#amount-control");
const amountInput = document.querySelector("#goal-amount");
const sliderTrigger = document.querySelector("#slider-trigger");
const amountRange = document.querySelector("#amount-range");
const amountRangeWrap = document.querySelector(".amount-range-wrap");
const durationInput = document.querySelector("#duration");
const investDay = document.querySelector("#invest-day");
const investSelect = document.querySelector("#invest-day-select");
const investTrigger = document.querySelector("#invest-day-trigger");
const investValue = document.querySelector("#invest-day-value");
const investMenu = document.querySelector("#invest-day-menu");
const investOptions = [...investMenu.querySelectorAll('[role="option"]')];
const dailyAmount = document.querySelector("#daily-amount");
const goalMessage = document.querySelector("#goal-message");
const portfolioBack = document.querySelector("#portfolio-back");
const portfolioForm = document.querySelector("#portfolio-form");
const portfolioContinue = document.querySelector(".portfolio-continue");
const portfolioMessage = document.querySelector("#portfolio-message");
const brokerOptions = [...document.querySelectorAll(".broker-option")];
const manualEntryAction = document.querySelector("#manual-entry-action");
const manualOverlay = document.querySelector("#manual-overlay");
const manualBackdrop = document.querySelector(".manual-backdrop");
const manualSheet = document.querySelector(".manual-sheet");
const manualForm = document.querySelector("#manual-form");
const depositoryOptions = [...document.querySelectorAll(".depository-option")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const selections = new Set(["mutual-funds"]);

function digitsOnly(value) {
  return value.replace(/[^0-9]/g, "");
}

function getAmount() {
  return Math.max(0, Number(digitsOnly(amountInput.value)) || 0);
}

function setAmount(value, { format = true } = {}) {
  const minimum = Number(amountRange.min);
  const maximum = Number(amountRange.max);
  const bounded = Math.min(maximum, Math.max(minimum, Math.round(value / 500) * 500));
  amountInput.value = format ? currencyFormatter.format(bounded) : String(bounded);
  amountRange.value = String(bounded);
  updateRangeVisual();
  updateDailyContribution();
}

function updateRangeVisual() {
  const minimum = Number(amountRange.min);
  const maximum = Number(amountRange.max);
  const progress = ((Number(amountRange.value) - minimum) / (maximum - minimum)) * 100;
  amountRangeWrap.style.setProperty("--range-progress", String(progress));
}

function updateDailyContribution() {
  const amount = getAmount();
  const hasDuration = /\d+/.test(durationInput.value);
  const hasInvestDay = Boolean(investDay.value);

  if (!amount || !hasDuration || !hasInvestDay) {
    dailyAmount.textContent = "—";
    return;
  }

  const daily = Math.round(amount / 30);
  dailyAmount.textContent = `₹${currencyFormatter.format(daily)}`;
}

function transitionScreens(from, to) {
  from.classList.add("is-exiting");
  to.classList.add("is-active");
  to.removeAttribute("aria-hidden");

  window.setTimeout(() => {
    from.classList.remove("is-active", "is-exiting");
    from.setAttribute("aria-hidden", "true");
  }, reducedMotion.matches ? 0 : 620);
}

function setInvestMenu(open) {
  investSelect.classList.toggle("is-open", open);
  investTrigger.setAttribute("aria-expanded", String(open));
  investMenu.setAttribute("aria-hidden", String(!open));
}

function setManualSheet(open) {
  manualOverlay.classList.toggle("is-open", open);
  manualOverlay.setAttribute("aria-hidden", String(!open));

  if (open) {
    window.setTimeout(() => {
      depositoryOptions.find((option) => option.classList.contains("is-selected"))?.focus();
    }, reducedMotion.matches ? 0 : 380);
  } else {
    manualEntryAction.focus();
  }
}

function renderScreen2Options() {
  optionList.replaceChildren();

  screen2Options.forEach((option) => {
    const label = document.createElement("label");
    label.className = "option-card";
    label.htmlFor = option.id;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = option.id;
    input.name = "building-method";
    input.value = option.id;
    input.checked = selections.has(option.id);

    const copy = document.createElement("span");
    copy.className = "option-copy";

    const optionTitle = document.createElement("span");
    optionTitle.className = "option-title";
    optionTitle.textContent = option.label;

    const optionDescription = document.createElement("span");
    optionDescription.className = "option-description";
    optionDescription.textContent = option.description;

    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    checkmark.setAttribute("aria-hidden", "true");

    copy.append(optionTitle, optionDescription);
    label.append(input, copy, checkmark);
    optionList.append(label);
  });
}

startButton.addEventListener("click", () => {
  renderScreen2Options();
  transitionScreens(screens.intro, screens.wizard);
});

optionList.addEventListener("change", (event) => {
  const input = event.target.closest('input[type="checkbox"]');
  if (!input) return;

  if (input.checked) selections.add(input.value);
  else selections.delete(input.value);
  screen2Message.textContent = "";
});

screen2Form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (selections.size === 0) {
    screen2Message.textContent = "Choose at least one option to continue.";
    optionList.querySelector("input")?.focus();
    return;
  }

  transitionScreens(screens.wizard, screens.goal);
  updateDailyContribution();
});

amountInput.addEventListener("focus", () => {
  amountControl.classList.remove("is-slider");
  sliderTrigger.setAttribute("aria-expanded", "false");
  amountRangeWrap.setAttribute("aria-hidden", "true");
  amountRange.tabIndex = -1;
  amountControl.classList.add("is-editing");
  amountInput.value = digitsOnly(amountInput.value);
  const end = amountInput.value.length;
  amountInput.setSelectionRange(end, end);
});

amountInput.addEventListener("input", () => {
  const clean = digitsOnly(amountInput.value).slice(0, 6);
  amountInput.value = clean;
  if (clean) {
    amountRange.value = String(
      Math.min(Number(amountRange.max), Math.max(Number(amountRange.min), Number(clean))),
    );
    updateRangeVisual();
  }
  updateDailyContribution();
});

amountInput.addEventListener("blur", () => {
  amountControl.classList.remove("is-editing");
  const value = getAmount();
  amountInput.value = value ? currencyFormatter.format(value) : "";
  updateDailyContribution();
});

sliderTrigger.addEventListener("click", () => {
  amountControl.classList.remove("is-editing");
  amountControl.classList.add("is-slider");
  sliderTrigger.setAttribute("aria-expanded", "true");
  amountRangeWrap.setAttribute("aria-hidden", "false");
  amountRange.tabIndex = 0;
  amountRange.focus();
});

amountRange.addEventListener("input", () => {
  setAmount(Number(amountRange.value));
});

durationInput.addEventListener("input", updateDailyContribution);
investDay.addEventListener("change", updateDailyContribution);

investTrigger.addEventListener("click", () => {
  setInvestMenu(!investSelect.classList.contains("is-open"));
});

investTrigger.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setInvestMenu(true);
    investOptions[0]?.focus();
  }
});

investMenu.addEventListener("click", (event) => {
  const option = event.target.closest('[role="option"]');
  if (!option) return;

  investDay.value = option.dataset.value;
  investValue.textContent = option.textContent;
  investOptions.forEach((item) => {
    item.setAttribute("aria-selected", String(item === option));
  });
  setInvestMenu(false);
  investTrigger.focus();
  investDay.dispatchEvent(new Event("change", { bubbles: true }));
});

document.addEventListener("click", (event) => {
  if (!investSelect.contains(event.target)) setInvestMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && investSelect.classList.contains("is-open")) {
    setInvestMenu(false);
    investTrigger.focus();
  }
});

goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateDailyContribution();

  if (!getAmount() || !/\d+/.test(durationInput.value) || !investDay.value) {
    goalMessage.textContent = "Add your goal details to continue.";
    return;
  }

  goalMessage.textContent = "";
  setInvestMenu(false);
  transitionScreens(screens.goal, screens.portfolio);
});

portfolioBack.addEventListener("click", () => {
  setManualSheet(false);
  transitionScreens(screens.portfolio, screens.goal);
});

brokerOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const isAlreadySelected = option.classList.contains("is-selected");
    brokerOptions.forEach((item) => {
      item.classList.remove("is-selected");
      item.setAttribute("aria-pressed", "false");
    });

    if (!isAlreadySelected) {
      option.classList.add("is-selected");
      option.setAttribute("aria-pressed", "true");
      portfolioContinue.textContent = "Continue";
    } else {
      portfolioContinue.textContent = "Skip this step";
    }
    portfolioMessage.textContent = "";
  });
});

manualEntryAction.addEventListener("click", () => setManualSheet(true));
manualBackdrop.addEventListener("click", () => setManualSheet(false));

depositoryOptions.forEach((option) => {
  option.addEventListener("click", () => {
    depositoryOptions.forEach((item) => item.classList.toggle("is-selected", item === option));
  });
});

manualForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setManualSheet(false);
  portfolioContinue.textContent = "Continue";
  portfolioMessage.textContent = "";
});

portfolioForm.addEventListener("submit", (event) => {
  event.preventDefault();
  portfolioMessage.textContent = "";
  transitionScreens(screens.portfolio, screens.welcome);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && manualOverlay.classList.contains("is-open")) {
    setManualSheet(false);
  }
});

renderScreen2Options();
amountInput.value = currencyFormatter.format(15000);
updateRangeVisual();
updateDailyContribution();
