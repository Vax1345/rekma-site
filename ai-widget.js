js
(function () {
  const box = document.createElement("div");
  box.dir = "rtl";
  box.style.cssText = `
    position:fixed; bottom:16px; left:16px;
    width:320px; max-width:calc(100vw - 32px);
    background:#0b1b2b; color:#fff;
    border:1px solid rgba(255,255,255,.15);
    border-radius:14px; padding:12px;
    font-family:Arial, sans-serif; z-index:99999;
  `;

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
      <strong style="font-size:14px;">עוזר מקורות (AI)</strong>
      <button id="aiCloseBtn" style="background:transparent;border:0;color:#fff;font-size:14px;cursor:pointer;">סגור</button>
    </div>
    <div style="font-size:12px;opacity:.85;margin:6px 0 10px;">
      משלב מידע מהאתר עם רקע כללי. לציטוטים והוכחות—בדקו מקורות.
    </div>
    <textarea id="aiQ" rows="2" placeholder="שאל/י שאלה..." style="width:100%;border-radius:10px;border:0;padding:10px;resize:vertical;"></textarea>
    <button id="aiAsk" style="margin-top:8px;width:100%;padding:10px;border:0;border-radius:10px;background:#28a745;color:#fff;cursor:pointer;">
      שאל
    </button>
    <pre id="aiA" style="white-space:pre-wrap;background:rgba(255,255,255,.08);padding:10px;border-radius:10px;margin-top:10px;max-height:260px;overflow:auto;"></pre>
  `;

  document.body.appendChild(box);

  document.getElementById("aiCloseBtn").onclick = () => box.remove();

  document.getElementById("aiAsk").onclick = async () => {
    const q = document.getElementById("aiQ").value.trim();
    const out = document.getElementById("aiA");
    if (!q) return;
    out.textContent = "טוען...";

    try {
      const page = location.pathname.split("/").pop() || "index.html";
      const r = await fetch("/.netlify/functions/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, page })
      });
      const j = await r.json();
      out.textContent = j.answer || (j.error ? (j.error + "\n" + (j.details || "")) : "שגיאה");
    } catch (e) {
      out.textContent = "שגיאת רשת: " + e.message;
    }
  };
})();