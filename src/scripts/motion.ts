// Navigation behaviour and motion effects. Everything degrades to static content
// without JavaScript and respects prefers-reduced-motion.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Header: scroll state + progress ---------- */
const header = document.querySelector<HTMLElement>("[data-header]");
const bar = document.createElement("div");
bar.className = "scroll-progress";
bar.setAttribute("aria-hidden", "true");
document.body.appendChild(bar);
function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  bar.style.setProperty("--p", max > 0 ? (doc.scrollTop / max).toFixed(4) : "0");
  header?.classList.toggle("is-scrolled", doc.scrollTop > 16);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const nav = document.querySelector<HTMLElement>("[data-nav]");
const toggleLabel = document.querySelector<HTMLElement>("[data-menu-label]");
function setMenu(open: boolean) {
  if (!toggle || !nav) return;
  toggle.setAttribute("aria-expanded", String(open));
  if (toggleLabel) toggleLabel.textContent = open ? "Close menu" : "Open menu";
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}
toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (toggle?.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
  closeDropdowns();
});
window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

/* ---------- Services dropdown (click/keyboard; hover handled in CSS) ---------- */
const dropdowns = document.querySelectorAll<HTMLElement>("[data-dropdown]");
function closeDropdowns(except?: HTMLElement) {
  dropdowns.forEach((d) => {
    if (d === except) return;
    d.classList.remove("is-open");
    d.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
  });
}
dropdowns.forEach((d) => {
  const btn = d.querySelector<HTMLButtonElement>("[data-dropdown-toggle]");
  btn?.addEventListener("click", () => {
    const open = !d.classList.contains("is-open");
    closeDropdowns(d);
    d.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
  d.addEventListener("focusout", (e) => {
    if (!d.contains(e.relatedTarget as Node)) closeDropdowns();
  });
});
document.addEventListener("click", (e) => {
  if (!(e.target as HTMLElement).closest("[data-dropdown]")) closeDropdowns();
});

/* ---------- Headline word cascade ---------- */
document.querySelectorAll<HTMLElement>("[data-cascade]").forEach((el) => {
  if (reduce) { el.classList.add("is-split"); return; }
  let i = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    const emphasised = !!node.parentElement?.closest("em");
    (node.textContent ?? "").split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      const w = document.createElement("span");
      w.className = "word";
      w.style.setProperty("--d", `${0.08 + i++ * 0.07}s`);
      if (emphasised) {
        // Shimmer must sit on an inner span: background-clip text can't paint inline-block children.
        const s = document.createElement("span");
        s.className = "shimmer";
        s.textContent = part;
        w.appendChild(s);
      } else {
        w.textContent = part;
      }
      frag.appendChild(w);
    });
    node.parentNode?.replaceChild(frag, node);
  });
  el.classList.add("is-split");
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group] > *");
document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
  Array.from(group.children).forEach((child, idx) => (child as HTMLElement).style.setProperty("--d", `${Math.min(idx * 0.08, 0.48)}s`));
});
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
  );
  revealEls.forEach((el) => {
    // Content already on screen at load is shown immediately (no flash, no LCP delay).
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return;
    el.classList.add("reveal");
    io.observe(el);
  });
}

/* ---------- Card spotlight ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll<HTMLElement>(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Gold shimmer on dark-section emphasis ---------- */
document.querySelectorAll<HTMLElement>(".display em, .section:not(.section--ivory) .title em").forEach((el) => {
  if (!el.querySelector(".word")) el.classList.add("shimmer");
});

/* ---------- Rotating phrases ---------- */
document.querySelectorAll<HTMLElement>("[data-rotator]").forEach((rot) => {
  const items = Array.from(rot.children) as HTMLElement[];
  if (!items.length) return;
  let n = 0;
  items[0].classList.add("is-on");
  if (reduce) return;
  setInterval(() => {
    items[n].classList.remove("is-on");
    n = (n + 1) % items.length;
    items[n].classList.add("is-on");
  }, 2800);
});

/* ---------- Neural network canvas ---------- */
document.querySelectorAll<HTMLCanvasElement>("canvas[data-neural]").forEach((canvas) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, running = false, visible = true;
  const mouse = { x: -9999, y: -9999 };
  let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(80, Math.round((W * H) / 16000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.6,
    }));
    if (reduce) draw();
  }
  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, W, H);
    const LINK = 140;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!reduce) {
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.hypot(mdx, mdy);
        if (md < 110 && md > 0) { p.x += (mdx / md) * 0.8; p.y += (mdy / md) * 0.8; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          c.strokeStyle = `rgba(201,164,106,${(0.2 * (1 - d / LINK)).toFixed(3)})`;
          c.lineWidth = 0.7;
          c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
        }
      }
      const ml = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (ml < 180) {
        c.strokeStyle = `rgba(226,199,146,${(0.4 * (1 - ml / 180)).toFixed(3)})`;
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(mouse.x, mouse.y); c.stroke();
      }
      c.fillStyle = "rgba(226,199,146,0.8)";
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill();
    }
  }
  function loop() {
    if (!visible || document.hidden) { running = false; return; }
    draw();
    requestAnimationFrame(loop);
  }
  function start() {
    if (!running && !reduce && visible && !document.hidden) { running = true; requestAnimationFrame(loop); }
  }
  resize();
  let resizeTimer = 0;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(resize, 150); });
  const host = canvas.parentElement!;
  host.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  host.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; start(); }).observe(canvas);
  document.addEventListener("visibilitychange", start);
  start();
});
