const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const projectDetailsButtons = document.querySelectorAll(".project-details-toggle");
const faqButtons = document.querySelectorAll(".faq-question");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const pageSections = document.querySelectorAll("main section[id]");
const siteHeader = document.querySelector(".site-header");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const backToTopButton = document.querySelector("[data-back-to-top]");
const currentYear = document.querySelector("[data-current-year]");
const heroIntro = document.querySelector(".hero h1");
const heroCopy = document.querySelector(".hero-copy");
const contactForm = document.querySelector(".message-form");
const messageBody = document.querySelector("#messageBody");
const messageCount = document.querySelector("[data-message-count]");
const formStatus = document.querySelector("[data-form-status]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const questPanel = document.querySelector(".quest-panel");
const questButton = document.querySelector("[data-quest-button]");
const questText = document.querySelector("[data-quest-text]");
let themeAnimationTimer;

const buildQuests = [
  "Polish one button state until it feels ready to ship.",
  "Make one mobile screen feel calmer and easier to scan.",
  "Rename one class so future-you understands it instantly.",
  "Turn one rough idea into a tiny project card.",
  "Add one helpful empty state to a form or section.",
  "Pick a color pairing, test it in light mode, then tune it.",
  "Give one interaction a smoother focus or hover state.",
  "Write a commit message that tells the story clearly."
];

function setProjectFilter(filter) {
  projectCards.forEach((card) => {
    const shouldShow = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function setActiveNavLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
  });
}

function updateNavAnchorOffset() {
  if (siteHeader === null) {
    return;
  }

  const offset = Math.ceil(siteHeader.getBoundingClientRect().height + 18);
  document.documentElement.style.setProperty("--nav-anchor-offset", `${offset}px`);
}

function playThemeSwitchAnimation() {
  document.documentElement.classList.remove("is-theme-switching");
  window.clearTimeout(themeAnimationTimer);

  window.requestAnimationFrame(() => {
    document.documentElement.classList.add("is-theme-switching");

    themeAnimationTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("is-theme-switching");
    }, 780);
  });
}

function setTheme(theme, shouldAnimate = false) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  themeToggleIcon.textContent = theme === "dark" ? "D" : "L";
  themeToggle.setAttribute("aria-label", `${theme === "dark" ? "Dark" : "Light"} theme active`);

  if (shouldAnimate) {
    playThemeSwitchAnimation();
  }
}

function updateMessageCount() {
  if (messageBody === null || messageCount === null) {
    return;
  }

  const characterCount = messageBody.value.trim().length;
  messageCount.textContent = `${characterCount} character${characterCount === 1 ? "" : "s"}`;
}

function showFormStatus(message) {
  if (formStatus === null) {
    return;
  }

  formStatus.textContent = message;
}

function positionHeroIntro() {
  if (heroIntro === null || heroCopy === null) {
    return;
  }

  const introRect = heroIntro.getBoundingClientRect();
  const introCenterX = introRect.left + introRect.width / 2;
  const introCenterY = introRect.top + introRect.height / 2;
  const introX = Math.round(window.innerWidth / 2 - introCenterX);
  const introY = Math.round(window.innerHeight / 2 - introCenterY);

  document.documentElement.style.setProperty("--intro-x", `${introX}px`);
  document.documentElement.style.setProperty("--intro-y", `${introY}px`);
  document.documentElement.classList.add("is-intro-positioned");
}

function revealPageAfterIntro() {
  const root = document.documentElement;

  root.classList.add("is-intro-releasing");
  root.classList.remove("is-intro-typing");
  root.classList.add("has-intro-typed");

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.remove("is-intro-releasing");

      window.setTimeout(() => {
        root.classList.remove("is-intro-positioned");
      }, 900);
    });
  });
}

