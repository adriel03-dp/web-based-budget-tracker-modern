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
function formatCurrency(amount, currency) {
    return `${currencySymbols[currency] || '$'}${Number(amount).toFixed(2)}`;
}
currencySelect.value = getCurrency();
currencySelect.addEventListener('change', function() {
    setCurrency(this.value);
    renderTransactions();
});
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