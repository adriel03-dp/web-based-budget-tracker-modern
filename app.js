// SPA Navigation and State
const sections = {
    login: document.getElementById('login-section'),
    dashboard: document.getElementById('dashboard-section'),
    add: document.getElementById('add-section'),
    history: document.getElementById('history-section'),
    register: document.getElementById('register-section'),
    reset: document.getElementById('reset-section'),
    reports: document.getElementById('reports-section'),
};
const navLinks = {
    dashboard: document.getElementById('nav-dashboard'),
    add: document.getElementById('nav-add'),
    history: document.getElementById('nav-history'),
    reports: document.getElementById('nav-reports'),
};

// User Profile
function getUser() {
    return JSON.parse(localStorage.getItem('budget-user'));
}
function setUser(user) {
    localStorage.setItem('budget-user', JSON.stringify(user));
}
function clearUser() {
    localStorage.removeItem('budget-user');
}
function isLoggedIn() {
    const user = getUser();
    return user && user.username;
}
function showProfileNav() {
    const nav = document.querySelector('.navbar');
    let profile = document.querySelector('.nav-profile');
    if (profile) profile.remove();
    if (!isLoggedIn()) return;
    const user = getUser();
    const profileDiv = document.createElement('div');
    profileDiv.className = 'nav-profile';
    profileDiv.innerHTML = `
        <div class="profile-btn">
            <span class="profile-avatar">${user.username[0].toUpperCase()}</span>
            <span class="profile-name">${user.username}</span>
            <i class="fas fa-caret-down"></i>
        </div>
        <div class="profile-dropdown">
            <button id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
    `;
    nav.appendChild(profileDiv);
    profileDiv.querySelector('.profile-btn').addEventListener('click', () => {
        profileDiv.classList.toggle('open');
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
        clearUser();
        location.hash = '#login';
        render();
    });
    document.addEventListener('click', (e) => {
        if (!profileDiv.contains(e.target)) profileDiv.classList.remove('open');
    });
}

// User storage for demo
function getUsers() {
    return JSON.parse(localStorage.getItem('budget-users')) || [];
}
function saveUsers(users) {
    localStorage.setItem('budget-users', JSON.stringify(users));
}
function findUser(username) {
    return getUsers().find(u => u.username === username);
}

// SPA Navigation
function showSection(section) {
    Object.values(sections).forEach(sec => sec.classList.remove('active'));
    if (sections[section]) sections[section].classList.add('active');
    Object.values(navLinks).forEach(link => link.classList.remove('active'));
    if (navLinks[section]) navLinks[section].classList.add('active');
}
function render() {
    console.log('render() called');
    showProfileNav();
    if (!isLoggedIn()) {
        if (location.hash !== '#login') {
            location.hash = '#login';
            return; // Let hashchange trigger render()
        }
        showSection('login');
        console.log('Not logged in, showing: login');
        return;
    }
    let page = location.hash.replace('#', '') || 'dashboard';
    if (!sections[page]) page = 'dashboard';
    console.log('Logged in, showing:', page);
    if (!sections[page]) console.error('Section not found:', page);
    showSection(page);
    if (page === 'dashboard') {
        updateDashboard();
        renderBarChart();
    } else if (page === 'history') {
        renderTransactions();
    } else if (page === 'add') {
        // nothing extra needed
    } else if (page === 'reports') {
        // nothing extra needed
    }
    // Fallback: If no section is visible, force show correct section
    setTimeout(() => {
        // If no section is active, activate the correct one based on login state
        const anyActive = Object.values(sections).some(sec => sec.classList.contains('active'));
        if (!anyActive) {
            if (isLoggedIn()) {
                showSection('dashboard');
            } else {
                showSection('login');
            }
            console.warn('Fallback: Forced correct section to display');
        }
    }, 500);
}
window.addEventListener('hashchange', render);

// Login Logic
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        console.log('Login form submitted');
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        if (!username || !password) return;
        const user = findUser(username);
        if (!user || user.password !== password) {
            showToast('Invalid username or password', 'error');
            return;
        }
        setUser({ username });
        location.hash = '#dashboard';
    });
}

