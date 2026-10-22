/* Etrynity — motion and futuristic effects. No dependencies. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Glass nav + scroll progress ---------- */
  var nav = document.querySelector("header");
  if (nav) nav.classList.add("fx-nav");
  var bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.setProperty("--p", max > 0 ? (h.scrollTop / max).toFixed(4) : 0);
    if (nav) nav.classList.toggle("fx-scrolled", h.scrollTop > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Cursor glow ---------- */
  if (finePointer && !reduce) {
    var glow = document.createElement("div");
    glow.className = "fx-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    var gx = 0, gy = 0, tx = 0, ty = 0, raf = 0;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("fx-on");
      if (!raf) raf = requestAnimationFrame(moveGlow);
    }, { passive: true });
    document.addEventListener("pointerleave", function () { glow.classList.remove("fx-on"); });
    function moveGlow() {
      gx += (tx - gx) * 0.18; gy += (ty - gy) * 0.18;
      glow.style.transform = "translate(" + gx + "px," + gy + "px)";
      raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(moveGlow) : 0;
    }
  }

  /* ---------- Headline word cascade (h1) ---------- */
  document.querySelectorAll("h1").forEach(function (h1) {
    var i = 0;
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var gold = node.parentElement !== h1 && /italic/.test(node.parentElement.getAttribute("style") || "");
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement("span");
        w.className = "fx-word";
        w.style.setProperty("--d", (0.15 + i++ * 0.08) + "s");
        if (gold) {
          var s = document.createElement("span");
          s.className = "fx-shimmer";
          s.textContent = part;
          w.appendChild(s);
        } else {
          w.textContent = part;
        }
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
  });

  /* ---------- Gold shimmer on the wordmark and dark-section emphasis ---------- */
  document.querySelectorAll('span[style*="Cinzel"][style*="#E2C792"], h2 span[style*="color: #E2C792"]').forEach(function (el) {
    el.classList.add("fx-shimmer");
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = [];
  document.querySelectorAll("section, footer").forEach(function (section) {
    if (section.querySelector("h1")) return; // hero has its own entrance
    var container = section.firstElementChild;
    while (container && (container.tagName === "IMG" || container.tagName === "CANVAS" || container.classList.contains("fx-grid-bg")))
      container = container.nextElementSibling;
    if (!container) return;
    Array.prototype.forEach.call(container.children, function (child) {
      var style = child.getAttribute("style") || "";
      var isGrid = /display:\s*grid/.test(style) || child.tagName === "OL" || child.tagName === "UL";
      var group = isGrid ? child.children : [child];
      Array.prototype.forEach.call(group, function (el, idx) {
        el.style.setProperty("--d", Math.min(idx * 0.09, 0.6) + "s");
        revealTargets.push(el);
      });
    });
  });
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("fx-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach(function (el) { el.classList.add("fx-reveal"); io.observe(el); });
  }

  /* ---------- Cards: spotlight + tilt ---------- */
  var cards = document.querySelectorAll('article, .fx-ai-card, [style*="display: grid"] > div[style*="padding: 3"]');
  cards.forEach(function (card) {
    card.classList.add("fx-card");
    if (!finePointer || reduce) return;
    var tilt = card.tagName === "ARTICLE" || card.classList.contains("fx-ai-card");
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      if (tilt) {
        var rx = ((y / r.height) - 0.5) * -6, ry = ((x / r.width) - 0.5) * 6;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      }
    });
    card.addEventListener("pointerleave", function () { card.style.transform = ""; });
  });

  /* ---------- Buttons: sheen + magnetic pull ---------- */
  document.querySelectorAll('a[style*="background: #C9A46A"], a[style*="background: #0A1424"], a[style*="background: #050D1A"], button[type="submit"], .fx-run').forEach(function (btn) {
    btn.classList.add("fx-btn");
    if (!finePointer || reduce) return;
    btn.addEventListener("pointermove", function (e) {
      var r = btn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = "translate(" + dx * 0.18 + "px," + dy * 0.28 + "px)";
    });
    btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
  });

  /* ---------- Floating emblems ---------- */
  document.querySelectorAll("[data-float]").forEach(function (el) { el.classList.add("fx-float"); });

  /* ---------- Rotating words ---------- */
  document.querySelectorAll(".fx-rotator").forEach(function (rot) {
    var items = rot.children, n = 0;
    if (!items.length) return;
    items[0].classList.add("on");
    if (reduce) return;
    setInterval(function () {
      items[n].classList.remove("on");
      n = (n + 1) % items.length;
      items[n].classList.add("on");
    }, 2600);
  });

  /* ---------- Neural network canvas ---------- */
  document.querySelectorAll("canvas[data-neural]").forEach(function (canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, pts = [], mouse = { x: -9999, y: -9999 }, running = false, visible = true;
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(95, Math.round((W * H) / 13000));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 });
      }
      if (reduce) draw();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LINK = 150;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!reduce) {
          var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 120 && md > 0) { p.x += (mdx / md) * 0.9; p.y += (mdy / md) * 0.9; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = "rgba(201,164,106," + (0.22 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ")";
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        var ml = Math.sqrt((p.x - mouse.x) * (p.x - mouse.x) + (p.y - mouse.y) * (p.y - mouse.y));
        if (ml < 200) {
          ctx.strokeStyle = "rgba(226,199,146," + (0.45 * (1 - ml / 200)).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = "rgba(226,199,146,0.85)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function loop() {
      if (!visible || document.hidden) { running = false; return; }
      draw();
      requestAnimationFrame(loop);
    }
    function start() { if (!running && !reduce) { running = true; requestAnimationFrame(loop); } }
    resize();
    window.addEventListener("resize", resize);
    var host = canvas.parentElement;
    host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    host.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(canvas);
    document.addEventListener("visibilitychange", start);
    start();
  });

  /* ---------- Soft page transitions ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === "_blank") return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(https?:|mailto:|tel:)/.test(href) || reduce) return;
    e.preventDefault();
    document.body.classList.add("fx-leaving");
    setTimeout(function () { window.location.href = a.href; }, 260);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("fx-leaving"); });
})();
