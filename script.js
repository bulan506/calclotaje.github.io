const ACCOUNT_SIZES = [5000, 10000, 25000, 50000, 100000];
const RISK_PERCENTS = [0.25, 0.5, 1, 1.5, 2, 3];
const RISK_CFG = { min: 1, max: 5000, decimals: 2, ticks: [1, 2, 3, 5, 7, 10, 25, 50, 100, 250, 500, 1000, 5000] };
const MULT_PRESETS = [1, 10, 100, 1000];

const FX_SL = { min: 1, max: 200, decimals: 1, default: 20, ticks: [10, 20, 50, 100, 200] };

const INSTRUMENTS = {
  oro:    { name: "Oro",     nameEn: "Gold",  mult: 100, slSuffix: { es: "", en: "" },               sl: { min: 0.5, max: 100,  decimals: 2, default: 10,   ticks: [5, 10, 20, 30, 50, 100] } },
  eurusd: { name: "EUR/USD",                 mult: 10,  slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  btc:    { name: "BTC",                     mult: 1,   slSuffix: { es: "", en: "" },               sl: { min: 50,  max: 5000, decimals: 0, default: 1000, ticks: [200, 500, 1000, 2000, 5000] } },
  nasdaq: { name: "Nasdaq",                  mult: 1,   slSuffix: { es: " · pts", en: " · pts" },  sl: { min: 5,   max: 500,  decimals: 1, default: 100,  ticks: [25, 50, 100, 200, 500] } },
  gbpusd: { name: "GBP/USD",                 mult: 10,  slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  audusd: { name: "AUD/USD",                 mult: 10,  slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  nzdusd: { name: "NZD/USD",                 mult: 10,  slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  usdjpy: { name: "USD/JPY",                 mult: 7,   slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  usdcad: { name: "USD/CAD",                 mult: 7.5, slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  usdchf: { name: "USD/CHF",                 mult: 11,  slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  eurgbp: { name: "EUR/GBP",                 mult: 13,  slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  eurjpy: { name: "EUR/JPY",                 mult: 7,   slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } },
  gbpjpy: { name: "GBP/JPY",                 mult: 7,   slSuffix: { es: " · pips", en: " · pips" }, sl: { ...FX_SL } }
};

const SHEET_GROUPS = [
  { titleKey: "groupMain",   items: ['oro', 'eurusd', 'btc', 'nasdaq'] },
  { titleKey: "groupMajors", items: ['gbpusd', 'audusd', 'nzdusd', 'usdjpy', 'usdcad', 'usdchf'] },
  { titleKey: "groupCrosses", items: ['eurgbp', 'eurjpy', 'gbpjpy'] }
];

const I18N = {
  es: {
    eyebrow: "Position Size",
    account: "Cuenta",
    risk: "Riesgo ($)",
    multiplier: "Multiplicador",
    lots: "lotes",
    builtBy: "Built by",
    slDistance: "Distancia SL",
    sheetTitle: "Más pares",
    sheetSubtitle: "La fórmula es la misma. Solo cambia el multiplicador.",
    sheetTip: "Tip: mantené apretado un tab para borrarlo.",
    sheetFooter: "Multiplicadores aproximados — editables en el campo Multiplicador.",
    groupMain: "Principales",
    groupMajors: "Forex majors",
    groupCrosses: "Crosses",
    invalidRisk: "Riesgo inválido",
    invalidSL: "Distancia SL inválida",
    invalidMult: "Multiplicador inválido",
    fillFields: "Completá los campos",
    of: "de",
    changeTheme: "Cambiar tema",
    changeLang: "Cambiar idioma",
    morePairs: "Más pares"
  },
  en: {
    eyebrow: "Position Size",
    account: "Account",
    risk: "Risk ($)",
    multiplier: "Multiplier",
    lots: "lots",
    builtBy: "Built by",
    slDistance: "SL Distance",
    sheetTitle: "More pairs",
    sheetSubtitle: "The formula is the same. Only the multiplier changes.",
    sheetTip: "Tip: long-press a tab to delete it.",
    sheetFooter: "Approximate multipliers — editable in the Multiplier field.",
    groupMain: "Main",
    groupMajors: "Forex majors",
    groupCrosses: "Crosses",
    invalidRisk: "Invalid risk",
    invalidSL: "Invalid SL distance",
    invalidMult: "Invalid multiplier",
    fillFields: "Fill in the fields",
    of: "of",
    changeTheme: "Change theme",
    changeLang: "Change language",
    morePairs: "More pairs"
  }
};

let current = 'oro';
let currentLang = 'es';
let activeTabKeys = ['oro', 'eurusd', 'btc', 'nasdaq'];
let accountSize = null;
let selectedPercent = null;
let slValues = {};
let multValues = {};

Object.keys(INSTRUMENTS).forEach(k => {
  slValues[k] = INSTRUMENTS[k].sl.default;
  multValues[k] = INSTRUMENTS[k].mult;
});

const $tabsScroll = document.getElementById('tabs-scroll');
const $risk = document.getElementById('risk');
const $sl = document.getElementById('sl');
const $mult = document.getElementById('mult');
const $riskSlider = document.getElementById('risk-slider');
const $slSlider = document.getElementById('sl-slider');
const $riskGroup = document.getElementById('risk-group');
const $slGroup = document.getElementById('sl-group');
const $multGroup = document.getElementById('mult-group');
const $result = document.getElementById('result');
const $resultUnit = document.getElementById('result-unit');
const $breakdown = document.getElementById('breakdown');
const $slLabel = document.getElementById('slLabel');
const $riskHint = document.getElementById('risk-hint');
const $sheetBackdrop = document.getElementById('sheet-backdrop');
const $sheet = document.getElementById('sheet');
const $sheetBody = document.getElementById('sheet-body');
const $themeToggle = document.getElementById('theme-toggle');
const $eyebrow = document.getElementById('eyebrow');
const $accountLabel = document.getElementById('account-label');
const $riskLabelText = document.getElementById('risk-label-text');
const $multLabel = document.getElementById('mult-label');
const $footer = document.getElementById('footer');
const $sheetTitle = document.getElementById('sheet-title');
const $sheetSubtitleText = document.getElementById('sheet-subtitle-text');
const $sheetTip = document.getElementById('sheet-tip');
const $sheetFooterText = document.getElementById('sheet-footer-text');

const valueToPos = (v, min, max) => Math.log(v / min) / Math.log(max / min);
const posToValue = (p, min, max) => min * Math.pow(max / min, p);
const roundTo = (v, d) => parseFloat(v.toFixed(d));
const fmtTick = (v) => v >= 1000 ? (v / 1000) + 'k' : String(v);
const getCfg = (t) => t === 'risk' ? RISK_CFG : INSTRUMENTS[current].sl;
const t = () => I18N[currentLang];
const pairName = (k) => {
  const inst = INSTRUMENTS[k];
  return currentLang === 'en' ? (inst.nameEn || inst.name) : inst.name;
};

(function initTheme() {
  const saved = localStorage.getItem('lotsize-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', initial);
})();

$themeToggle.addEventListener('click', () => {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('lotsize-theme', next);
});

(function initLang() {
  const saved = localStorage.getItem('lotsize-lang');
  if (saved === 'es' || saved === 'en') {
    currentLang = saved;
  } else {
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    currentLang = nav.startsWith('es') ? 'es' : 'en';
  }
  document.documentElement.setAttribute('lang', currentLang);
})();

document.querySelectorAll('.lang-opt').forEach(el => {
  el.addEventListener('click', () => {
    const lang = el.dataset.lang;
    if (lang !== currentLang) setLang(lang);
  });
});

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lotsize-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  applyLanguage();
}

function applyLanguage() {
  const tr = t();
  $eyebrow.textContent = tr.eyebrow;
  $accountLabel.textContent = tr.account;
  $riskLabelText.textContent = tr.risk;
  $multLabel.textContent = tr.multiplier;
  $resultUnit.textContent = tr.lots;
  $footer.innerHTML = `${tr.builtBy} <a href="https://github.com/bulan506" target="_blank" rel="noopener noreferrer">Brandon Vargas</a>`;
  $sheetTitle.textContent = tr.sheetTitle;
  $sheetSubtitleText.textContent = tr.sheetSubtitle;
  $sheetTip.textContent = tr.sheetTip;
  $sheetFooterText.textContent = tr.sheetFooter;
  $themeToggle.setAttribute('aria-label', tr.changeTheme);
  document.getElementById('lang-toggle').setAttribute('aria-label', tr.changeLang);
  document.getElementById('btn-more').setAttribute('aria-label', tr.morePairs);

  document.querySelectorAll('.lang-opt').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });

  updateSLLabel();
  renderTabs();
  updateRiskHint();
  calculate();
}

function updateSLLabel() {
  const inst = INSTRUMENTS[current];
  const suffix = inst.slSuffix ? (inst.slSuffix[currentLang] || '') : '';
  $slLabel.textContent = t().slDistance + suffix;
}

function parseNum(raw) {
  if (raw === null || raw === undefined) return NaN;
  const s = String(raw).trim().replace(',', '.');
  if (s === '') return NaN;
  if (!/^\d+(\.\d*)?$/.test(s) && !/^\d*\.\d+$/.test(s)) return NaN;
  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}
function updateFill(target) {
  const slider = target === 'risk' ? $riskSlider : $slSlider;
  document.getElementById(target + '-wrap').style.setProperty('--pct', slider.value);
}
function updateInvalid(target, invalid) {
  const group = target === 'risk' ? $riskGroup : target === 'sl' ? $slGroup : $multGroup;
  const wasInvalid = group.classList.contains('invalid');
  group.classList.toggle('invalid', invalid);
  if (invalid && !wasInvalid) {
    group.classList.add('shake');
    setTimeout(() => group.classList.remove('shake'), 400);
  }
}

let holdStartTimer = null;
let holdDeleteTimer = null;
let holdTarget = null;
let justDeleted = false;

function attachTabEvents(btn, key) {
  btn.addEventListener('click', (e) => {
    if (justDeleted) { e.preventDefault(); return; }
    setTab(key);
  });
  const cleanup = () => {
    clearTimeout(holdStartTimer);
    clearTimeout(holdDeleteTimer);
    if (holdTarget && holdTarget.btn === btn) {
      btn.classList.remove('holding');
      holdTarget = null;
    }
  };
  btn.addEventListener('pointerdown', (e) => {
    if (activeTabKeys.length <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    clearTimeout(holdStartTimer);
    clearTimeout(holdDeleteTimer);
    holdTarget = { btn, key };
    holdStartTimer = setTimeout(() => {
      if (!holdTarget || holdTarget.btn !== btn) return;
      btn.classList.add('holding');
      holdDeleteTimer = setTimeout(() => {
        justDeleted = true;
        setTimeout(() => { justDeleted = false; }, 400);
        btn.classList.add('removing');
        const wasActive = (key === current);
        const targetKey = key;
        holdTarget = null;
        setTimeout(() => {
          activeTabKeys = activeTabKeys.filter(k => k !== targetKey);
          if (wasActive) {
            setTab(activeTabKeys[0]);
          } else {
            renderTabs();
          }
        }, 250);
      }, 500);
    }, 100);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
    btn.addEventListener(ev, cleanup);
  });
}

function renderTabs(newKey) {
  $tabsScroll.innerHTML = '';
  activeTabKeys.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'tab' + (k === current ? ' active' : '');
    btn.dataset.key = k;
    if (activeTabKeys.length > 1) btn.title = currentLang === 'es' ? 'Mantener para eliminar' : 'Long-press to delete';
    const fill = document.createElement('span');
    fill.className = 'tab-delete-fill';
    btn.appendChild(fill);
    const label = document.createElement('span');
    label.className = 'tab-label';
    label.textContent = pairName(k);
    btn.appendChild(label);
    if (k === newKey) btn.classList.add('entering');
    attachTabEvents(btn, k);
    $tabsScroll.appendChild(btn);
  });
  if (newKey) {
    const newEl = $tabsScroll.querySelector(`.tab[data-key="${newKey}"]`);
    if (newEl) setTimeout(() => newEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }), 50);
  }
}

function renderTicks(target, values, min, max) {
  const container = document.getElementById(target + '-ticks');
  container.innerHTML = '';
  values.forEach(v => {
    const p = valueToPos(v, min, max);
    const tick = document.createElement('button');
    tick.className = 'tick';
    tick.dataset.value = v;
    tick.style.left = `calc(7px + (100% - 14px) * ${p})`;
    tick.textContent = target === 'risk' ? fmtTick(v) : v;
    tick.addEventListener('click', () => {
      const input = document.getElementById(target);
      const slider = document.getElementById(target + '-slider');
      input.value = v;
      slider.value = p;
      updateFill(target);
      if (target === 'risk') {
        selectedPercent = null;
        updatePercentChips();
        updateRiskHint();
      } else {
        slValues[current] = v;
      }
      syncTicks(target);
      calculate();
    });
    container.appendChild(tick);
  });
}
function syncTicks(target) {
  const val = parseNum(document.getElementById(target).value);
  document.getElementById(target + '-ticks').querySelectorAll('.tick').forEach(tick => {
    const tVal = parseFloat(tick.dataset.value);
    tick.classList.toggle('active', !isNaN(val) && Math.abs(tVal - val) < 0.01);
  });
}

function renderAccountChips() {
  const container = document.getElementById('account-chips');
  container.innerHTML = '';
  ACCOUNT_SIZES.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.value = v;
    chip.textContent = (v / 1000) + 'k';
    chip.addEventListener('click', () => {
      accountSize = (accountSize === v) ? null : v;
      updateAccountChips();
      if (accountSize && selectedPercent !== null) {
        $risk.value = roundTo(accountSize * selectedPercent / 100, 2);
        syncRiskSlider();
      }
      updateRiskHint();
      syncTicks('risk');
      calculate();
    });
    container.appendChild(chip);
  });
}
function renderPercentChips() {
  const container = document.getElementById('percent-chips');
  container.innerHTML = '';
  RISK_PERCENTS.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.value = v;
    chip.textContent = v + '%';
    chip.addEventListener('click', () => {
      if (selectedPercent === v) {
        selectedPercent = null;
      } else {
        selectedPercent = v;
        if (!accountSize) accountSize = 25000;
        updateAccountChips();
        $risk.value = roundTo(accountSize * v / 100, 2);
        syncRiskSlider();
      }
      updatePercentChips();
      updateRiskHint();
      syncTicks('risk');
      calculate();
    });
    container.appendChild(chip);
  });
}
function renderMultChips() {
  const container = document.getElementById('mult-chips');
  container.innerHTML = '';
  MULT_PRESETS.forEach(v => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.value = v;
    chip.textContent = v;
    chip.addEventListener('click', () => {
      $mult.value = v;
      multValues[current] = v;
      calculate();
    });
    container.appendChild(chip);
  });
}
function updateAccountChips() {
  document.querySelectorAll('#account-chips .chip').forEach(chip => {
    chip.classList.toggle('active', parseInt(chip.dataset.value) === accountSize);
  });
}
function updatePercentChips() {
  document.querySelectorAll('#percent-chips .chip').forEach(chip => {
    chip.classList.toggle('active', parseFloat(chip.dataset.value) === selectedPercent);
  });
}
function updateRiskHint() {
  const risk = parseNum($risk.value);
  if (accountSize && !isNaN(risk) && risk > 0) {
    const pct = (risk / accountSize) * 100;
    if (pct > 0 && pct < 100) {
      const pctStr = pct < 1 ? pct.toFixed(2) : pct.toFixed(pct >= 10 ? 0 : 1);
      $riskHint.textContent = ` · ${pctStr}% ${t().of} ${accountSize / 1000}k`;
      return;
    }
  }
  $riskHint.textContent = '';
}
function syncMultChips() {
  const val = parseNum($mult.value);
  document.querySelectorAll('#mult-chips .chip').forEach(chip => {
    chip.classList.toggle('active', !isNaN(val) && parseFloat(chip.dataset.value) === val);
  });
}
function syncRiskSlider() {
  const v = parseNum($risk.value);
  if (isNaN(v)) return;
  const clamped = Math.max(RISK_CFG.min, Math.min(RISK_CFG.max, v));
  $riskSlider.value = valueToPos(clamped, RISK_CFG.min, RISK_CFG.max);
  updateFill('risk');
}

