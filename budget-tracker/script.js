// Budget Tracker Logic
const balance = document.getElementById('dashboard-balance');
const income = document.getElementById('dashboard-income');
const expense = document.getElementById('dashboard-expense');
const count = document.getElementById('dashboard-count');
const incomeSummary = document.getElementById('income-summary');
const expenseSummary = document.getElementById('expense-summary');
const netBalance = document.getElementById('net-balance');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const emptyState = document.getElementById('empty-state');

let transactions = JSON.parse(localStorage.getItem('budget-transactions')) || [];
let barChart = null;

// Initialize app
init();

function init() {
    updateAllValues();
    renderTransactions();
    renderBarChart();
}

function updateAllValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0);
    const incomeTotal = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
    const expenseTotal = amounts.filter(a => a < 0).reduce((acc, val) => acc + Math.abs(val), 0);

    // Update dashboard cards
    balance.textContent = `$${total.toFixed(2)}`;
    income.textContent = `$${incomeTotal.toFixed(2)}`;
    expense.textContent = `$${expenseTotal.toFixed(2)}`;
    count.textContent = transactions.length;

    // Update summary section
    incomeSummary.textContent = `$${incomeTotal.toFixed(2)}`;
    expenseSummary.textContent = `$${expenseTotal.toFixed(2)}`;
    netBalance.textContent = `$${total.toFixed(2)}`;
    
    // Update net balance color
    netBalance.className = `balance-value ${total >= 0 ? 'positive' : 'negative'}`;

    // Show/hide empty state
    if (transactions.length === 0) {
        emptyState.style.display = 'block';
        list.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        list.style.display = 'block';
    }
}

function renderTransactions() {
    list.innerHTML = '';
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
                ${sign}$${Math.abs(transaction.amount).toFixed(2)}
            </span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add animation delay
    item.style.animationDelay = `${index * 0.1}s`;
    list.appendChild(item);
}

function renderBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    // Show last 7 transactions (or fewer)
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

    // Calculate dynamic y-axis max
    const maxAbs = Math.max(10, ...data.map(a => Math.abs(a)));
    // Round up to nearest "nice" number
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
                            return `Amount: $${Math.abs(context.parsed.y).toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: yMax,
                    min: -yMax,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + Math.abs(value).toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Form toggling and handling
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeText = document.getElementById('income-text');
const incomeAmount = document.getElementById('income-amount');
const expenseText = document.getElementById('expense-text');
const expenseAmount = document.getElementById('expense-amount');

// Show only the selected form
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
// Show income form by default
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
    const transaction = {
        id: Date.now(),
        text: incomeText.value.trim(),
        amount: amountNum,
        date: new Date().toISOString()
    };
    transactions.unshift(transaction);
    saveToLocalStorage();
    updateAllValues();
    renderTransactions();
    renderBarChart();
    incomeText.value = '';
    incomeAmount.value = '';
    showToast('Income added successfully', 'success');
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
    const transaction = {
        id: Date.now(),
        text: expenseText.value.trim(),
        amount: -amountNum,
        date: new Date().toISOString()
    };
    transactions.unshift(transaction);
    saveToLocalStorage();
    updateAllValues();
    renderTransactions();
    renderBarChart();
    expenseText.value = '';
    expenseAmount.value = '';
    showToast('Expense added successfully', 'success');
});

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage();
    updateAllValues();
    renderTransactions();
    renderBarChart();
    showToast('Transaction removed', 'info');
}

function saveToLocalStorage() {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for toast
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
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    toast.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
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

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

// Event listeners
form.addEventListener('submit', addTransaction);

// Make removeTransaction available globally
window.removeTransaction = removeTransaction;
