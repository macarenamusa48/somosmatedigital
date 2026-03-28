const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

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

const billingButtons = document.querySelectorAll(".billing-toggle");
const prices = document.querySelectorAll(".price");

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const billing = button.dataset.billing;

    billingButtons.forEach((item) => item.classList.toggle("active", item === button));

    prices.forEach((price) => {
      const nextValue = billing === "yearly" ? price.dataset.yearly : price.dataset.monthly;
      if (nextValue) price.textContent = nextValue;
    });
  });
});

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => revealObserver.observe(item));
