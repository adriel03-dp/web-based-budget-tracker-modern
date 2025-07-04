// Dashboard page logic
const balance = document.getElementById('dashboard-balance');
const income = document.getElementById('dashboard-income');
const expense = document.getElementById('dashboard-expense');
const count = document.getElementById('dashboard-count');
const incomeSummary = document.getElementById('income-summary');
const expenseSummary = document.getElementById('expense-summary');
const netBalance = document.getElementById('net-balance');

let transactions = JSON.parse(localStorage.getItem('budget-transactions')) || [];
let barChart = null;

function updateDashboard() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0);
    const incomeTotal = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
    const expenseTotal = amounts.filter(a => a < 0).reduce((acc, val) => acc + Math.abs(val), 0);
    balance.textContent = `$${total.toFixed(2)}`;
    income.textContent = `$${incomeTotal.toFixed(2)}`;
    expense.textContent = `$${expenseTotal.toFixed(2)}`;
    count.textContent = transactions.length;
    incomeSummary.textContent = `$${incomeTotal.toFixed(2)}`;
    expenseSummary.textContent = `$${expenseTotal.toFixed(2)}`;
    netBalance.textContent = `$${total.toFixed(2)}`;
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
                            return `Amount: $${Math.abs(context.parsed.y).toFixed(2)}`;
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
                        callback: function(value) { return '$' + Math.abs(value).toFixed(0); }
                    }
                }
            }
        }
    });
}

updateDashboard();
renderBarChart(); 