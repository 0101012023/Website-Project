/* =========================================================
  main.js  (ONE FILE FOR ALL PAGES)
========================================================= */

/* -------------------------
   0) Shared Helpers
------------------------- */
function num(x) { return Number(x ?? 0) || 0; }
function moneyDA(n) { return `${num(n)} DA`; }
function has(sel) { return !!document.querySelector(sel); }

// localStorage cart
function getCart() { return JSON.parse(localStorage.getItem("cart") || "{}"); }
function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

// Update cart badge if exists
function updateCartBadge() {
  if (!has("#cartBadge")) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((s, it) => s + (it.qty || 0), 0);
  document.getElementById("cartBadge").textContent = count;
}

/* =========================================================
   1) SHOP PAGE
========================================================= */
function initShop() {
  if (!has("#top-sales-display") && !has("#whats-new-display")) return;

  const JSON_TOP = "./top-sales.json";
  const JSON_NEW = "./whats-new.json";

  const FILTERS = { category: "", minPrice: null, maxPrice: null, query: "" };

  let TOP_PRODUCTS = [];
  let NEW_PRODUCTS = [];
  const ALL_PRODUCTS = {};
  let CURRENT_ID = null;

  function passFilters(p) {
    if (FILTERS.category && p.category !== FILTERS.category) return false;
    if (FILTERS.minPrice != null && num(p.price_num) < FILTERS.minPrice) return false;
    if (FILTERS.maxPrice != null && num(p.price_num) > FILTERS.maxPrice) return false;

    if (FILTERS.query) {
      const q = FILTERS.query.toLowerCase();
      if (
        !(p.brand || "").toLowerCase().includes(q) &&
        !(p.title || "").toLowerCase().includes(q)
      ) return false;
    }
    return true;
  }

  function renderCard(p) {
    return `
      <div class="section-card product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>${p.description || ""}</p>
        <h3>${moneyDA(p.price_num)}</h3>
      </div>
    `;
  }

  function renderAll() {
    const top = TOP_PRODUCTS.filter(passFilters);
    const nw  = NEW_PRODUCTS.filter(passFilters);

    document.getElementById("top-sales-display").innerHTML = top.map(renderCard).join("");
    document.getElementById("whats-new-display").innerHTML = nw.map(renderCard).join("");
  }

  function addToCart(product) {
    const cart = getCart();
    if (!cart[product.id]) cart[product.id] = { ...product, qty: 1 };
    else cart[product.id].qty++;
    setCart(cart);
    updateCartBadge();
  }

  function openModal(p) {
    const modal = document.getElementById("productModal");
    if (!modal) return;

    CURRENT_ID = p.id;
    document.getElementById("modalImage").src = p.image;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalDescription").textContent = p.description || "";
    document.getElementById("modalPrice").textContent = moneyDA(p.price_num);
    modal.style.display = "flex";
  }

  function closeModal() {
    const modal = document.getElementById("productModal");
    if (modal) modal.style.display = "none";
    CURRENT_ID = null;
  }

  document.addEventListener("click", function (e) {
    if (e.target.id === "closeModal") closeModal();
    if (e.target.id === "productModal") closeModal();

    const card = e.target.closest(".product-card");
    if (card) {
      const p = ALL_PRODUCTS[card.dataset.id];
      if (p) openModal(p);
    }

    if (e.target.id === "addToCartBtn" && CURRENT_ID) {
      addToCart(ALL_PRODUCTS[CURRENT_ID]);
      closeModal();
    }
  });

  async function loadJson(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data.map((p, i) => {
      const id = p.id || `${url}_${i}`;
      const obj = { ...p, id, price_num: num(p.price_num ?? p.priceNum) };
      ALL_PRODUCTS[id] = obj;
      return obj;
    });
  }

  (async function () {
    updateCartBadge();
    TOP_PRODUCTS = await loadJson(JSON_TOP);
    NEW_PRODUCTS = await loadJson(JSON_NEW);
    renderAll();
  })();
}

/* =========================================================
   2) CART PAGE
========================================================= */
function initCartPage() {
  if (!has("#cartItems")) return;

  function renderCart() {
    const cart = getCart();
    const items = Object.values(cart);
    const container = document.getElementById("cartItems");
    let total = 0;

    if (!items.length) {
      container.innerHTML = "Empty cart";
      document.getElementById("cartTotal").textContent = "0 DA";
      return;
    }

    container.innerHTML = items.map(it => {
      total += it.qty * it.price_num;
      return `
        <div class="cart-item">
          <img src="${it.image}">
          <div class="cart-item-info">
            <strong>${it.title}</strong>
            <span>${moneyDA(it.price_num)}</span>
          </div>
          <div class="cart-actions">
            <button onclick="updateQty('${it.id}', -1)">-</button>
            <span>${it.qty}</span>
            <button onclick="updateQty('${it.id}', 1)">+</button>
          </div>
          <button class="removeBtn" onclick="removeItem('${it.id}')">Remove</button>
        </div>
      `;
    }).join("");

    document.getElementById("cartTotal").textContent = moneyDA(total);
  }

  window.updateQty = function (id, d) {
    const cart = getCart();
    if (!cart[id]) return;
    cart[id].qty += d;
    if (cart[id].qty <= 0) delete cart[id];
    setCart(cart);
    updateCartBadge();
    renderCart();
  };

  window.removeItem = function (id) {
    const cart = getCart();
    delete cart[id];
    setCart(cart);
    updateCartBadge();
    renderCart();
  };

  renderCart();
}

/* =========================================================
   3) SERVICES PAGE (ONCLICK – CLEAN)
========================================================= */

// Delivery
function openDeliveryModal() {
  document.getElementById("deliveryModal").style.display = "flex";
}
function closeDeliveryModal() {
  document.getElementById("deliveryModal").style.display = "none";
}

// Repair
function openRepairModal() {
  document.getElementById("repairModal").style.display = "flex";
}
function closeRepairModal() {
  document.getElementById("repairModal").style.display = "none";
}

// Warranty
function openWarrantyModal() {
  document.getElementById("warrantyModal").style.display = "flex";
}
function closeWarrantyModal() {
  document.getElementById("warrantyModal").style.display = "none";
}

// Trade
function openTradeModal() {
  document.getElementById("tradeModal").style.display = "flex";
}
function closeTradeModal() {
  document.getElementById("tradeModal").style.display = "none";
}

// Setup
function openSetupModal() {
  document.getElementById("setupModal").style.display = "flex";
}
function closeSetupModal() {
  document.getElementById("setupModal").style.display = "none";
}

// Support
function openSupportModal() {
  document.getElementById("supportModal").style.display = "flex";
}
function closeSupportModal() {
  document.getElementById("supportModal").style.display = "none";
}

/* =========================================================
   4) BOOTSTRAP
========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
  initShop();
  initCartPage();
});
