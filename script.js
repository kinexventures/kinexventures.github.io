// =====================
// Mobile Menu Toggle
// =====================
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector("header nav ul");

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

// =====================
// Scroll Reveal
// =====================
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// =====================
// Share Button
// =====================
const shareBtn = document.getElementById("shareBtn");
const messageBox = document.getElementById("message-box");

if (shareBtn && messageBox) {
  shareBtn.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kinex Ventures",
          text: "Check out Kinex Ventures – Building Tomorrow's Technology!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      showMessage("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  });
}

// =====================
// Contact Form Submission
// =====================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showMessage("✅ Message sent! We'll be in touch soon.");
    contactForm.reset();
  });
}

// =====================
// Show Message Popup
// =====================
function showMessage(text) {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}
