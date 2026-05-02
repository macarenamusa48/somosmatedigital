const body = document.body;
const header = document.querySelector(".site-header");
const navBar = document.querySelector("header nav");
const cursorGlow = document.querySelector(".cursor-glow");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const setMobileMenuState = (open) => {
  if (!navToggle || !navLinks) {
    return;
  }

  navToggle.setAttribute("aria-expanded", String(open));
  navLinks.classList.toggle("open", open);
  navLinks.classList.toggle("opacity-100", open);
  navLinks.classList.toggle("translate-y-0", open);
  navLinks.classList.toggle("pointer-events-auto", open);
  navLinks.classList.toggle("opacity-0", !open);
  navLinks.classList.toggle("-translate-y-2", !open);
  navLinks.classList.toggle("pointer-events-none", !open);
  body.classList.toggle("menu-open", open);
};

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setMobileMenuState(!expanded);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenuState(false);
    });
  });
}

const hero = document.querySelector(".hero");
const heroCanvas = document.querySelector(".hero-canvas");
if (hero) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    document.documentElement.style.setProperty("--pointer-x", `${x}%`);
    document.documentElement.style.setProperty("--pointer-y", `${Math.max(10, y)}%`);
  });
}

const initHeroCanvas = (canvas) => {
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = null;

  const resizeCanvas = () => {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawFrame = (time) => {
    const t = time * 0.00018;
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(5, 11, 20, 0.1)");
    gradient.addColorStop(0.5, "rgba(5, 18, 34, 0.36)");
    gradient.addColorStop(1, "rgba(4, 7, 13, 0.1)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const spacing = Math.max(34, Math.min(54, width / 22));
    const lineCount = Math.ceil(height / spacing) + 3;

    context.lineWidth = 1;
    context.strokeStyle = "rgba(0, 212, 255, 0.11)";
    context.shadowColor = "rgba(0, 212, 255, 0.08)";
    context.shadowBlur = 12;

    for (let index = -1; index < lineCount; index += 1) {
      const yBase = index * spacing;
      const drift = ((t * 80) + index * 9) % spacing;
      const amplitude = 9 + (index % 3) * 4;

      context.beginPath();
      for (let x = -spacing; x <= width + spacing; x += 18) {
        const y =
          yBase +
          drift +
          Math.sin(x * 0.012 + t * 7 + index * 0.42) * amplitude;

        if (x === -spacing) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
    }

    context.shadowBlur = 0;

    const verticalGradient = context.createLinearGradient(0, 0, width, 0);
    verticalGradient.addColorStop(0, "rgba(0, 212, 255, 0)");
    verticalGradient.addColorStop(0.5, "rgba(0, 212, 255, 0.12)");
    verticalGradient.addColorStop(1, "rgba(88, 83, 255, 0)");

    context.strokeStyle = verticalGradient;
    context.lineWidth = 1;

    const verticalCount = Math.min(10, Math.max(6, Math.floor(width / 180)));
    for (let i = 0; i < verticalCount; i += 1) {
      const progress = i / Math.max(1, verticalCount - 1);
      const x =
        progress * width +
        Math.sin(t * 4 + i * 0.9) * 12;

      context.beginPath();
      context.moveTo(x, height * 0.08);
      context.lineTo(x, height * 0.92);
      context.stroke();
    }

    const glowX = width * (0.5 + Math.sin(t * 2.2) * 0.1);
    const glowY = height * (0.32 + Math.cos(t * 1.8) * 0.06);
    const radial = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.24);
    radial.addColorStop(0, "rgba(0, 212, 255, 0.12)");
    radial.addColorStop(0.45, "rgba(70, 88, 255, 0.06)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = radial;
    context.fillRect(0, 0, width, height);

    rafId = window.requestAnimationFrame(drawFrame);
  };

  resizeCanvas();

  if (!reducedMotion) {
    rafId = window.requestAnimationFrame(drawFrame);
  } else {
    drawFrame(0);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
};

const heroCodeLoop = document.querySelector(".hero-code[data-code-loop]");
const codeTypingBlocks = document.querySelectorAll(".code-typing");

const typeCodeBlock = (block) => {
  if (!block || block.dataset.typed === "true") {
    return;
  }

  const code = block.querySelector("code");
  if (!code) {
    return;
  }

  let lines = [];

  try {
    lines = JSON.parse(block.dataset.codeLines || "[]");
  } catch {
    lines = [];
  }

  if (!lines.length) {
    return;
  }

  block.dataset.typed = "true";
  code.textContent = "";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    code.textContent = lines.join("\n");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;

  const typeNextCharacter = () => {
    const currentLine = lines[lineIndex];

    if (currentLine === undefined) {
      return;
    }

    code.textContent = lines
      .slice(0, lineIndex)
      .join("\n")
      .concat(lineIndex > 0 ? "\n" : "", currentLine.slice(0, charIndex));

    if (charIndex < currentLine.length) {
      charIndex += 1;
      window.setTimeout(typeNextCharacter, 22);
      return;
    }

    if (lineIndex < lines.length - 1) {
      lineIndex += 1;
      charIndex = 0;
      code.textContent += "\n";
      window.setTimeout(typeNextCharacter, currentLine === "" ? 70 : 180);
    }
  };

  typeNextCharacter();
};

const runHeroCodeLoop = (block) => {
  if (!block) {
    return;
  }

  const code = block.querySelector("code");
  if (!code) {
    return;
  }

  let lines = [];

  try {
    lines = JSON.parse(block.dataset.codeLoop || "[]");
  } catch {
    lines = [];
  }

  if (!lines.length) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    code.textContent = lines.join("\n");
    return;
  }

  const typeSequence = () => {
    block.classList.remove("is-fading");
    code.textContent = "";

    let lineIndex = 0;
    let charIndex = 0;

    const typeNextCharacter = () => {
      const currentLine = lines[lineIndex];

      if (currentLine === undefined) {
        window.setTimeout(() => {
          block.classList.add("is-fading");
          window.setTimeout(typeSequence, 520);
        }, 1100);
        return;
      }

      code.textContent = lines
        .slice(0, lineIndex)
        .join("\n")
        .concat(lineIndex > 0 ? "\n" : "", currentLine.slice(0, charIndex));

      if (charIndex < currentLine.length) {
        charIndex += 1;
        window.setTimeout(typeNextCharacter, 24);
        return;
      }

      lineIndex += 1;
      charIndex = 0;
      code.textContent += "\n";
      window.setTimeout(typeNextCharacter, currentLine === "" ? 90 : 160);
    };

    typeNextCharacter();
  };

  typeSequence();
};

const interactiveCards = document.querySelectorAll(
  ".hero-stage-panel, .benefit-card, .service-card, .feature-card, .story-card, .testimonial-card, .team-card, .comparison-card, .cta-card, .authority-profile, .process-panel, .faq-list details"
);

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const rotateY = ((x - 50) / 50) * 3.5;
    const rotateX = ((50 - y) / 50) * 3.5;

    card.style.setProperty("--glow-x", `${x}%`);
    card.style.setProperty("--glow-y", `${y}%`);
    card.style.transform = `translateY(-10px) scale(1.01) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("transform");
  });
});

const processTabs = document.querySelectorAll(".process-tab");
const processPanels = document.querySelectorAll(".process-step");

processTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const step = tab.dataset.step;

    processTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    processPanels.forEach((panel) => {
      const active = panel.dataset.stepPanel === step;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  });
});

const reveals = document.querySelectorAll(".reveal");

reveals.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${(index % 6) * 55}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("code-typing")) {
          typeCodeBlock(entry.target);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

reveals.forEach((item) => revealObserver.observe(item));
codeTypingBlocks.forEach((block) => revealObserver.observe(block));
runHeroCodeLoop(heroCodeLoop);
initHeroCanvas(heroCanvas);

const sectionIds = ["servicios", "proceso", "faq", "contacto"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActiveLink = () => {
  const scrollPoint = window.scrollY + window.innerHeight * 0.24;

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  if (navBar) {
    navBar.classList.toggle("border-mate-lineStrong", window.scrollY > 16);
    navBar.classList.toggle("shadow-[0_26px_80px_rgba(0,0,0,0.38)]", window.scrollY > 16);
  }

  let currentId = "";

  sections.forEach((section) => {
    if (scrollPoint >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((link) => {
    const isActive = currentId && link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });

let pointerFrame = null;
let pointerTargetX = 50;
let pointerTargetY = 22;
let pointerCurrentX = 50;
let pointerCurrentY = 22;

const animatePointerGlow = () => {
  pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.12;
  pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.12;

  if (cursorGlow) {
    cursorGlow.style.left = `${pointerCurrentX}%`;
    cursorGlow.style.top = `${pointerCurrentY}%`;
  }

  if (Math.abs(pointerTargetX - pointerCurrentX) > 0.02 || Math.abs(pointerTargetY - pointerCurrentY) > 0.02) {
    pointerFrame = window.requestAnimationFrame(animatePointerGlow);
  } else {
    pointerFrame = null;
  }
};

window.addEventListener(
  "pointermove",
  (event) => {
    pointerTargetX = (event.clientX / window.innerWidth) * 100;
    pointerTargetY = (event.clientY / window.innerHeight) * 100;

    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(animatePointerGlow);
    }
  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth >= 768) {
      setMobileMenuState(false);
    }
  },
  { passive: true }
);
