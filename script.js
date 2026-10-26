const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
        closeMenu();
        history.replaceState(null, "", link.getAttribute("href"));
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const sectionLinks = [...document.querySelectorAll('#primary-nav a[href^="#"]')];
const sections = sectionLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sectionLinks.forEach(link => {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px" });
  sections.forEach(section => observer.observe(section));
}

/* Small quality-of-life interactions: reveal content and a back-to-top control. */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".section > .eyebrow, .section > h2, .section > .wide, .section > .section-intro, .skills article, .project, .experience-card, .community-card, .stats-row > div"
);

if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.transitionDelay = (index % 4) * 55 + "ms";
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  revealTargets.forEach(element => revealObserver.observe(element));
}

const backToTop = document.createElement("a");
backToTop.className = "back-to-top";
backToTop.href = "#home";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

const updateBackToTop = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
};
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();


/* Colour theme selector: remembers the visitor's choice on this device. */
const themeButtons = [...document.querySelectorAll("[data-theme-choice]")];
const savedTheme = localStorage.getItem("sidra-portfolio-theme") || "teal";
const setTheme = theme => {
  document.documentElement.dataset.theme = theme;
  themeButtons.forEach(button => {
    const selected = button.dataset.themeChoice === theme;
    button.setAttribute("aria-pressed", String(selected));
  });
  const themeColors = {magenta:"#c2187a",maroon:"#800f2f",blue:"#2457c5",teal:"#087f70"};
  const themeColor = themeColors[theme] || themeColors.teal;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", themeColor);
  localStorage.setItem("sidra-portfolio-theme", theme);
};
themeButtons.forEach(button => button.addEventListener("click", () => setTheme(button.dataset.themeChoice)));
setTheme(savedTheme);


/* Custom background colour picker. */
const backgroundColorInput = document.querySelector("#background-color-input");
const savedBackgroundColor = localStorage.getItem("sidra-portfolio-background-color") || "#071018";
const applyBackgroundColor = color => {
  document.documentElement.style.setProperty("--bg", color);
  document.body.style.backgroundColor = color;
  if (backgroundColorInput) backgroundColorInput.value = color;
  localStorage.setItem("sidra-portfolio-background-color", color);
};
if (backgroundColorInput) {
  backgroundColorInput.addEventListener("input", () => applyBackgroundColor(backgroundColorInput.value));
  applyBackgroundColor(savedBackgroundColor);
}
