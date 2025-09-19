// ================================
// Kinex Ventures - Main Script
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    
  alert("Thank you for your message! We'll be in touch soon.");

    // TODO: Replace this with actual form handling
    // - Use Formspree, Netlify Forms, or backend API
    // - Example (with Formspree):
    // fetch("https://formspree.io/f/{form_id}", {
    //   method: "POST",
    //   body: new FormData(contactForm),
    // }).then(response => {
    //   if (response.ok) alert("Message sent!");
    // });
    
    contactForm.reset();
  });
}
