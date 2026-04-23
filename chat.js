const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST" }, 405);
  }

  try {
    const body = await req.json();
    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : typeof body?.question === "string"
          ? body.question.trim()
          : "";
    const page = typeof body?.page === "string" ? body.page.trim() : "";

    if (!message) {
      return jsonResponse({ error: "Missing message" }, 400);
    }

    if (message.length > 800) {
      return jsonResponse({ error: "Message too long" }, 400);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: "Server missing OPENAI_API_KEY" }, 500);
    }

    const system = `
אתה עוזר-מידע בעברית לאתר "רקמה אנושית אחת" העוסק בפרשת נחשון וקסמן וניר פורז ז"ל.
כללים:
- ענה בעברית, בטון מכבד, קצר וברור.
- אם אתה לא בטוח בעובדה: אמור שאינך בטוח והצע לבדוק בעמודים באתר.
- אל תמציא שמות/מספרים/ציטוטים.
- בסוף התשובה הצע לאיזה עמוד באתר כדאי להיכנס.
    `.trim();

    const userMessage = page ? `[page=${page}] ${message}` : message;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 350,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!r.ok) {
      return jsonResponse({ error: "OpenAI error", details: data }, 500);
    }

    const reply = data?.choices?.[0]?.message?.content ?? "לא הצלחתי לענות כרגע.";
    return jsonResponse({ reply, answer: reply });
  } catch (err) {
    return jsonResponse({ error: "Server error", details: String(err) }, 500);
  }
}

export default handler;