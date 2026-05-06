const greetingForm = document.querySelector("#greetingForm");
const nameInput = document.querySelector("#name");
const greetingSelect = document.querySelector("#greeting");
const greetingMessage = document.querySelector("#greetingMessage");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const revealItems = document.querySelectorAll(".reveal");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const backToTopButton = document.querySelector("[data-back-to-top]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const copyMessage = document.querySelector("[data-copy-message]");
const messageForm = document.querySelector("#messageForm");
const visitorNameInput = document.querySelector("#visitorName");
const visitorEmailInput = document.querySelector("#visitorEmail");
const messageTypeSelect = document.querySelector("#messageType");
const messageBodyInput = document.querySelector("#messageBody");
const messageStatus = document.querySelector("#messageStatus");
const messageSubjectInput = document.querySelector("#messageSubject");
const messageReplyToInput = document.querySelector("#messageReplyTo");
const messageFrame = document.querySelector("iframe[name='messageFrame']");
const currentYear = document.querySelector("[data-current-year]");
const contactEmail = copyEmailButton.dataset.copyEmail;
const contactEndpoint = `https://formsubmit.co/ajax/${contactEmail}`;
let frameSubmissionPending = false;
let frameSubmissionTimer;

function buildGreeting(greeting, name) {
  if (greeting.startsWith("What's")) {
    return `${greeting}, ${name}?`;
  }

  return `${greeting}, ${name}!`;
}

function showMessage(message, isError = false) {
  greetingMessage.textContent = message;
  greetingMessage.classList.toggle("is-error", isError);
}

function setProjectFilter(filter) {
  projectCards.forEach((card) => {
    const shouldShow = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  themeToggleIcon.textContent = theme === "light" ? "R" : "D";
}

function showCopyMessage(message) {
  copyMessage.textContent = message;

  window.setTimeout(() => {
    copyMessage.textContent = "";
  }, 2200);
}

function showMessageStatus(message, isError = false) {
  messageStatus.textContent = message;
  messageStatus.classList.toggle("is-error", isError);
}

function setMessageSending(isSending) {
  const submitButton = messageForm.querySelector("button[type='submit']");
  submitButton.disabled = isSending;
  submitButton.textContent = isSending ? "Sending..." : "Send message";
}

function prepareMessageMetadata(name, email, messageType) {
  messageSubjectInput.value = `Portfolio ${messageType} from ${name}`;
  messageReplyToInput.value = email;
}

async function sendContactMessage(name, email, messageType, message) {
  const payload = new URLSearchParams({
    name,
    email,
    _replyto: email,
    _subject: `Portfolio ${messageType} from ${name}`,
    _template: "table",
    _captcha: "false",
    messageType,
    message,
  });

  const response = await fetch(contactEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: payload.toString(),
  });

  const data = await response.json();

  if (!response.ok || data.success === false || data.success === "false") {
    throw new Error(data.message || "The message could not be sent.");
  }

  return data;
}

function sendContactMessageWithFrame(name, email, messageType) {
  prepareMessageMetadata(name, email, messageType);
  frameSubmissionPending = true;
  messageForm.submit();

  window.clearTimeout(frameSubmissionTimer);
  frameSubmissionTimer = window.setTimeout(() => {
    if (!frameSubmissionPending) {
      return;
    }

    frameSubmissionPending = false;
    messageForm.reset();
    setMessageSending(false);
    showMessageStatus("Message submitted. Check your inbox if FormSubmit asks for confirmation.");
  }, 5000);
}

greetingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const greeting = greetingSelect.value;

  if (name === "") {
    showMessage("Please enter your full name first.", true);
    nameInput.focus();
    return;
  }

  showMessage(buildGreeting(greeting, name));
  greetingForm.reset();
  nameInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((currentButton) => {
      currentButton.classList.remove("is-active");
    });

    button.classList.add("is-active");
    setProjectFilter(button.dataset.filter);
  });
});

if ("IntersectionObserver" in window) {
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

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

themeToggle.addEventListener("click", () => {
  const activeTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  setTheme(activeTheme);
});

window.addEventListener("scroll", () => {
  const shouldShowBackToTop = window.scrollY > 420;
  backToTopButton.classList.toggle("is-visible", shouldShowBackToTop);
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

copyEmailButton.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.copyEmail;

  try {
    await navigator.clipboard.writeText(email);
    showCopyMessage("Email copied.");
  } catch (error) {
    showCopyMessage(email);
  }
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!messageForm.reportValidity()) {
    return;
  }

  const name = visitorNameInput.value.trim();
  const email = visitorEmailInput.value.trim();
  const messageType = messageTypeSelect.value;
  const message = messageBodyInput.value.trim();

  if (message === "") {
    showMessageStatus("Please write your message first.", true);
    messageBodyInput.focus();
    return;
  }

  setMessageSending(true);
  showMessageStatus("Sending your message...");

  try {
    await sendContactMessage(name, email, messageType, message);
    messageForm.reset();
    showMessageStatus("Message sent. Thank you.");
  } catch (error) {
    showMessageStatus("Sending with backup method. Please stay on this page.");
    sendContactMessageWithFrame(name, email, messageType);
    return;
  }

  setMessageSending(false);
});

messageFrame.addEventListener("load", () => {
  if (!frameSubmissionPending) {
    return;
  }

  window.clearTimeout(frameSubmissionTimer);
  frameSubmissionPending = false;
  messageForm.reset();
  setMessageSending(false);
  showMessageStatus("Message submitted. Check your inbox if FormSubmit asks for confirmation.");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-links a").forEach((currentLink) => {
      currentLink.classList.remove("is-active");
    });

    link.classList.add("is-active");
  });
});

currentYear.textContent = new Date().getFullYear();
setTheme(localStorage.getItem("portfolio-theme") || "dark");
