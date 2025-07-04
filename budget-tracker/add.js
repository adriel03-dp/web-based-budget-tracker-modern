// Add Transaction page logic
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeText = document.getElementById('income-text');
const incomeAmount = document.getElementById('income-amount');
const expenseText = document.getElementById('expense-text');
const expenseAmount = document.getElementById('expense-amount');

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
showForm('income');

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

function saveToLocalStorage(transactions) {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('budget-transactions')) || [];
}

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
    const transactions = getTransactions();
    transactions.unshift(transaction);
    saveToLocalStorage(transactions);
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
    const transactions = getTransactions();
    transactions.unshift(transaction);
    saveToLocalStorage(transactions);
    expenseText.value = '';
    expenseAmount.value = '';
    showToast('Expense added successfully', 'success');
}); 