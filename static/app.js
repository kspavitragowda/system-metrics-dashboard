const $ = (id) => document.getElementById(id);

function formatUptime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function healthLabel(value) {
  if (value >= 90) return { label: "Critical", className: "critical" };
  if (value >= 70) return { label: "Warning", className: "warning" };
  return { label: "Healthy", className: "" };
}

function setMetric(prefix, value, detail = null) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  $(`${prefix}-value`).textContent = safeValue.toFixed(1);
  $(`${prefix}-bar`).style.width = `${safeValue}%`;
  const state = healthLabel(safeValue);
  $(`${prefix}-state`).textContent = state.label;
  $(`${prefix}-health`).textContent = `${state.label} · ${safeValue.toFixed(1)}%`;
  const indicator = $(`${prefix}-indicator`);
  indicator.className = `health-indicator ${state.className}`;
  if (detail) $(`${prefix}-detail`).textContent = detail;
}

async function updateDashboard() {
  try {
    const response = await fetch("/api/metrics", { cache: "no-store" });
    if (!response.ok) throw new Error("Metrics API returned an error");
    const data = await response.json();

    setMetric("cpu", data.cpu);
    setMetric("memory", data.memory.percent,
      `Used ${data.memory.used_gb} of ${data.memory.total_gb} GB`);
    setMetric("disk", data.disk.percent,
      `Used ${data.disk.used_gb} of ${data.disk.total_gb} GB`);

    $("system-name").textContent = data.system || "System";
    $("hostname").textContent = data.hostname || "Local environment";
    $("service-status").textContent = "Operational";
    $("service-detail").textContent = "Metrics API responding";
    $("uptime").textContent = formatUptime(data.uptime_seconds);
    $("last-updated").textContent = new Date(data.updated_at).toLocaleTimeString();
    $("error-banner").hidden = true;
  } catch (error) {
    $("service-status").textContent = "Connection issue";
    $("service-detail").textContent = "Retrying automatically";
    $("error-banner").hidden = false;
  }
}

updateDashboard();
setInterval(updateDashboard, 2000);
