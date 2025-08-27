// ---------- Dados Financeiros ----------
function getEntries() {
  return JSON.parse(localStorage.getItem("entries")) || [];
}
function saveEntries(entries) {
  localStorage.setItem("entries", JSON.stringify(entries));
}
function addFinance() {
  let entries = getEntries();
  let entry = {
    date: document.getElementById("fin-date").value,
    amount: parseFloat(document.getElementById("fin-amount").value),
    type: document.getElementById("fin-type").value,
    category: document.getElementById("fin-category").value,
    subcategory: document.getElementById("fin-subcategory").value
  };
  entries.push(entry);
  saveEntries(entries);
  renderFinance();
  generateReports();
}
function renderFinance() {
  let list = document.getElementById("finance-list");
  let entries = getEntries();
  list.innerHTML = entries.map(e => `<div>${e.date} - ${e.type} - ${e.amount} (${e.category}/${e.subcategory})</div>`).join("");
}

// ---------- Relatórios Financeiros ----------
function generateReports() {
  const entries = getEntries();
  const now = new Date();
  let daily = 0, weekly = 0, monthly = 0;

  entries.forEach(e => {
    let d = new Date(e.date);
    if (d.toDateString() === now.toDateString()) daily += e.type === "income" ? e.amount : -e.amount;
    let startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    if (d >= startOfWeek && d <= endOfWeek) weekly += e.type === "income" ? e.amount : -e.amount;
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthly += e.type === "income" ? e.amount : -e.amount;
  });

  document.getElementById("daily-summary").innerText = "Resumo diário: " + daily.toFixed(2);
  document.getElementById("weekly-summary").innerText = "Resumo semanal: " + weekly.toFixed(2);
  document.getElementById("monthly-summary").innerText = "Resumo mensal: " + monthly.toFixed(2);
}

// ---------- Dados Corridas ----------
function getRuns() {
  return JSON.parse(localStorage.getItem("runs")) || [];
}
function saveRuns(runs) {
  localStorage.setItem("runs", JSON.stringify(runs));
}
function addRun() {
  let runs = getRuns();
  let run = {
    date: document.getElementById("run-date").value,
    earnings: parseFloat(document.getElementById("run-earnings").value) || 0,
    km: parseFloat(document.getElementById("run-km").value) || 0,
    gas: parseFloat(document.getElementById("run-gas").value) || 0,
    oil: parseFloat(document.getElementById("run-oil").value) || 0,
    brakes: parseFloat(document.getElementById("run-brakes").value) || 0,
    maintenance: parseFloat(document.getElementById("run-maintenance").value) || 0
  };
  runs.push(run);
  saveRuns(runs);
  renderRunsChart();
  generateRunReports();
}

// Backup e Restauração Corridas
function backupRuns() {
  const runs = getRuns();
  const blob = new Blob([JSON.stringify(runs)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_corridas.json";
  a.click();
}
function restoreRuns(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    saveRuns(data);
    renderRunsChart();
    generateRunReports();
  };
  reader.readAsText(file);
}

// Gráfico Corridas
let runsChart;
function renderRunsChart() {
  const runs = getRuns();
  let totalGas = runs.reduce((sum, r) => sum + r.gas, 0);
  let totalOil = runs.reduce((sum, r) => sum + r.oil, 0);
  let totalBrakes = runs.reduce((sum, r) => sum + r.brakes, 0);
  let totalMaint = runs.reduce((sum, r) => sum + r.maintenance, 0);
  const ctx = document.getElementById("runsChart").getContext("2d");
  if (runsChart) runsChart.destroy();
  runsChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Gasolina", "Óleo", "Freios", "Manutenção"],
      datasets: [{
        data: [totalGas, totalOil, totalBrakes, totalMaint],
        backgroundColor: ["#ff6384","#36a2eb","#ffce56","#4caf50"]
      }]
    }
  });
}

// Relatórios Corridas
function generateRunReports() {
  const runs = getRuns();
  const now = new Date();
  let daily = 0, weekly = 0, monthly = 0;

  runs.forEach(r => {
    let d = new Date(r.date);
    if (d.toDateString() === now.toDateString()) daily += r.earnings;
    let startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    if (d >= startOfWeek && d <= endOfWeek) weekly += r.earnings;
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthly += r.earnings;
  });

  document.getElementById("runs-daily").innerText = "Resumo diário corridas: " + daily.toFixed(2);
  document.getElementById("runs-weekly").innerText = "Resumo semanal corridas: " + weekly.toFixed(2);
  document.getElementById("runs-monthly").innerText = "Resumo mensal corridas: " + monthly.toFixed(2);
}

// ---------- Navegação ----------
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(el => el.style.display = "none");
  document.getElementById(tab).style.display = "block";
  if (tab === "reports") generateReports();
  if (tab === "corridas") { renderRunsChart(); generateRunReports(); }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  renderFinance();
  renderRunsChart();
  generateReports();
  generateRunReports();
});