function setTab(key, entering = false) {
  current = key;
  const inst = INSTRUMENTS[key];
  renderTabs(entering ? key : null);
  $mult.value = multValues[key];
  updateSLLabel();
  const slCfg = inst.sl;
  renderTicks('sl', slCfg.ticks, slCfg.min, slCfg.max);
  let slVal = slValues[key];
  if (isNaN(slVal) || slVal < slCfg.min || slVal > slCfg.max) slVal = slCfg.default;
  slValues[key] = slVal;
  $sl.value = slVal;
  $slSlider.value = valueToPos(slVal, slCfg.min, slCfg.max);
  updateFill('sl');
  $riskGroup.classList.remove('invalid');
  $slGroup.classList.remove('invalid');
  $multGroup.classList.remove('invalid');
  calculate();
}

function fmt(n) {
  if (!isFinite(n) || n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  if (n >= 1000) return n.toFixed(0);
  if (n >= 100) return n.toFixed(2);
  return n.toFixed(4);
}
function calculate() {
  const rawRisk = $risk.value;
  const rawSl = $sl.value;
  const rawMult = $mult.value;
  const risk = parseNum(rawRisk);
  const sl = parseNum(rawSl);
  const mult = parseNum(rawMult);
  const riskInvalid = isNaN(risk) || risk <= 0;
  const slInvalid = isNaN(sl) || sl <= 0;
  const multInvalid = isNaN(mult) || mult <= 0;
  const showRiskInvalid = riskInvalid && rawRisk !== '';
  const showSlInvalid = slInvalid && rawSl !== '';
  const showMultInvalid = multInvalid && rawMult !== '';
  setInvalid('risk', showRiskInvalid);
  setInvalid('sl', showSlInvalid);
  setInvalid('mult', showMultInvalid);
  if (!isNaN(sl) && sl > 0) slValues[current] = sl;
  if (!isNaN(mult) && mult > 0) multValues[current] = mult;
  syncTicks('risk');
  syncTicks('sl');
  syncMultChips();
  updateRiskHint();
  if (riskInvalid || slInvalid || multInvalid) {
    $result.classList.add('error');
    $result.classList.remove('pulse');
    $breakdown.classList.add('error');
    const tr = t();
    const msgs = [];
    if (showRiskInvalid) msgs.push(tr.invalidRisk);
    if (showSlInvalid) msgs.push(tr.invalidSL);
    if (showMultInvalid) msgs.push(tr.invalidMult);
    if (msgs.length === 0) msgs.push(tr.fillFields);
    if ($result.textContent !== "—") $result.textContent = "—";
    $breakdown.textContent = msgs.join(" · ");
    return;
  }
  $result.classList.remove('error');
  $breakdown.classList.remove('error');
  const lotaje = risk / (sl * mult);
  const newText = fmt(lotaje);
  if ($result.textContent !== newText) {
    $result.textContent = newText;
    $result.classList.remove('pulse');
    void $result.offsetWidth;
    $result.classList.add('pulse');
  }
  $breakdown.textContent = `${rawRisk.replace(',', '.')} ÷ (${rawSl.replace(',', '.')} × ${rawMult.replace(',', '.')})`;
}

function onSliderInput(target) {
  const cfg = getCfg(target);
  const slider = target === 'risk' ? $riskSlider : $slSlider;
  const input = target === 'risk' ? $risk : $sl;
  input.value = roundTo(posToValue(slider.value, cfg.min, cfg.max), cfg.decimals);
  updateFill(target);
  if (target === 'risk') {
    selectedPercent = null;
    updatePercentChips();
  }
  calculate();
}
function onInputChange(target) {
  const input = document.getElementById(target);
  const num = parseNum(input.value);
  if (!isNaN(num)) {
    const cfg = getCfg(target);
    const slider = target === 'risk' ? $riskSlider : $slSlider;
    const clamped = Math.max(cfg.min, Math.min(cfg.max, num));
    slider.value = valueToPos(clamped, cfg.min, cfg.max);
    updateFill(target);
    if (target === 'risk') {
      selectedPercent = null;
      updatePercentChips();
    }
  }
  calculate();
}

function renderSheet() {
  $sheetBody.innerHTML = '';
  SHEET_GROUPS.forEach(group => {
    const g = document.createElement('div');
    g.className = 'sheet-group';
    const title = document.createElement('div');
    title.className = 'sheet-group-title';
    title.textContent = t()[group.titleKey];
    g.appendChild(title);
    const grid = document.createElement('div');
    grid.className = 'sheet-grid';
    group.items.forEach(key => {
      const inst = INSTRUMENTS[key];
      const inTabs = activeTabKeys.includes(key);
      const btn = document.createElement('button');
      btn.className = 'pair-item' + (inTabs ? ' in-tabs' : '');
      btn.innerHTML = `<span class="pair-name">${pairName(key)}${inTabs ? '<span class="pair-check">✓</span>' : ''}</span><span class="pair-mult">× ${inst.mult}</span>`;
      btn.addEventListener('click', () => {
        if (!activeTabKeys.includes(key)) {
          activeTabKeys.push(key);
          setTab(key, true);
        } else {
          setTab(key);
        }
        closeSheet();
      });
      grid.appendChild(btn);
    });
    g.appendChild(grid);
    $sheetBody.appendChild(g);
  });
}
function openSheet() {
  renderSheet();
  $sheetBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $sheetBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== DRAG-TO-DISMISS SHEET ===== */
let sheetDrag = null;

function initSheetDrag() {
  const dragZones = $sheet.querySelectorAll('.sheet-handle, .sheet-title, .sheet-subtitle');

  dragZones.forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!sheetDrag && !$sheetBackdrop.classList.contains('open')) return;

      sheetDrag = {
        startY: e.clientY,
        lastY: e.clientY,
        startTime: Date.now(),
        pointerId: e.pointerId,
        moved: false
      };

      $sheet.classList.add('dragging');
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';

      document.addEventListener('pointermove', onSheetDragMove, { passive: false });
      document.addEventListener('pointerup', onSheetDragEnd);
      document.addEventListener('pointercancel', onSheetDragEnd);
    });
  });

  function onSheetDragMove(e) {
    if (!sheetDrag || e.pointerId !== sheetDrag.pointerId) return;
    const deltaY = e.clientY - sheetDrag.startY;
    sheetDrag.lastY = e.clientY;

    if (Math.abs(deltaY) > 5) sheetDrag.moved = true;

    const effective = deltaY < 0 ? deltaY * 0.15 : deltaY;
    $sheet.style.transform = `translateY(${Math.max(0, effective)}px)`;

    if (sheetDrag.moved && e.cancelable) e.preventDefault();
  }

  function onSheetDragEnd(e) {
    if (!sheetDrag || e.pointerId !== sheetDrag.pointerId) return;

    document.removeEventListener('pointermove', onSheetDragMove);
    document.removeEventListener('pointerup', onSheetDragEnd);