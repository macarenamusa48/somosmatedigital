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
if (hero) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    document.documentElement.style.setProperty("--pointer-x", `${x}%`);
    document.documentElement.style.setProperty("--pointer-y", `${Math.max(10, y)}%`);
  });
}

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
