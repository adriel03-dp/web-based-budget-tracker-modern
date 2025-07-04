const currencySelect = document.getElementById('currency-select');
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: '$',
    AUD: '$'
};
function getCurrency() {
    return localStorage.getItem('budget-currency') || 'USD';
}
function setCurrency(value) {
    localStorage.setItem('budget-currency', value);
}
function getSummaryCurrency(transactions) {
    if (transactions.length === 0) return 'USD';
    const unique = Array.from(new Set(transactions.map(t => t.currency || 'USD')));
    return unique.length === 1 ? unique[0] : 'Mixed';
}
function formatCurrency(amount, currency) {
    if (currency === 'Mixed') return amount.toFixed(2) + ' (Mixed)';
    return `${currencySymbols[currency] || '$'}${Number(amount).toFixed(2)}`;
}
// Set selector to saved value
currencySelect.value = getCurrency();
currencySelect.addEventListener('change', function() {
    setCurrency(this.value);
    updateDashboard();
    renderBarChart();
});
function updateDashboard() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0);
    const incomeTotal = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenseTotal = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const summaryCurrency = getSummaryCurrency(transactions);
    balance.textContent = formatCurrency(total, summaryCurrency);
    income.textContent = formatCurrency(incomeTotal, summaryCurrency);
    expense.textContent = formatCurrency(expenseTotal, summaryCurrency);
    count.textContent = transactions.length;
    incomeSummary.textContent = formatCurrency(incomeTotal, summaryCurrency);
    expenseSummary.textContent = formatCurrency(expenseTotal, summaryCurrency);
    netBalance.textContent = formatCurrency(total, summaryCurrency);
    netBalance.className = `balance-value ${total >= 0 ? 'positive' : 'negative'}`;
}
function renderBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    const recent = transactions.slice(-7);
    const labels = recent.map(t => t.text.length > 10 ? t.text.substring(0, 10) + '...' : t.text);
    const data = recent.map(t => t.amount);
    if (barChart) barChart.destroy();
    if (recent.length === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('No transactions to display', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    const maxAbs = Math.max(10, ...data.map(a => Math.abs(a)));
    function roundUp(n) {
        if (n <= 10) return 10;
        const pow = Math.pow(10, Math.floor(Math.log10(n)));
        return Math.ceil(n / pow) * pow;
    }
    const yMax = roundUp(maxAbs);
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount',
                data: data,
                backgroundColor: data.map(a => a < 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)'),
                borderColor: data.map(a => a < 0 ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)'),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: 0.5,
                categoryPercentage: 0.6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#374151',
                    bodyColor: '#374151',
                    borderColor: '#e5e7eb',
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
                    ticks: { font: { size: 12 } }
                },
                y: {
                    beginAtZero: true,
                    max: yMax,
                    min: -yMax,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: {
                        font: { size: 12 },
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
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('budget-user'));
    if (!user || !user.username) {
        window.location.href = 'login.html';
    }
    return user;
}
function setupProfileNav() {
    const user = checkAuth();
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    let profile = document.querySelector('.nav-profile');
    if (profile) profile.remove();
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
        localStorage.removeItem('budget-user');
        window.location.href = 'login.html';
    });
    document.addEventListener('click', (e) => {
        if (!profileDiv.contains(e.target)) profileDiv.classList.remove('open');
    });
}
setupProfileNav();
updateDashboard();
renderBarChart(); 