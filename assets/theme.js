"use strict";

const themeControl = document.querySelector(".theme-toggle");

if (themeControl) {
  const themeKey = "ben-portfolio-theme";
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTransition;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeControl.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }

  let savedTheme = "light";
  try {
    const stored = localStorage.getItem(themeKey);
    if (stored === "dark" || stored === "light") savedTheme = stored;
  } catch (error) {
    // A readable light theme remains available when storage is blocked.
    console.info("The theme preference could not be read.");
  }
  applyTheme(savedTheme);

  themeControl.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    const update = () => {
      // Applying the theme never depends on being able to save it.
      applyTheme(nextTheme);
      try {
        localStorage.setItem(themeKey, nextTheme);
      } catch (error) {
        console.info("The theme works on this page, but its preference could not be saved.");
      }
    };
    if (!reducedMotion.matches && typeof document.startViewTransition === "function") {
      try {
        if (activeTransition) activeTransition.skipTransition();
        activeTransition = document.startViewTransition(update);
        // A skipped animation must not interrupt the underlying theme change.
        activeTransition.ready.catch(() => {});
        activeTransition.finished.catch(() => {});
      } catch (error) {
        update();
      }
    } else {
      update();
    }
  });

  // The button remains absent from the interface if this script cannot load.
  themeControl.hidden = false;
}
