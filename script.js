const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
    body.classList.toggle("menu-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
      body.classList.remove("menu-open");
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

const interactiveCards = document.querySelectorAll(
  ".hero-card, .benefit-card, .service-card, .feature-card, .story-card, .testimonial-card, .team-card, .comparison-card, .cta-card, .authority-profile, .process-panel, .faq-list details"
);

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    card.style.setProperty("--glow-x", `${x}%`);
    card.style.setProperty("--glow-y", `${y}%`);
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

const sectionIds = ["servicios", "proceso", "faq", "contacto"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActiveLink = () => {
  const scrollPoint = window.scrollY + window.innerHeight * 0.24;

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
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

window.addEventListener(
  "pointermove",
  (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    document.documentElement.style.setProperty("--pointer-x", `${x}%`);
    document.documentElement.style.setProperty("--pointer-y", `${y}%`);
  },
  { passive: true }
);