// Budget Logic
const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', CAD: '$', AUD: '$', LKR: 'Rs.'
};
function getTransactions() {
    return JSON.parse(localStorage.getItem('budget-transactions')) || [];
}
function saveTransactions(transactions) {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
}
function getLastCurrency() {
    return localStorage.getItem('budget-last-currency') || 'LKR';
}
function setLastCurrency(value) {
    localStorage.setItem('budget-last-currency', value);
}
function formatCurrency(amount, currency) {
    return `${currencySymbols[currency] || '$'}${Number(amount).toFixed(2)}`;
}
function getSummaryCurrency(transactions) {
    if (transactions.length === 0) return 'USD';
    const unique = Array.from(new Set(transactions.map(t => t.currency || 'USD')));
    return unique.length === 1 ? unique[0] : 'Mixed';
}

// Dashboard
const balance = document.getElementById('dashboard-balance');
const income = document.getElementById('dashboard-income');
const expense = document.getElementById('dashboard-expense');
const count = document.getElementById('dashboard-count');
const incomeSummary = document.getElementById('income-summary');
const expenseSummary = document.getElementById('expense-summary');
const netBalance = document.getElementById('net-balance');
let barChart = null;
function updateDashboard() {
    const transactions = getTransactions();
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const incomeTotal = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenseTotal = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const summaryCurrency = getSummaryCurrency(transactions);
    balance.textContent = summaryCurrency === 'Mixed' ? total.toFixed(2) + ' (Mixed)' : formatCurrency(total, summaryCurrency);
    income.textContent = summaryCurrency === 'Mixed' ? incomeTotal.toFixed(2) + ' (Mixed)' : formatCurrency(incomeTotal, summaryCurrency);
    expense.textContent = summaryCurrency === 'Mixed' ? expenseTotal.toFixed(2) + ' (Mixed)' : formatCurrency(expenseTotal, summaryCurrency);
    count.textContent = transactions.length;
    incomeSummary.textContent = summaryCurrency === 'Mixed' ? incomeTotal.toFixed(2) + ' (Mixed)' : formatCurrency(incomeTotal, summaryCurrency);
    expenseSummary.textContent = summaryCurrency === 'Mixed' ? expenseTotal.toFixed(2) + ' (Mixed)' : formatCurrency(expenseTotal, summaryCurrency);
    netBalance.textContent = summaryCurrency === 'Mixed' ? total.toFixed(2) + ' (Mixed)' : formatCurrency(total, summaryCurrency);
    netBalance.className = `balance-value ${total >= 0 ? 'positive' : 'negative'}`;
}
function renderBarChart() {
    console.log('renderBarChart called');
    // Ensure dashboard section is visible
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection) dashboardSection.classList.add('active');
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }
    const canvas = document.getElementById('barChart');
    if (!canvas) {
        console.error('barChart canvas not found!');
        return;
    }
    // Always clear the canvas before drawing
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const transactions = getTransactions();
    const recent = transactions.slice(-7);
    const labels = recent.map(t => t.text.length > 10 ? t.text.substring(0, 10) + '...' : t.text);
    const data = recent.map(t => t.amount);
    if (barChart && typeof barChart.destroy === 'function') {
        barChart.destroy();
        barChart = null;
    }
    if (recent.length === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('No transactions to display', ctx.canvas.width / 2, ctx.canvas.height / 2);
        console.log('No transactions to display in chart');
        return;
    }
    const maxAbs = Math.max(10, ...data.map(a => Math.abs(a)));
    function roundUp(n) {
        if (n <= 10) return 10;
        const pow = Math.pow(10, Math.floor(Math.log10(n)));
        return Math.ceil(n / pow) * pow;
    }
    const yMax = roundUp(maxAbs);
    // Detect dark mode
    const isDark = document.body.classList.contains('dark-mode');
    const chartBg = isDark ? '#232946' : '#fff';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const fontColor = isDark ? '#f4f4f4' : '#374151';
    const tooltipBg = isDark ? '#232946' : '#fff';
    const tooltipBorder = isDark ? '#35377a' : '#e5e7eb';
    const tooltipTitle = isDark ? '#f4f4f4' : '#374151';
    const tooltipBody = isDark ? '#b8b8d1' : '#374151';
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount',
                data: data,
                backgroundColor: data.map(a => a < 0 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)'),
                borderColor: data.map(a => a < 0 ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)'),
                borderWidth: 0,
                borderRadius: 6,
                maxBarThickness: 60,
                borderSkipped: false,
                barPercentage: 0.9,
                categoryPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            layout: {
                padding: { top: 16, bottom: 8, left: 8, right: 8 }
            },
            plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                    backgroundColor: tooltipBg,
                    titleColor: tooltipTitle,
                    bodyColor: tooltipBody,
                    borderColor: tooltipBorder,
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const t = recent[context.dataIndex];
                            return `Amount: ${(currencySymbols[t.currency] || '$')}${Math.abs(context.parsed.y).toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 13 }, color: fontColor }
                },
                y: {
                    beginAtZero: true,
                    max: yMax,
                    min: -yMax,
                    grid: { color: gridColor },
                    ticks: {
                        font: { size: 13 },
                        color: fontColor,
                        callback: function(value) {
                            const summaryCurrency = getSummaryCurrency(transactions);
                            return summaryCurrency === 'Mixed' ? value.toFixed(0) : (currencySymbols[summaryCurrency] || '$') + Math.abs(value).toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Add Transaction
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeText = document.getElementById('income-text');
const incomeAmount = document.getElementById('income-amount');
const incomeCurrency = document.getElementById('income-currency');
const expenseText = document.getElementById('expense-text');
const expenseAmount = document.getElementById('expense-amount');
const expenseCurrency = document.getElementById('expense-currency');
function showForm(type) {
    if (type === 'income') {
        incomeForm.style.display = 'block';
        expenseForm.style.display = 'none';
        incomeBtn.classList.add('active');
        expenseBtn.classList.remove('active');
    } else {
        incomeForm.style.display = 'none';
        expenseForm.style.display = 'block';
        incomeBtn.classList.remove('active');
        expenseBtn.classList.add('active');
    }
}
incomeBtn.addEventListener('click', () => showForm('income'));
expenseBtn.addEventListener('click', () => showForm('expense'));
// Set default currency in forms
function setDefaultCurrency() {
    const last = getLastCurrency();
    incomeCurrency.value = last;
    expenseCurrency.value = last;
}
setDefaultCurrency();
showForm('income');

incomeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (incomeText.value.trim() === '' || incomeAmount.value.trim() === '') {
        showToast('Please enter a description and amount', 'error');
        return;
    }
    const amountNum = Math.abs(parseFloat(incomeAmount.value));
    if (isNaN(amountNum) || amountNum <= 0) {
        showToast('Please enter a valid positive amount', 'error');
        return;
    }
    const currency = incomeCurrency.value;
    setLastCurrency(currency);
    const transaction = {
        id: Date.now(),
        text: incomeText.value.trim(),
        amount: amountNum,
        currency,
        date: new Date().toISOString()
    };
    const transactions = getTransactions();
    transactions.unshift(transaction);
    saveTransactions(transactions);
    incomeText.value = '';
    incomeAmount.value = '';
    setDefaultCurrency();
    showToast('Income added successfully', 'success');
    updateDashboard();
    renderBarChart();
});

expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (expenseText.value.trim() === '' || expenseAmount.value.trim() === '') {
        showToast('Please enter a description and amount', 'error');
        return;
    }
    const amountNum = Math.abs(parseFloat(expenseAmount.value));
    if (isNaN(amountNum) || amountNum <= 0) {
        showToast('Please enter a valid positive amount', 'error');
        return;
    }
    const currency = expenseCurrency.value;
    setLastCurrency(currency);
    const transaction = {
        id: Date.now(),
        text: expenseText.value.trim(),
        amount: -amountNum,
        currency,
        date: new Date().toISOString()
    };
    const transactions = getTransactions();
    transactions.unshift(transaction);
    saveTransactions(transactions);
    expenseText.value = '';
    expenseAmount.value = '';
    setDefaultCurrency();
    showToast('Expense added successfully', 'success');
    updateDashboard();
    renderBarChart();
});

// History
const list = document.getElementById('list');
const emptyState = document.getElementById('empty-state');
function renderTransactions() {
    const transactions = getTransactions();
    list.innerHTML = '';
    if (transactions.length === 0) {
        emptyState.style.display = 'block';
        list.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        list.style.display = 'block';
    }
    transactions.forEach((transaction, index) => {
        addTransactionDOM(transaction, index);
    });
}
function addTransactionDOM(transaction, index) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add('transaction-item');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    const date = new Date(transaction.date || Date.now()).toLocaleDateString();
    item.innerHTML = `
        <div class="transaction-details">
            <div class="transaction-description">${transaction.text}</div>
            <div class="transaction-date">${date}</div>
        </div>
        <div class="transaction-amount">
            <span class="amount-value ${transaction.amount < 0 ? 'minus' : 'plus'}">
                ${sign}${formatCurrency(Math.abs(transaction.amount), transaction.currency || 'USD')}
            </span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    item.style.animationDelay = `${index * 0.1}s`;
    list.appendChild(item);
}
window.removeTransaction = function(id) {
    let transactions = getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions(transactions);
    renderTransactions();
    updateDashboard();
    renderBarChart();
    showToast('Transaction removed', 'info');
};

// Toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    toast.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .toast-content { display: flex; align-items: center; gap: 10px; }
`;
document.head.appendChild(style);

// Registration logic
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        console.log('Register form submitted');
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        if (!username || !password || !confirm) return;
        if (password !== confirm) {
            showToast('Passwords do not match', 'error');
            return;
        }
        if (findUser(username)) {
            showToast('Username already exists', 'error');
            return;
        }
        const users = getUsers();
        users.push({ username, password });
        saveUsers(users);
        setUser({ username });
        location.hash = '#dashboard';
        showToast('Registration successful!', 'success');
    });
}

// Password reset logic
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', function(e) {
        console.log('Reset form submitted');
        e.preventDefault();
        const username = document.getElementById('reset-username').value.trim();
        const password = document.getElementById('reset-password').value;
        const confirm = document.getElementById('reset-confirm').value;
        if (!username || !password || !confirm) return;
        if (password !== confirm) {
            showToast('Passwords do not match', 'error');
            return;
        }
        const users = getUsers();
        const user = users.find(u => u.username === username);
        if (!user) {
            showToast('Username not found', 'error');
            return;
        }
        user.password = password;
        saveUsers(users);
        location.hash = '#login';
        render();
        showToast('Password reset successful!', 'success');
    });
}

// SPA links for switching forms
function setupSpaLinks() {
    const toRegister = document.getElementById('to-register');
    const toReset = document.getElementById('to-reset');
    const toLoginFromRegister = document.getElementById('to-login-from-register');
    const toLoginFromReset = document.getElementById('to-login-from-reset');
    if (toRegister) toRegister.onclick = () => { location.hash = '#register'; render(); };
    if (toReset) toReset.onclick = () => { location.hash = '#reset'; render(); };
    if (toLoginFromRegister) toLoginFromRegister.onclick = () => { location.hash = '#login'; render(); };
    if (toLoginFromReset) toLoginFromReset.onclick = () => { location.hash = '#login'; render(); };
}
setupSpaLinks();

// Add SPA navigation for nav links (add reports)
Object.entries({ ...navLinks, reports: document.getElementById('nav-reports') }).forEach(([page, link]) => {
    if (link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            location.hash = `#${page}`;
            render();
        });
    }
});

