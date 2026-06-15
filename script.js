/* =========================================
   ExpenseIQ — script.js
   Vanilla JS: no frameworks, no dependencies
   ========================================= */

// ---- CATEGORY CONFIG ----
const CATEGORIES = {
  Food:          { emoji: '🍔', color: '#00c896' },
  Transport:     { emoji: '🚗', color: '#4f8ef7' },
  Shopping:      { emoji: '🛍', color: '#f5a623' },
  Entertainment: { emoji: '🎬', color: '#b66dff' },
  Health:        { emoji: '💊', color: '#f04060' },
  Education:     { emoji: '📚', color: '#00c5e8' },
  Utilities:     { emoji: '⚡', color: '#ff7b4f' },
  Rent:          { emoji: '🏠', color: '#2dd4a6' },
  Other:         { emoji: '🔖', color: '#8fa0c0' },
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ---- STATE ----
let expenses = JSON.parse(localStorage.getItem('expenseiq_expenses') || '[]');
let editingId = null;
let isDark = localStorage.getItem('expenseiq_theme') === 'dark';

// ---- DOM REFS ----
const $ = id => document.getElementById(id);
const modalOverlay   = $('modalOverlay');
const openModalBtn   = $('openModalBtn');
const closeModalBtn  = $('closeModalBtn');
const cancelBtn      = $('cancelBtn');
const saveExpenseBtn = $('saveExpenseBtn');
const transactionsList = $('transactionsList');
const filterCategory = $('filterCategory');
const sortOrder      = $('sortOrder');
const toast          = $('toast');
const themeToggle    = $('themeToggle');
const themeIcon      = $('themeIcon');

// ---- INIT ----
function init() {
  applyTheme();
  setDefaultDate();
  renderAll();
  populateFilterDropdown();

  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  saveExpenseBtn.addEventListener('click', handleSave);
  filterCategory.addEventListener('change', () => renderTransactions());
  sortOrder.addEventListener('change', () => renderTransactions());
  themeToggle.addEventListener('click', toggleTheme);

  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    if (e.key === 'Enter' && modalOverlay.classList.contains('open')) handleSave();
  });
}

// ---- THEME ----
function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☽' : '☀';
}

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('expenseiq_theme', isDark ? 'dark' : 'light');
  applyTheme();
}

// ---- MODAL ----
function openModal(expenseToEdit = null) {
  clearErrors();
  editingId = null;

  if (expenseToEdit) {
    editingId = expenseToEdit.id;
    $('expenseTitle').value    = expenseToEdit.title;
    $('expenseAmount').value   = expenseToEdit.amount;
    $('expenseDate').value     = expenseToEdit.date;
    $('expenseCategory').value = expenseToEdit.category;
    $('expenseNote').value     = expenseToEdit.note || '';
    $('modalTitle').textContent = 'Edit Expense';
    saveExpenseBtn.textContent  = 'Update Expense';
  } else {
    $('expenseTitle').value    = '';
    $('expenseAmount').value   = '';
    $('expenseNote').value     = '';
    $('expenseCategory').value = '';
    setDefaultDate();
    $('modalTitle').textContent = 'New Expense';
    saveExpenseBtn.textContent  = 'Save Expense';
  }

  modalOverlay.classList.add('open');
  setTimeout(() => $('expenseTitle').focus(), 200);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  clearErrors();
}

function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  $('expenseDate').value = today;
}

// ---- VALIDATION ----
function validate() {
  let valid = true;
  clearErrors();

  const title    = $('expenseTitle').value.trim();
  const amount   = parseFloat($('expenseAmount').value);
  const date     = $('expenseDate').value;
  const category = $('expenseCategory').value;

  if (!title) {
    showError('titleError', 'Description is required.');
    $('expenseTitle').classList.add('error');
    valid = false;
  }
  if (!$('expenseAmount').value || isNaN(amount) || amount <= 0) {
    showError('amountError', 'Enter a valid amount > 0.');
    $('expenseAmount').classList.add('error');
    valid = false;
  }
  if (!category) {
    showError('categoryError', 'Please select a category.');
    $('expenseCategory').classList.add('error');
    valid = false;
  }

  return valid;
}

