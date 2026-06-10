const FAVORITES_KEY = "catalogFavorites";
let allItems = [];
let filteredItems = [];
let visibleCount = 4;

async function loadItems() {
  const response = await fetch("../data/items.json");
  if (!response.ok) {
    throw new Error(`Помилка сервера: код статусу ${response.status}`);
  }
  return response.json();
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function toggleFavorite(id) {
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function renderCatalog(itemsToRender) {
  const grid = document.getElementById("catalog-grid");
  const emptyState = document.getElementById("catalog-empty");
  const loadMoreBtn = document.getElementById("load-more-btn");

  if (!grid) return;

  grid.innerHTML = "";

  if (itemsToRender.length === 0) {
    emptyState.removeAttribute("hidden");
    loadMoreBtn.setAttribute("hidden", "");
    return;
  } else {
    emptyState.setAttribute("hidden", "");
  }

  const slicedItems = itemsToRender.slice(0, visibleCount);
  const favorites = getFavorites();

  slicedItems.forEach((item) => {
    const isFav = favorites.includes(item.id);
    const card = document.createElement("article");
    card.className = "catalog-card";
    card.setAttribute("data-id", item.id);

    card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <span class="card-badge ${item.category}">${item.category.toUpperCase()}</span>
            </div>
            <div class="card-content">
                <div class="card-header-row">
                    <span class="card-level">${item.level}</span>
                    <span class="card-rating">★ ${item.rating}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-footer-row">
                    <span class="card-price">${item.price} ₴</span>
                    <div class="card-actions">
                        <button class="btn-fav ${isFav ? "is-fav" : ""}" aria-label="Додати в обране">
                            ${isFav ? "❤️" : "🤍"}
                        </button>
                        <button class="btn btn-sm btn-details">Деталі</button>
                    </div>
                </div>
            </div>
        `;
    grid.appendChild(card);
  });

  if (itemsToRender.length > visibleCount) {
    loadMoreBtn.removeAttribute("hidden");
  } else {
    loadMoreBtn.setAttribute("hidden", "");
  }
}

function applyFiltersAndSort() {
  const searchQuery = document
    .getElementById("catalog-search")
    .value.toLowerCase()
    .trim();
  const categoryFilter = document.getElementById("catalog-category").value;
  const sortValue = document.getElementById("catalog-sort").value;

  filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery);
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (sortValue === "price-asc") {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating-desc") {
    filteredItems.sort((a, b) => b.rating - a.rating);
  } else {
    filteredItems.sort((a, b) => a.id - b.id);
  }

  renderCatalog(filteredItems);
}

function showDetailsModal(id) {
  const modal = document.getElementById("details-modal");
  const contentBox = document.getElementById("details-modal-content");
  if (!modal || !contentBox) return;

  const item = allItems.find((i) => i.id === Number(id));
  if (!item) return;

  contentBox.innerHTML = `
        <div class="details-layout">
            <img src="${item.image}" alt="${item.title}" class="details-img">
            <div class="details-info">
                <h2>${item.title}</h2>
                <div class="details-meta">
                    <span class="badge ${item.category}">${item.category}</span>
                    <span><strong>Рівень:</strong> ${item.level}</span>
                    <span><strong>Рейтинг:</strong> ★ ${item.rating}</span>
                </div>
                <p class="details-desc">${item.description} Дана програма сертифікована європейськими стандартами та включає повне практичне менторство під час виконання лабораторних та курсових робіт.</p>
                <div class="details-price-row">
                    <span class="details-price">Вартість: ${item.price} ₴</span>
                    <button class="btn btn-primary" onclick="alert('Дякуємо! Заявку на курс зареєстровано.')">Записатися на курс</button>
                </div>
            </div>
        </div>
    `;

  modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function closeDetailsModal() {
  const modal = document.getElementById("details-modal");
  if (modal) {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }
}

function initCatalogControls() {
  const searchInput = document.getElementById("catalog-search");
  const categorySelect = document.getElementById("catalog-category");
  const sortSelect = document.getElementById("catalog-sort");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const grid = document.getElementById("catalog-grid");
  const modal = document.getElementById("details-modal");

  if (!searchInput || !categorySelect || !sortSelect || !grid) return;

  searchInput.addEventListener("input", () => {
    visibleCount = 4;
    applyFiltersAndSort();
  });

  categorySelect.addEventListener("change", () => {
    visibleCount = 4;
    applyFiltersAndSort();
  });

  sortSelect.addEventListener("change", applyFiltersAndSort);

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += 4;
    renderCatalog(filteredItems);
  });

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".catalog-card");
    if (!card) return;
    const id = Number(card.getAttribute("data-id"));

    if (e.target.closest(".btn-fav")) {
      toggleFavorite(id);
      // Перерендерюємо, зберігаючи поточну позицію скролу та фільтрів
      renderCatalog(filteredItems);
    } else if (e.target.closest(".btn-details")) {
      showDetailsModal(id);
    }
  });

  document
    .getElementById("close-details-btn")
    ?.addEventListener("click", closeDetailsModal);
  modal
    .querySelector(".modal-overlay")
    ?.addEventListener("click", closeDetailsModal);
}

async function initCatalogPage() {
  const catalogGrid = document.getElementById("catalog-grid");
  const loadingBox = document.getElementById("catalog-loading");
  const errorBox = document.getElementById("catalog-error");
  const errorText = document.getElementById("error-message-text");

  if (!catalogGrid) return;

  try {
    allItems = await loadItems();
    filteredItems = [...allItems];

    loadingBox.setAttribute("hidden", "");

    renderCatalog(filteredItems);
    initCatalogControls();
  } catch (error) {
    if (loadingBox) loadingBox.setAttribute("hidden", "");
    if (errorBox && errorText) {
      errorText.textContent = error.message;
      errorBox.removeAttribute("hidden");
    }
  }
}
