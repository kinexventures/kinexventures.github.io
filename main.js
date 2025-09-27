// assets/main.js
document.addEventListener("DOMContentLoaded", () => {
  // ========================
  // MOBILE NAV TOGGLE
  // ========================
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // ========================
  // SMOOTH SCROLL FOR ANCHORS
  // ========================
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ========================
  // FADE-IN ON SCROLL
  // ========================
  const faders = document.querySelectorAll(".venture-card, .step, section");

  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    fader.classList.add("fade-init");
    appearOnScroll.observe(fader);
  });
});
