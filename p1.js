// Smooth scrolling for navigation links (except Contact Me buttons)
document
  .querySelectorAll('a[href^="#"]:not(.contact-trigger)')
  .forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

// Mobile menu toggle
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
  });
});

// Contact Modal Functionality
const contactModal = document.getElementById("contact-modal");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const closeModal = document.querySelector(".close-modal");
const modalOverlay = document.querySelector(".modal-overlay");

// Open modal when Contact Me is clicked
contactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    contactModal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  });
});

// Close modal when X is clicked
if (closeModal) {
  closeModal.addEventListener("click", () => {
    contactModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
}

// Close modal when clicking outside
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      contactModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && contactModal.style.display === "flex") {
    contactModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Form submission to Google Sheets
const form = document.querySelector("#contact-form");

// IMPORTANT: Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7rzXT4FeNYTAiEsluzkFvR2FeQHSIQrLc50zQaTtjxJfAj3FCCrpnDg0qTcAL6ajzBg/exec";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const phone = form.querySelector('input[name="phone"]').value;
    const subject = form.querySelector('input[name="subject"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    // Prepare data object
    const data = {
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message,
      timestamp: new Date().toLocaleString(),
    };

    try {
      // Show loading state
      const submitBtn = form.querySelector('input[type="submit"]');
      const originalValue = submitBtn.value;
      submitBtn.value = "Sending...";
      submitBtn.disabled = true;

      // Send to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Success message
      submitBtn.value = "Message Sent!";
      submitBtn.style.backgroundColor = "#4ade80";

      // Reset form
      form.reset();

      // Close modal and reset button after 2 seconds
      setTimeout(() => {
        contactModal.style.display = "none";
        document.body.style.overflow = "auto";
        submitBtn.value = originalValue;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "";
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      const submitBtn = form.querySelector('input[type="submit"]');
      submitBtn.value = "Error! Try Again";
      submitBtn.style.backgroundColor = "#ef4444";

      setTimeout(() => {
        submitBtn.value = "Send Message";
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "";
      }, 3000);
    }
  });
}

// Add active state to navigation on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar a:not(.contact-trigger)");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