function typeHeroIntro() {
  if (heroIntro === null) {
    revealPageAfterIntro();
    return;
  }

  const introText = heroIntro.textContent.trim();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroRevealContainer = heroIntro.closest(".reveal");

  heroIntro.setAttribute("aria-label", introText);

  if (prefersReducedMotion) {
    heroRevealContainer?.classList.add("is-visible");
    heroIntro.textContent = introText;
    document.documentElement.classList.remove("is-intro-typing");
    document.documentElement.classList.add("has-intro-typed");
    return;
  }

  positionHeroIntro();
  heroRevealContainer?.classList.add("is-visible");
  heroIntro.textContent = "";
  heroIntro.classList.add("typewriter");

  let characterIndex = 0;

  function typeNextCharacter() {
    characterIndex += 1;
    heroIntro.textContent = introText.slice(0, characterIndex);

    if (characterIndex < introText.length) {
      window.setTimeout(typeNextCharacter, 48);
      return;
    }

    heroIntro.classList.add("has-typed");
    window.setTimeout(revealPageAfterIntro, 260);
  }

  window.setTimeout(typeNextCharacter, 360);
}

function setRandomQuest() {
  if (questText === null) {
    return;
  }

  let nextQuest = questText.textContent;

  while (nextQuest === questText.textContent && buildQuests.length > 1) {
    const questIndex = Math.floor(Math.random() * buildQuests.length);
    nextQuest = buildQuests[questIndex];
  }

  questPanel?.classList.remove("is-changing");
  questText.textContent = nextQuest;

  window.requestAnimationFrame(() => {
    questPanel?.classList.add("is-changing");
  });

  window.setTimeout(() => {
    questPanel?.classList.remove("is-changing");
  }, 380);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((currentButton) => {
      currentButton.classList.remove("is-active");
    });

    button.classList.add("is-active");
    setProjectFilter(button.dataset.filter);
  });
});

projectDetailsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;

    if (details === null) {
      return;
    }

    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "View details" : "Hide details";
    details.hidden = isOpen;
  });
});

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const icon = button.querySelector("span:last-child");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((currentButton) => {
      const currentAnswer = currentButton.nextElementSibling;
      const currentIcon = currentButton.querySelector("span:last-child");

      currentButton.setAttribute("aria-expanded", "false");

      if (currentAnswer !== null) {
        currentAnswer.hidden = true;
      }

      if (currentIcon !== null) {
        currentIcon.textContent = "+";
      }
    });

    button.setAttribute("aria-expanded", String(!isOpen));

    if (answer !== null) {
      answer.hidden = isOpen;
    }

    if (icon !== null) {
      icon.textContent = isOpen ? "+" : "-";
    }
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

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    }
  );

  pageSections.forEach((section) => navObserver.observe(section));
}

themeToggle.addEventListener("click", () => {
  const activeTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  setTheme(activeTheme, true);
});

window.addEventListener("scroll", () => {
  const shouldShowBackToTop = window.scrollY > 420;
  backToTopButton.classList.toggle("is-visible", shouldShowBackToTop);
});

window.addEventListener("resize", updateNavAnchorOffset);

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const sectionId = link.getAttribute("href")?.replace("#", "");

    if (sectionId !== undefined) {
      setActiveNavLink(sectionId);
    }
  });
});

messageBody?.addEventListener("input", updateMessageCount);

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.email;

  if (email === undefined) {
    return;
  }

  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.textContent = "Email copied";
  } catch (error) {
    copyEmailButton.textContent = email;
  }

  window.setTimeout(() => {
    copyEmailButton.textContent = "Copy Email";
  }, 2200);
});

questButton?.addEventListener("click", setRandomQuest);

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    showFormStatus("Please complete the required fields.");
    return;
  }

  if (messageBody !== null && messageBody.value.trim().length < 20) {
    showFormStatus("Add a little more detail so the message is useful.");
    messageBody.focus();
    return;
  }

  showFormStatus("Message ready. Thanks for reaching out.");
  contactForm.reset();
  updateMessageCount();
});

currentYear.textContent = new Date().getFullYear();
setTheme(localStorage.getItem("portfolio-theme") || "dark");
updateNavAnchorOffset();
typeHeroIntro();
updateMessageCount();