function showError(id, msg) {
  $(id).textContent = msg;
}

function clearErrors() {
  ['titleError','amountError','categoryError'].forEach(id => {
    $(id).textContent = '';
  });
  ['expenseTitle','expenseAmount','expenseCategory'].forEach(id => {
    $(id).classList.remove('error');
  });
}

// ---- CRUD ----
function handleSave() {
  if (!validate()) return;

  const expense = {
    id:       editingId || Date.now().toString(),
    title:    $('expenseTitle').value.trim(),
    amount:   parseFloat(parseFloat($('expenseAmount').value).toFixed(2)),
    date:     $('expenseDate').value,
    category: $('expenseCategory').value,
    note:     $('expenseNote').value.trim(),
    createdAt: editingId ? (expenses.find(e => e.id === editingId)?.createdAt || Date.now()) : Date.now(),
  };

  if (editingId) {
    expenses = expenses.map(e => e.id === editingId ? expense : e);
    showToast('✏️ Expense updated');
  } else {
    expenses.unshift(expense);
    showToast('✅ Expense added');
  }

  save();
  closeModal();
  renderAll();
  populateFilterDropdown();
}

function deleteExpense(id) {
  const expense = expenses.find(e => e.id === id);
  expenses = expenses.filter(e => e.id !== id);
  save();
  renderAll();
  populateFilterDropdown();
  showToast(`🗑 "${expense?.title}" deleted`);
}

function save() {
  localStorage.setItem('expenseiq_expenses', JSON.stringify(expenses));
}

// ---- RENDER ALL ----
function renderAll() {
  renderSummaryCards();
  renderTransactions();
  renderDonut();
  renderBarChart();
}

// ---- SUMMARY CARDS ----
function renderSummaryCards() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  $('totalSpent').textContent = fmt(total);
  $('totalCount').textContent = `${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`;

  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const monthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);
  $('monthSpent').textContent = fmt(monthTotal);
  $('monthName').textContent  = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  // top category
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    $('topCategory').textContent    = `${CATEGORIES[topCat[0]]?.emoji || ''} ${topCat[0]}`;
    $('topCategoryAmt').textContent = fmt(topCat[1]);
  } else {
    $('topCategory').textContent    = '—';
    $('topCategoryAmt').textContent = 'No data yet';
  }

  // daily avg
  if (expenses.length > 0) {
    const dates = expenses.map(e => new Date(e.date).getTime());
    const span = Math.max(1, Math.ceil((Math.max(...dates) - Math.min(...dates)) / 86400000) + 1);
    $('dailyAvg').textContent = fmt(total / span);
  } else {
    $('dailyAvg').textContent = '₹0.00';
  }
}

// ---- TRANSACTIONS LIST ----
function renderTransactions() {
  const selectedCat  = filterCategory.value;
  const selectedSort = sortOrder.value;

  let list = [...expenses];
  if (selectedCat !== 'all') list = list.filter(e => e.category === selectedCat);

  list.sort((a, b) => {
    if (selectedSort === 'newest')  return new Date(b.date) - new Date(a.date);
    if (selectedSort === 'oldest')  return new Date(a.date) - new Date(b.date);
    if (selectedSort === 'highest') return b.amount - a.amount;
    if (selectedSort === 'lowest')  return a.amount - b.amount;
    return 0;
  });

  transactionsList.innerHTML = '';

  if (list.length === 0) {
    transactionsList.innerHTML = `
      <li class="empty-state">
        <span class="empty-icon">📭</span>
        <p>${selectedCat !== 'all' ? 'No expenses in this category.' : 'No expenses yet.'}</p>
        <p class="empty-sub">${selectedCat !== 'all' ? 'Try a different filter.' : 'Add your first one above.'}</p>
      </li>`;
    return;
  }

  list.forEach(expense => {
    const cat  = CATEGORIES[expense.category] || CATEGORIES.Other;
    const li   = document.createElement('li');
    li.className = 'tx-item';
    li.innerHTML = `
      <div class="tx-icon" style="background:${cat.color}22">${cat.emoji}</div>
      <div class="tx-info">
        <p class="tx-title">${escHtml(expense.title)}</p>
        <div class="tx-meta">
          <span class="tx-cat-tag" style="background:${cat.color}22;color:${cat.color}">${expense.category}</span>
          <span>${formatDate(expense.date)}</span>
          ${expense.note ? `<span>· ${escHtml(expense.note)}</span>` : ''}
        </div>
      </div>
      <div class="tx-right">
        <span class="tx-amount">${fmt(expense.amount)}</span>
        <div class="tx-actions">
          <button class="btn-tx btn-tx--edit" title="Edit" aria-label="Edit expense">✏️</button>
          <button class="btn-tx btn-tx--delete" title="Delete" aria-label="Delete expense">🗑</button>
        </div>
      </div>`;

    li.querySelector('.btn-tx--edit').addEventListener('click', () => openModal(expense));
    li.querySelector('.btn-tx--delete').addEventListener('click', () => deleteExpense(expense.id));
    transactionsList.appendChild(li);
  });
}

