const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const revealItems = document.querySelectorAll(".reveal");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const backToTopButton = document.querySelector("[data-back-to-top]");
const currentYear = document.querySelector("[data-current-year]");
let themeAnimationTimer;

function setProjectFilter(filter) {
  projectCards.forEach((card) => {
    const shouldShow = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
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
  setTheme(activeTheme, true);
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
