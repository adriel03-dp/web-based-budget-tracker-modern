// History page logic
const list = document.getElementById('list');
const emptyState = document.getElementById('empty-state');

function getTransactions() {
    return JSON.parse(localStorage.getItem('budget-transactions')) || [];
}

function saveToLocalStorage(transactions) {
    localStorage.setItem('budget-transactions', JSON.stringify(transactions));
}

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
                ${sign}$${Math.abs(transaction.amount).toFixed(2)}
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
    saveToLocalStorage(transactions);
    renderTransactions();
    showToast('Transaction removed', 'info');
};

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

renderTransactions(); 