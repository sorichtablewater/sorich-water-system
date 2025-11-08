console.log("✅ Corrections script connected successfully");

// -------- SALES LOGIC UPDATE --------
function calculateAvgUnitPrice() {
    if (salesData.length === 0) return 0;
    let sumUnit = salesData.reduce((acc, s) => acc + parseFloat(s.unit), 0);
    return (sumUnit / salesData.length).toFixed(2);
}

function renderSalesTable() {
    const table = document.getElementById("salesTable");
    if (!table) return;
    table.innerHTML = '<tr><th>Customer</th><th>Qty</th><th>Total</th><th>Unit Price</th><th>Paid</th><th>Owing</th><th>🖨</th></tr>';

    let sumQty = 0, sumTotal = 0, sumPaid = 0, sumOwing = 0;

    salesData.forEach(s => {
        const row = table.insertRow();
        row.insertCell(0).innerText = s.customer;
        row.insertCell(1).innerText = s.qty;
        row.insertCell(2).innerText = s.total;
        row.insertCell(3).innerText = s.unit;
        row.insertCell(4).innerText = s.paid;
        row.insertCell(5).innerText = s.owing;

        const btn = document.createElement('button');
        btn.innerText = 'Print';
        btn.onclick = () => printInvoice(s);
        row.insertCell(6).appendChild(btn);

        sumQty += parseFloat(s.qty);
        sumTotal += parseFloat(s.total);
        sumPaid += parseFloat(s.paid);
        sumOwing += parseFloat(s.owing);
    });

    document.getElementById('sumQty').innerText = sumQty;
    document.getElementById('sumTotal').innerText = sumTotal;
    document.getElementById('sumPaid').innerText = sumPaid;
    document.getElementById('sumOwing').innerText = sumOwing;
    document.getElementById('avgPrice').innerText = calculateAvgUnitPrice();
    document.getElementById('totalSales').innerText = sumTotal;
    document.getElementById('totalPaid').innerText = sumPaid;
    document.getElementById('debts').innerText = sumOwing;
    document.getElementById('avgUnitPrice').innerText = calculateAvgUnitPrice();
}

// -------- END OF DAY UPDATE --------
function endOfDay() {
    if (salesData.length === 0) {
        alert('No sales today!');
        return;
    }

    const totalSales = salesData.reduce((acc, s) => acc + parseFloat(s.total), 0);
    const avgUnitPrice = calculateAvgUnitPrice();

    dailyData.push({
        date: new Date().toLocaleDateString(),
        totalSales,
        avgUnitPrice
    });

    renderDailyRecords();
    alert('✅ End of Day completed. Sales moved to Daily Records.');

    // Clear only salesData, keep expenses and debtors
    salesData = [];
    renderSalesTable();
}

// -------- CHARTS FIX --------
function renderChart() {
    const ctx = document.getElementById("chartCanvas");
    if (!ctx) return;
    const chartCtx = ctx.getContext('2d');

    const grouped = salesData.reduce((acc, s) => {
        acc[s.customer] = (acc[s.customer] || 0) + parseFloat(s.total);
        return acc;
    }, {});

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    if (window.salesChart) window.salesChart.destroy(); // Clear previous chart

    window.salesChart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Sales per Customer',
                data: data,
                backgroundColor: 'lightblue'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}
