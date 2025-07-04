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
function formatCurrency(amount) {
    const curr = getCurrency();
    return `${currencySymbols[curr] || '$'}${Number(amount).toFixed(2)}`;
}
currencySelect.value = getCurrency();
currencySelect.addEventListener('change', function() {
    setCurrency(this.value);
});

function getLastCurrency() {
    return localStorage.getItem('budget-last-currency') || 'USD';
}
function setLastCurrency(value) {
    localStorage.setItem('budget-last-currency', value);
}
function formatCurrency(amount, currency) {
    return `${currencySymbols[currency] || '$'}${Number(amount).toFixed(2)}`;
}

// Set default currency in forms
const incomeCurrency = document.getElementById('income-currency');
const expenseCurrency = document.getElementById('expense-currency');
incomeCurrency.value = getLastCurrency();
expenseCurrency.value = getLastCurrency();

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
    saveToLocalStorage(transactions);
    incomeText.value = '';
    incomeAmount.value = '';
    incomeCurrency.value = currency;
    expenseCurrency.value = currency;
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
    saveToLocalStorage(transactions);
    expenseText.value = '';
    expenseAmount.value = '';
    incomeCurrency.value = currency;
    expenseCurrency.value = currency;
    showToast('Expense added successfully', 'success');
});

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