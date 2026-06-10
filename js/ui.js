function initActiveNav() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  function getPageName(pathname) {
    const normalized = pathname.replace(/\/+$/, "");
    const pageName = normalized.split("/").pop();
    return pageName && pageName.includes(".") ? pageName : "index.html";
  }

  const currentPage = getPageName(currentPath);

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const linkPage = getPageName(
      new URL(href, window.location.href).pathname.replace(/\/+$/, ""),
    );

    if (currentPage === linkPage) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

function initMenuToggle() {
  const menuBtn = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (!menuBtn || !mainNav) return;

  menuBtn.addEventListener("click", () => {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !isExpanded);
    mainNav.classList.toggle("is-open");
  });
}

function initThemeToggle() {
  const themeBtn = document.getElementById("theme-btn");
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem("siteTheme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("theme-dark");
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    const currentTheme = document.body.classList.contains("theme-dark")
      ? "dark"
      : "light";
    localStorage.setItem("siteTheme", currentTheme);
  });
}

function initBackToTopAndYear() {
  const backBtn = document.getElementById("back-btn");
  const yearSpan = document.getElementById("current-year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (!backBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backBtn.removeAttribute("hidden");
      backBtn.classList.add("is-visible");
    } else {
      backBtn.setAttribute("hidden", "");
      backBtn.classList.remove("is-visible");
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initAccordion() {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isHidden = content.hasAttribute("hidden");

      document.querySelectorAll(".accordion-content").forEach((item) => {
        item.setAttribute("hidden", "");
        item.previousElementSibling.classList.remove("active");
      });

      if (isHidden) {
        content.removeAttribute("hidden");
        header.classList.add("active");
      } else {
        content.setAttribute("hidden", "");
        header.classList.remove("active");
      }
    });
  });
}

function initFilters() {
  const searchInput = document.getElementById("table-search");
  const tableRows = document.querySelectorAll("#schedule-table .table-row");

  if (!searchInput || tableRows.length === 0) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    tableRows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();
      if (rowText.includes(query)) {
        row.removeAttribute("hidden");
      } else {
        row.setAttribute("hidden", "");
      }
    });
  });
}

function initModal() {
  const triggerImg = document.getElementById("gallery-img");
  const modal = document.getElementById("image-modal");

  if (!triggerImg || !modal) return;

  const modalImg = document.getElementById("modal-img");
  const closeBtn = modal.querySelector(".modal-close");
  const overlay = modal.querySelector(".modal-overlay");

  function openModal(e) {
    e.preventDefault();

    const src = triggerImg.getAttribute("src");
    if (!src) return;

    modalImg.src = src;
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    modalImg.src = "";
  }

  triggerImg.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
      closeModal();
    }
  });
}
