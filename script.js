const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const searchPanel = document.querySelector(".search-panel");
const searchToggle = document.querySelector(".search-toggle");
const searchClose = document.querySelector(".search-close");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#site-search");
const searchMessage = document.querySelector(".search-message");
const cartCount = document.querySelector(".cart-count");
const cartToggle = document.querySelector(".cart-toggle");
const toast = document.querySelector(".toast");
let bagItems = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function closeMenu() {
  primaryNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

function toggleSearch(open) {
  if (!open && searchPanel.contains(document.activeElement)) searchToggle.focus();
  searchPanel.classList.toggle("is-open", open);
  searchPanel.setAttribute("aria-hidden", String(!open));
  if (open) {
    closeMenu();
    searchInput.focus();
  }
}

searchToggle.addEventListener("click", () => toggleSearch(!searchPanel.classList.contains("is-open")));
searchClose.addEventListener("click", () => toggleSearch(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleSearch(false);
    closeMenu();
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchMessage.textContent = "Enter a piece, style or detail to search.";
    searchInput.focus();
    return;
  }
  const matches = [...document.querySelectorAll(".product-card")].filter((card) =>
    card.dataset.name.toLowerCase().includes(query),
  );
  searchMessage.textContent = matches.length
    ? `${matches.length} piece${matches.length === 1 ? "" : "s"} found in the collection.`
    : "No exact match just yet. Try “bag”, “heel” or “cuff”.";
  if (matches.length) {
    toggleSearch(false);
    matches[0].scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    bagItems += 1;
    cartCount.textContent = String(bagItems);
    cartToggle.setAttribute("aria-label", `Shopping bag, ${bagItems} item${bagItems === 1 ? "" : "s"}`);
    showToast(`${button.dataset.product} added to your bag`);
  });
});

cartToggle.addEventListener("click", () => {
  showToast(bagItems ? `Your bag has ${bagItems} piece${bagItems === 1 ? "" : "s"}.` : "Your bag is waiting for something lovely.");
});

document.querySelectorAll(".favorite-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isFavorite = button.classList.toggle("is-favorite");
    button.textContent = isFavorite ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isFavorite));
    showToast(isFavorite ? "Saved to your wishlist" : "Removed from your wishlist");
  });
});

document.querySelectorAll(".slider-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    const track = document.getElementById(button.dataset.scroll);
    track.scrollBy({ left: Number(button.dataset.direction) * track.clientWidth * 0.78, behavior: "smooth" });
  });
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  document.querySelector(".form-message").textContent = "You’re on the list. Look out for a little note from LuxeVogue.";
  event.currentTarget.reset();
});
