const root = document.documentElement;
const still = matchMedia("(prefers-reduced-motion: reduce), (max-width: 47.99em)").matches;

requestAnimationFrame(() => root.classList.add("ready"));

document.querySelectorAll(".stage").forEach((stage) => {
  stage.querySelectorAll("figure").forEach((figure, i) => figure.style.setProperty("--o", (i * 0.1).toFixed(2)));
});

const navLinks = [...document.querySelectorAll(".site-header nav a")];

const themed = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const section = entry.target;
      root.dataset.header = section.dataset.theme || "light";
      const id = section.classList.contains("work") ? "interfaces" : section.id;
      for (const a of navLinks) {
        if (a.hash === `#${id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
    }
  },
  { rootMargin: "-3% 0px -96% 0px" }
);

document.querySelectorAll("main > section").forEach((section) => themed.observe(section));

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const wide = matchMedia("(min-width: 48em)");

// Wrap every word in a span (--i), keeping links and inline tags intact.
const splitWords = (root) => {
  let i = 0;
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName !== "svg") walk(child);
        continue;
      }
      if (child.nodeType !== Node.TEXT_NODE || !child.data.trim()) continue;
      const parts = child.data.split(/(\s+)/);
      child.replaceWith(...parts.filter(Boolean).map((part) => {
        if (/^\s+$/.test(part)) return part;
        const span = document.createElement("span");
        span.textContent = part;
        span.style.setProperty("--i", i++);
        return span;
      }));
    }
  };
  walk(root);
  root.style.setProperty("--n", i);
};

document.querySelectorAll(".words, .split").forEach(splitWords);

const pins = [...document.querySelectorAll("[data-pin]")];

const sizePins = () => {
  for (const pin of pins) {
    if (!("hscroll" in pin.dataset)) continue;
    const track = pin.querySelector(".track");
    pin.distance = wide.matches && !reduced.matches ? Math.max(0, track.scrollWidth - innerWidth) : 0;
    pin.style.height = pin.distance ? `${pin.distance + innerHeight}px` : "";
    if (!pin.distance) track.style.transform = "";
  }
};

const scrub = () => {
  for (const pin of pins) {
    const box = pin.getBoundingClientRect();
    if (box.top > innerHeight || box.bottom < 0) continue;
    const run = box.height - innerHeight;
    const p = run > 0 ? Math.min(1, Math.max(0, -box.top / run)) : 0;
    pin.style.setProperty("--p", p.toFixed(4));
    if (pin.distance) pin.querySelector(".track").style.transform = `translate3d(${(-p * pin.distance).toFixed(1)}px, 0, 0)`;
  }
};

const layers = new Set();

const drift = () => {
  const mid = innerHeight / 2;
  for (const el of layers) {
    const box = el.getBoundingClientRect();
    const y = (box.top - (el.py || 0) + box.height / 2 - mid) * el.dataset.speed;
    el.py = y;
    el.style.setProperty("--py", `${y.toFixed(1)}px`);
  }
};

if (!still) {
  const watch = new IntersectionObserver((entries) => {
    for (const entry of entries) layers[entry.isIntersecting ? "add" : "delete"](entry.target);
  });
  document.querySelectorAll("[data-speed]").forEach((el) => watch.observe(el));
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const layoutTop = (el) => (el.offsetParent ? el.offsetParent.getBoundingClientRect().top + el.offsetTop : el.getBoundingClientRect().top);

const live = new Set();
const seen = new IntersectionObserver((entries) => {
  for (const entry of entries) live[entry.isIntersecting ? "add" : "delete"](entry.target);
  request();
}, { rootMargin: "15% 0px 15% 0px" });

document
  .querySelectorAll(":is(#interfaces, #direction-artistique) .project, .split, :is(#interfaces, #direction-artistique) .stage figure, [data-reveal], .timeline li, .facts h3, .facts dt, .facts dd, .tools, .track .poster, .set-card, main > section:not([data-pin])")
  .forEach((el) => seen.observe(el));

const follow = () => {
  for (const el of live) {
    if (el.matches(":is(#interfaces, #direction-artistique) .project")) {
      const top = layoutTop(el);
      el.style.setProperty("--pp", clamp01((innerHeight - top) / (innerHeight + el.offsetHeight)).toFixed(4));
    } else if (el.classList.contains("split")) {
      const top = layoutTop(el);
      el.style.setProperty("--w", clamp01((innerHeight * 0.92 - top) / (innerHeight * 0.4 + el.offsetHeight)).toFixed(3));
    } else if (el.matches(":is(#interfaces, #direction-artistique) .stage figure")) {
      el.style.setProperty("--e", clamp01((innerHeight * 0.98 - layoutTop(el)) / (innerHeight * 0.6)).toFixed(3));
    } else if (el.closest(".track")) {
      const box = el.getBoundingClientRect();
      el.style.setProperty("--e", clamp01((innerWidth - box.left - box.width / 2) / (innerWidth * 0.5)).toFixed(3));
    } else if (el.parentElement.tagName === "MAIN") {
      el.style.setProperty("--se", clamp01((innerHeight - layoutTop(el)) / (innerHeight * 0.8)).toFixed(3));
    } else {
      el.style.setProperty("--e", clamp01((innerHeight - layoutTop(el)) / (innerHeight * 0.65)).toFixed(3));
    }
  }
};

let ticking = false;
const frame = () => {
  root.style.setProperty("--progress", (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
  if (!reduced.matches) {
    scrub();
    follow();
  }
  if (!still) drift();
  ticking = false;
};
const request = () => {
  if (!ticking) requestAnimationFrame(frame);
  ticking = true;
};

addEventListener("scroll", request, { passive: true });
document.querySelector(".hscroll .pin-stage")?.addEventListener("scroll", request, { passive: true });
addEventListener("resize", () => {
  sizePins();
  request();
});
sizePins();
frame();

const viewer = document.querySelector(".viewer");
const full = viewer.querySelector("img");

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-zoom]");
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;

  event.preventDefault();
  const thumb = link.querySelector("img");
  full.width = thumb.getAttribute("width");
  full.height = thumb.getAttribute("height");
  full.alt = thumb.alt;
  full.src = thumb.currentSrc || thumb.src;
  full.dataset.hd = link.href;
  viewer.showModal();

  const hd = new Image();
  hd.src = link.href;
  hd.decode().then(() => {
    if (viewer.open && full.dataset.hd === link.href) full.src = hd.src;
  }, () => {});
});

viewer.addEventListener("click", (event) => {
  if (event.target === viewer || event.target === full) viewer.close();
});

viewer.addEventListener("close", () => {
  if (!viewer.open) full.removeAttribute("src");
});