// Dark mode toggle logic
const darkModeBtn = document.getElementById('dark-mode-toggle');
function setDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('budget-dark-mode', enabled ? '1' : '0');
}
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        const enabled = !document.body.classList.contains('dark-mode');
        setDarkMode(enabled);
    });
}
// On page load, apply saved dark mode preference
const darkPref = localStorage.getItem('budget-dark-mode');
if (darkPref === '1') setDarkMode(true);
else setDarkMode(false);

// Initial render
render();

// PDF Report Generation
function getReportDateRange() {
    const start = document.getElementById('report-start-date').value;
    const end = document.getElementById('report-end-date').value;
    return {
        start: start ? new Date(start) : null,
        end: end ? new Date(end + 'T23:59:59') : null
    };
}
function filterByDate(transactions, start, end) {
    return transactions.filter(t => {
        const d = new Date(t.date);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
    });
}
function addPdfBranding(doc, color) {
    // Add logo (default icon) and app name
    // You can replace this with your own logo as a data URL
    const logo = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNjM2NmYxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiLz48L3N2Zz4=';
    doc.addImage(logo, 'PNG', 14, 8, 10, 10);
    doc.setFontSize(16);
    doc.setTextColor(...color);
    doc.text('Modern Budget Tracker', 26, 16);
}
function generatePDFReport(type) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const all = getTransactions();
    const { start, end } = getReportDateRange();
    let filtered;
    let title;
    let color;
    if (type === 'income') {
        filtered = all.filter(t => t.amount > 0);
        title = 'Income Report';
        color = [34, 197, 94];
    } else if (type === 'expense') {
        filtered = all.filter(t => t.amount < 0);
        title = 'Expense Report';
        color = [239, 68, 68];
    } else {
        filtered = all;
        title = 'Combined Report';
        color = [99, 102, 241];
    }
    filtered = filterByDate(filtered, start, end);
    addPdfBranding(doc, color);
    doc.setFontSize(18);
    doc.setTextColor(...color);
    doc.text(title, 14, 28);
    doc.setFontSize(12);
    doc.setTextColor(60,60,60);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
    let tableData, head;
    if (type === 'combined') {
        head = [['Date', 'Description', 'Type', 'Amount', 'Currency']];
        tableData = filtered.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.text,
            t.amount > 0 ? 'Income' : 'Expense',
            `${currencySymbols[t.currency] || '$'}${Math.abs(t.amount).toFixed(2)}`,
            t.currency || 'USD'
        ]);
    } else {
        head = [['Date', 'Description', 'Amount', 'Currency']];
        tableData = filtered.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.text,
            `${currencySymbols[t.currency] || '$'}${Math.abs(t.amount).toFixed(2)}`,
            t.currency || 'USD'
        ]);
    }
    const totalIncome = filtered.filter(t => t.amount > 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const totalExpense = filtered.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    window.jspdfAutoTable.default(doc, {
        head: head,
        body: tableData,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: color, textColor: 255 },
        bodyStyles: { textColor: 30 },
        styles: { fontSize: 11, cellPadding: 2 },
        didDrawPage: function (data) {
            doc.setFontSize(13);
            doc.setTextColor(...color);
            let y = doc.lastAutoTable.finalY + 10;
            if (type === 'combined') {
                doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, y);
                doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 80, y);
            } else if (type === 'income') {
                doc.text(`Total: $${totalIncome.toFixed(2)}`, 14, y);
            } else if (type === 'expense') {
                doc.text(`Total: $${totalExpense.toFixed(2)}`, 14, y);
            }
        }
    });
    doc.save(`${title.replace(' ', '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
    showToast('Report downloaded successfully!', 'success');
}
const incomePdfBtn = document.getElementById('download-income-pdf');
const expensePdfBtn = document.getElementById('download-expense-pdf');
const combinedPdfBtn = document.getElementById('download-combined-pdf');
if (incomePdfBtn) incomePdfBtn.onclick = () => generatePDFReport('income');
if (expensePdfBtn) expensePdfBtn.onclick = () => generatePDFReport('expense');
if (combinedPdfBtn) combinedPdfBtn.onclick = () => generatePDFReport('combined');

// Report Modal Logic
const reportModal = document.getElementById('report-modal');
const openReportBtn = document.getElementById('generate-report-btn');
const closeReportBtn = document.getElementById('close-report-modal');
if (openReportBtn && reportModal) {
    openReportBtn.onclick = () => {
        reportModal.style.display = 'flex';
        // Attach listeners every time modal is opened
        const incomePdfBtn = document.getElementById('download-income-pdf');
        const expensePdfBtn = document.getElementById('download-expense-pdf');
        const combinedPdfBtn = document.getElementById('download-combined-pdf');
        if (incomePdfBtn) incomePdfBtn.onclick = () => generatePDFReport('income');
        if (expensePdfBtn) expensePdfBtn.onclick = () => generatePDFReport('expense');
        if (combinedPdfBtn) combinedPdfBtn.onclick = () => generatePDFReport('combined');
    };
}
if (closeReportBtn && reportModal) {
    closeReportBtn.onclick = () => { reportModal.style.display = 'none'; };
}
window.onclick = function(event) {
    if (event.target === reportModal) {
        reportModal.style.display = 'none';
    }
}; 