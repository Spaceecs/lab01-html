document.addEventListener("DOMContentLoaded", init);

async function init() {
  if (typeof initActiveNav === "function") initActiveNav();
  if (typeof initMenuToggle === "function") initMenuToggle();
  if (typeof initThemeToggle === "function") initThemeToggle();
  if (typeof initBackToTopAndYear === "function") initBackToTopAndYear();
  if (typeof initAccordion === "function") initAccordion();
  if (typeof initFilters === "function") initFilters();
  if (typeof initModal === "function") initModal();

  if (typeof initContactForm === "function") initContactForm();

  if (typeof initCatalogPage === "function") {
    await initCatalogPage();
  }
}
