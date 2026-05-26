const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const validators = {
  name(value) {
    if (!value.trim()) return "Please enter your name.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Please enter your email address.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
    return "";
  },
  message(value) {
    if (!value.trim()) return "Please enter a message.";
    if (value.trim().length < 10) return "Message must be at least 10 characters.";
    return "";
  }
};

function setFieldError(fieldName, message) {
  const errorElement = document.querySelector(`#${fieldName}-error`);
  const inputElement = document.querySelector(`#${fieldName}`);

  if (errorElement) errorElement.textContent = message;
  if (inputElement) {
    if (message) {
      inputElement.setAttribute("aria-invalid", "true");
    } else {
      inputElement.removeAttribute("aria-invalid");
    }
  }
}

function validateForm(formData) {
  let isValid = true;

  Object.entries(validators).forEach(([fieldName, validator]) => {
    const value = formData.get(fieldName) || "";
    const message = validator(String(value));
    setFieldError(fieldName, message);

    if (message) isValid = false;
  });

  return isValid;
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const isValid = validateForm(formData);

    if (!isValid) {
      formStatus.textContent = "Please correct the highlighted fields and try again.";
      return;
    }

    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    formStatus.textContent = "Your message is ready to send in your email app.";
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    form.reset();
  });

  Object.keys(validators).forEach((fieldName) => {
    const field = document.querySelector(`#${fieldName}`);
    if (!field) return;

    field.addEventListener("blur", () => {
      const validator = validators[fieldName];
      const message = validator(field.value);
      setFieldError(fieldName, message);
    });
  });
}