// ---- DONUT CHART (canvas) ----
function renderDonut() {
  const canvas = $('donutChart');
  const ctx    = canvas.getContext('2d');
  const size   = 220;
  const cx     = size / 2, cy = size / 2;
  const outerR = 88, innerR = 58;

  canvas.width  = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const total = Object.values(catTotals).reduce((s, v) => s + v, 0);

  $('chartCenterVal').textContent = fmtShort(total);

  const legend = $('legend');
  legend.innerHTML = '';

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e2e8f5';
    ctx.fill();
    return;
  }

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  let startAngle = -Math.PI / 2;
  const gap = 0.04;

  sorted.forEach(([cat, val]) => {
    const slice = (val / total) * Math.PI * 2;
    const color = CATEGORIES[cat]?.color || '#8fa0c0';
    const s = startAngle + gap / 2;
    const e = startAngle + slice - gap / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, s, e);
    ctx.arc(cx, cy, innerR, e, s, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // legend
    const item = document.createElement('li');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background:${color}"></span>
      <span class="legend-name">${cat}</span>
      <span class="legend-pct">${((val/total)*100).toFixed(0)}%</span>
      <span class="legend-val">${fmt(val)}</span>`;
    legend.appendChild(item);

    startAngle += slice;
  });
}

// ---- BAR CHART (monthly trend) ----
function renderBarChart() {
  const barChart = $('barChart');
  barChart.innerHTML = '';

  const now = new Date();
  $('trendYear').textContent = now.getFullYear();

  const months = Array.from({length: 12}, (_, i) => {
    const total = expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === i;
      })
      .reduce((s, e) => s + e.amount, 0);
    return { label: MONTH_NAMES[i], total, isCurrent: i === now.getMonth() };
  });

  const max = Math.max(...months.map(m => m.total), 1);

  months.forEach(m => {
    const heightPct = (m.total / max) * 100;
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar-wrap" style="flex:1">
        <div class="bar-fill ${m.isCurrent ? 'bar-current' : ''}"
             style="height:${Math.max(heightPct, m.total > 0 ? 4 : 0)}%"
             data-tip="${fmt(m.total)}">
        </div>
      </div>
      <span class="bar-label">${m.label}</span>`;
    barChart.appendChild(col);
  });
}

// ---- FILTER DROPDOWN ----
function populateFilterDropdown() {
  const current = filterCategory.value;
  const usedCats = [...new Set(expenses.map(e => e.category))].sort();
  filterCategory.innerHTML = '<option value="all">All</option>';
  usedCats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = `${CATEGORIES[cat]?.emoji || ''} ${cat}`;
    if (cat === current) opt.selected = true;
    filterCategory.appendChild(opt);
  });
}

// ---- HELPERS ----
function fmt(amount) {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtShort(amount) {
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000)   return '₹' + (amount / 1000).toFixed(1) + 'K';
  return '₹' + Math.round(amount);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- START ----
init();
