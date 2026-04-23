async function loadSources() {
  const res = await fetch("data/sources.json");
  if (!res.ok) throw new Error("לא ניתן לטעון data/sources.json");
  return await res.json();
}

function render(listEl, items) {
  listEl.innerHTML = "";
  for (const s of items) {
    const div = document.createElement("div");
    div.className = "source-item";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
        <div>
          <strong>${escapeHtml(s.title || "ללא כותרת")}</strong>
          ${s.reliability ? `<span class="badge">אמינות: ${escapeHtml(s.reliability)}</span>` : ""}
          ${s.category ? `<span class="badge">${escapeHtml(s.category)}</span>` : ""}
        </div>
      </div>
      <div class="small">${escapeHtml(s.summary || "")}</div>
      <div class="meta">
        ${Array.isArray(s.tags) ? s.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("") : ""}
        ${Array.isArray(s.relevant_pages) ? s.relevant_pages.map(p => `<span class="tag">${escapeHtml(p)}</span>`).join("") : ""}
      </div>
      <div style="margin-top:8px;">
        ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">פתח מקור</a>` : `<span class="small">אין קישור</span>`}
        ${s.id ? `<span class="small"> · ID: ${escapeHtml(s.id)}</span>` : ""}
        ${s.date ? `<span class="small"> · תאריך: ${escapeHtml(s.date)}</span>` : ""}
      </div>
    `;
    listEl.appendChild(div);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

function applyFilters(all) {
  const q = document.getElementById("q").value.trim().toLowerCase();
  const cat = document.getElementById("cat").value;

  return all.filter(s => {
    const hay = [
      s.title, s.summary, s.type, s.category,
      ...(s.tags || []),
      ...(s.relevant_pages || [])
    ].join(" ").toLowerCase();

    const okQ = !q || hay.includes(q);
    const okCat = !cat || (s.category === cat);
    return okQ && okCat;
  });
}

(async function init(){
  const listEl = document.getElementById("list");
  const statusEl = document.getElementById("status");
  let all = [];

  try {
    statusEl.textContent = "טוען מקורות...";
    all = await loadSources();
    render(listEl, all);
    statusEl.textContent = `נטענו ${all.length} מקורות.`;
  } catch (e) {
    statusEl.textContent = "שגיאה: " + e.message;
  }

  document.getElementById("apply").onclick = () => {
    const filtered = applyFilters(all);
    render(listEl, filtered);
    statusEl.textContent = `מציג ${filtered.length} מתוך ${all.length}.`;
  };

  document.getElementById("reset").onclick = () => {
    document.getElementById("q").value = "";
    document.getElementById("cat").value = "";
    render(listEl, all);
    statusEl.textContent = `נטענו ${all.length} מקורות.`;
  };
})();