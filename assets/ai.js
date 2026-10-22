/* Etrynity AI — chat widget, Solution Finder and contact-message drafting.
   Talks to /api/chat (Claude). If the endpoint is unavailable (local preview,
   no API key), it answers from built-in company knowledge so nothing breaks. */
(function () {
  var ENDPOINT = "/api/chat";
  var EMBLEM = "assets/emblem.png";
  var offline = location.protocol === "file:";

  /* ---------- Helpers ---------- */
  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Minimal, safe formatter: escape first, then **bold**, "## " headings and "- " bullets.
  function format(text) {
    var out = [], list = false;
    esc(text).split("\n").forEach(function (line) {
      var l = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (/^\s*[-•]\s+/.test(l)) {
        if (!list) { out.push("<ul>"); list = true; }
        out.push("<li>" + l.replace(/^\s*[-•]\s+/, "") + "</li>");
        return;
      }
      if (list) { out.push("</ul>"); list = false; }
      if (/^##\s+/.test(l)) out.push("<h4>" + l.replace(/^##\s+/, "") + "</h4>");
      else if (l.trim()) out.push("<div>" + l + "</div>");
    });
    if (list) out.push("</ul>");
    return out.join("");
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Offline knowledge (demo mode) ---------- */
  var DIVISIONS = [
    { name: "IT & Technology", keys: /software|app|web|cloud|data|ai\b|automat|digital|it\b|tech|platform|website|system|crm|erp|security/i,
      why: "custom software, cloud, data, AI and automation built to scale with you." },
    { name: "BPO & Global Services", keys: /support|customer|call|back.?office|staff|hiring|team|outsourc|operation|admin|finance|process|ticket/i,
      why: "skilled teams and refined processes for customer experience and back-office work." },
    { name: "Logistics & Supply Chain", keys: /ship|deliver|freight|warehouse|inventory|logistic|supply|transport|fleet|stock|fulfil|route/i,
      why: "freight, warehousing, shipment visibility and supply-chain consulting." },
    { name: "Education & Training", keys: /train|learn|course|skill|upskill|teach|student|career|certif|education|onboard|workshop/i,
      why: "professional courses, corporate training, career readiness and certification." },
  ];
  function offlineFinder(q) {
    var scored = DIVISIONS.map(function (d) {
      var m = q.match(new RegExp(d.keys.source, "gi"));
      return { d: d, s: m ? m.length : 0 };
    }).sort(function (a, b) { return b.s - a.s; });
    var picks = scored.filter(function (x) { return x.s > 0; }).slice(0, 2);
    if (!picks.length) picks = [scored[0]];
    return "## Recommended for you\n" +
      picks.map(function (p) { return "- **" + p.d.name + "** — " + p.d.why; }).join("\n") +
      "\n## First steps\n- **Discover:** a short call to understand your goals and constraints.\n- **Design:** a tailored plan combining the right people, process and technology.\n- **Deliver:** a focused first phase with clear milestones.\n\nShare a few details on the Contact page and our team will map it out with you.";
  }
  function offlineChat(q) {
    if (/contact|email|phone|call|reach|address|office|talk/i.test(q))
      return "You can reach our team through the **Contact** page — share a few details and we'll get back to you. You can also follow our journey on Instagram at **@etrynity**.";
    if (/career|job|hiring|join|vacanc|role/i.test(q))
      return "We're always looking for curious, driven people who want to build something that lasts. Send us a note via the **Contact** page and select **Careers**.";
    if (/price|cost|quote|budget|how much|fee/i.test(q))
      return "Every engagement is tailored, so our team shares pricing after a short discovery call. Tell us about your needs on the **Contact** page and we'll prepare a proposal.";
    if (/\bai\b|artificial|machine learning|automat|gpt|llm|chatbot/i.test(q))
      return "AI runs through everything we do:\n- **IT & Technology:** data, AI and automation for your workflows.\n- **BPO:** AI-assisted support teams that respond faster.\n- **Logistics:** smarter routing and shipment visibility.\n- **Education:** programs that upskill teams for an AI-first world.";
    if (/meaning|logo|emblem|name|infinity|why etrynity|about|who are/i.test(q))
      return "**Etrynity** stands for endless possibilities, continuous growth and a future without limits. Our infinity emblem represents long-term vision, multiple industries, upward growth and the letter **E** for excellence.";
    for (var i = 0; i < DIVISIONS.length; i++) {
      if (DIVISIONS[i].keys.test(q)) return "That sounds like a fit for our **" + DIVISIONS[i].name + "** division — " + DIVISIONS[i].why + " Would you like to see how we'd approach it? Try the AI Solution Finder on the home page or reach us via **Contact**.";
    }
    return "Etrynity brings four disciplines under one roof:\n- **IT & Technology** — Build · Innovate · Transform\n- **BPO & Global Services** — People · Process · Performance\n- **Logistics & Supply Chain** — Move · Connect · Grow\n- **Education & Training** — Learn · Upskill · Build Future\n\nWhat are you working on? I can point you to the right team.";
  }
  function offlineDraft(d) {
    var interest = d.interests.length ? d.interests.join(" and ") : "your services";
    return "I'm reaching out" + (d.company ? " on behalf of " + d.company : "") + " because we're interested in Etrynity's " + interest +
      ". We're looking for a partner who can help us move faster and build something sustainable for the long term. " +
      (d.notes ? "A little context: " + d.notes + " " : "") +
      "Could we set up a short call to discuss our goals, timelines and how your team would approach the first phase? Thank you — looking forward to hearing from you.";
  }
  async function typeOut(text, onText) {
    var shown = "";
    var step = Math.max(2, Math.round(text.length / 120));
    for (var i = 0; i < text.length; i += step) {
      shown = text.slice(0, i + step);
      onText(shown);
      await sleep(16);
    }
    onText(text);
    return text;
  }

  /* ---------- Streaming call with offline fallback ---------- */
  async function stream(mode, messages, onText, fallback) {
    if (!offline) {
      try {
        var res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: mode, messages: messages }),
        });
        if (res.ok && res.body) {
          var reader = res.body.getReader(), dec = new TextDecoder(), text = "";
          for (;;) {
            var r = await reader.read();
            if (r.done) break;
            text += dec.decode(r.value, { stream: true });
            onText(text);
          }
          return text;
        }
        if (res.status === 503 || res.status === 404 || res.status === 405) offline = true;
      } catch (e) {
        offline = true;
      }
    }
    markDemo();
    return typeOut(fallback(), onText);
  }
  function markDemo() {
    document.querySelectorAll("[data-ai-note]").forEach(function (n) {
      n.textContent = "Demo mode: answers come from built-in company info. Add an ANTHROPIC_API_KEY on Vercel for live AI.";
    });
  }

  /* ---------- Chat widget ---------- */
  var history = [];
  var busy = false;
  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "eai-launch";
  launcher.setAttribute("aria-label", "Open Etrynity AI assistant");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = '<span class="eai-orb"><img src="' + EMBLEM + '" alt=""></span><span class="eai-label">ASK ETRYNITY AI</span>';

  var panel = document.createElement("section");
  panel.className = "eai-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Etrynity AI assistant");
  panel.innerHTML =
    '<div class="eai-head"><span class="eai-orb"><img src="' + EMBLEM + '" alt=""></span>' +
    '<div class="eai-title"><b>ETRYNITY AI</b><span><i class="fx-dot"></i>Online · Ask about our services</span></div>' +
    '<button type="button" class="eai-x" aria-label="Close assistant"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="eai-log" aria-live="polite"></div>' +
    '<div class="eai-suggest"></div>' +
    '<div class="eai-note" data-ai-note></div>' +
    '<form class="eai-form"><label for="eai-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Message Etrynity AI</label>' +
    '<textarea id="eai-input" rows="1" placeholder="Ask anything about Etrynity…" maxlength="1500"></textarea>' +
    '<button type="submit" aria-label="Send message"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>';
  document.body.appendChild(panel);
  document.body.appendChild(launcher);

  var log = panel.querySelector(".eai-log");
  var suggest = panel.querySelector(".eai-suggest");
  var input = panel.querySelector("textarea");
  var form = panel.querySelector("form");

  function addMsg(role, html) {
    var m = document.createElement("div");
    m.className = "eai-msg " + role;
    if (role === "user") m.textContent = html; else m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  addMsg("bot", format("Hello! I'm **Etrynity AI**. I can explain our services, suggest the right team for your challenge, or help you get in touch. How can I help?"));
  ["What does Etrynity do?", "How can AI help my business?", "Do you offer corporate training?", "How do I get in touch?"].forEach(function (q) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = q;
    b.addEventListener("click", function () { send(q); });
    suggest.appendChild(b);
  });

  function open(question) {
    panel.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    setTimeout(function () { input.focus(); }, 150);
    if (question) send(question);
  }
  function close() {
    panel.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }
  launcher.addEventListener("click", function () { panel.classList.contains("open") ? close() : open(); });
  panel.querySelector(".eai-x").addEventListener("click", close);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  async function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true;
    suggest.style.display = "none";
    addMsg("user", text);
    history.push({ role: "user", content: text });
    var bot = addMsg("bot", '<span class="eai-typing"><i></i><i></i><i></i></span>');
    var reply = await stream("chat", history, function (t) {
      bot.innerHTML = format(t);
      log.scrollTop = log.scrollHeight;
    }, function () { return offlineChat(text); });
    history.push({ role: "assistant", content: reply });
    busy = false;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = input.value;
    input.value = "";
    send(t);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  // Any element with data-ask="question" (or data-ai-open) opens the assistant.
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-ask], [data-ai-open]");
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute("data-ask") || "");
  });

  /* ---------- AI Solution Finder (home page) ---------- */
  var finder = document.querySelector("[data-finder]");
  if (finder) {
    var fIn = finder.querySelector("textarea");
    var fOut = finder.querySelector("[data-finder-output]");
    var fBtn = finder.querySelector("[data-finder-run]");
    finder.querySelectorAll("[data-example]").forEach(function (chip) {
      chip.addEventListener("click", function () { fIn.value = chip.getAttribute("data-example"); fIn.focus(); });
    });
    finder.addEventListener("submit", async function (e) {
      e.preventDefault();
      var q = fIn.value.trim();
      if (!q) { fIn.focus(); return; }
      fBtn.disabled = true;
      fOut.classList.add("fx-caret");
      fOut.innerHTML = '<span class="fx-placeholder">Analysing your challenge…</span>';
      await stream("finder", [{ role: "user", content: q }], function (t) { fOut.innerHTML = format(t); },
        function () { return offlineFinder(q); });
      fOut.classList.remove("fx-caret");
      fBtn.disabled = false;
    });
  }

  /* ---------- Draft with AI (contact page) ---------- */
  var draftBtn = document.querySelector("[data-ai-draft]");
  if (draftBtn) {
    draftBtn.addEventListener("click", async function () {
      var formEl = draftBtn.closest("form");
      var area = formEl.querySelector("textarea");
      var name = formEl.querySelector('input[type="text"]');
      var company = formEl.querySelectorAll('input[type="text"]')[1];
      var d = {
        interests: Array.prototype.map.call(formEl.querySelectorAll('.chip[aria-pressed="true"]'), function (c) { return c.textContent; }),
        name: name ? name.value.trim() : "",
        company: company ? company.value.trim() : "",
        notes: area.value.trim(),
      };
      var prompt = "Details for the enquiry:\nInterested in: " + (d.interests.join(", ") || "not specified") +
        "\nName: " + (d.name || "not given") + "\nCompany: " + (d.company || "not given") +
        "\nTheir notes (may be empty): " + (d.notes || "none");
      draftBtn.disabled = true;
      var label = draftBtn.querySelector("span");
      var old = label.textContent;
      label.textContent = "DRAFTING…";
      area.value = "";
      await stream("draft", [{ role: "user", content: prompt }], function (t) { area.value = t; },
        function () { return offlineDraft(d); });
      label.textContent = old;
      draftBtn.disabled = false;
    });
  }

  window.EtrynityAI = { open: open };
})();
