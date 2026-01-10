/* =========================================================
  main.js (Updated with All Products & Back Navigation)
========================================================= */

/* -------------------------
    0) Shared Helpers
------------------------- */
function num(x) { return Number(x ?? 0) || 0; }
function moneyDA(n) { return `${num(n)} DA`; }
function has(sel) { return !!document.querySelector(sel); }

function getCart() { return JSON.parse(localStorage.getItem("cart") || "{}"); }
function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function updateCartBadge() {
  if (!has("#cartBadge")) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((s, it) => s + (it.qty || 0), 0);
  $("#cartBadge").text(count);
}

/* =========================================================
    1) SHOP PAGE
========================================================= */
function initShop() {
  if (!has("#top-sales-display") && !has("#whats-new-display")) return;

  const JSON_TOP = "./top-sales.json";
  const JSON_NEW = "./whats-new.json";
  const JSON_ALL = "./allproducts.json";

  const FILTERS = { category: "", minPrice: null, maxPrice: null, query: "" };

  let TOP_PRODUCTS = [];
  let NEW_PRODUCTS = [];
  let CATALOG_PRODUCTS = [];
  const ALL_PRODUCTS = {};
  let CURRENT_ID = null;
  let IS_ALL_VIEW = false;

  function passFilters(p) {
    if (FILTERS.category && String(p.category).toLowerCase() !== String(FILTERS.category).toLowerCase()) return false;
    
    const price = num(p.price_num);
    if (FILTERS.minPrice !== null && price < FILTERS.minPrice) return false;
    if (FILTERS.maxPrice !== null && price > FILTERS.maxPrice) return false;

    if (FILTERS.query) {
      const q = FILTERS.query.toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      if (!brand.includes(q) && !title.includes(q)) return false;
    }
    return true;
  }

  function renderCard(p) {
    return `
      <div class="section-card product-card" data-id="${p.id}">
        <img src="${p.image || ""}" alt="${p.title || ""}">
        <h4 style="font-size:12px;margin:6px 0;">${p.title || ""}</h4>
        <p style="font-size:11px;color:#bbb;min-height:28px;">${p.description || ""}</p>
        <h3 style="margin-top:6px;">${moneyDA(p.price_num)}</h3>
      </div>
    `;
  }

  function renderAll() {
    if (IS_ALL_VIEW) {
      $("#default-sections").hide();
      $("#all-products-section").show();
      
      // UI: Swap Buttons
      $("#allProductsBtn").hide();
      $("#backToFeaturedBtn").show();
      
      const filtered = CATALOG_PRODUCTS.filter(passFilters);
      $("#all-products-display").html(filtered.map(renderCard).join(""));
      
      handleEmptyState(filtered.length);
    } else {
      $("#all-products-section").hide();
      $("#default-sections").show();

      // UI: Swap Buttons
      $("#backToFeaturedBtn").hide();
      $("#allProductsBtn").show();

      const top = TOP_PRODUCTS.filter(passFilters);
      const nw = NEW_PRODUCTS.filter(passFilters);

      if (has("#top-sales-display")) $("#top-sales-display").html(top.map(renderCard).join(""));
      if (has("#whats-new-display")) $("#whats-new-display").html(nw.map(renderCard).join(""));

      handleEmptyState(top.length + nw.length);
    }
  }

  function handleEmptyState(shown) {
    if (has("#product-display") && has("#default-message")) {
      const hasFilter = FILTERS.category || FILTERS.minPrice !== null || FILTERS.query || IS_ALL_VIEW;
      
      if (!hasFilter) {
        $("#default-message").text("Select a category or search a brand.");
        $("#product-display").show();
      } else if (shown === 0) {
        $("#default-message").text("No products found.");
        $("#product-display").show();
      } else {
        $("#product-display").hide();
      }
    }
  }

  // --- Button Events ---
  $(document).off("click", "#allProductsBtn").on("click", "#allProductsBtn", async function() {
    IS_ALL_VIEW = true;
    if (CATALOG_PRODUCTS.length === 0) {
      try {
        CATALOG_PRODUCTS = await loadJson(JSON_ALL);
      } catch (e) {
        console.error("Could not load allproducts.json", e);
      }
    }
    renderAll();
  });

  $(document).off("click", "#backToFeaturedBtn").on("click", "#backToFeaturedBtn", function() {
    IS_ALL_VIEW = false;
    renderAll();
  });

  function addToCart(product) {
    const cart = getCart();
    const id = product.id;
    if (!cart[id]) cart[id] = { ...product, qty: 1 };
    else cart[id].qty += 1;
    setCart(cart);
    updateCartBadge();
  }

  function specsHtml(specs) {
    if (!specs || typeof specs !== "object") return "";
    const rows = Object.entries(specs).map(([k, v]) => `
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(197,160,89,.25);padding:6px 0;">
        <span style="color:#C5A059;font-weight:700;">${k}</span>
        <span>${v}</span>
      </div>
    `).join("");
    return `<div style="text-align:left;margin-top:12px;">${rows}</div>`;
  }

  function openModal(p) {
    if (!has("#productModal")) return;

    CURRENT_ID = p.id;
    $("#modalImage").attr("src", p.image || "");
    $("#modalTitle").text(p.title || "");
    $("#modalDescription").text(p.description || "");
    $("#modalPrice").text(moneyDA(p.price_num));

    if (has("#modalExtra")) {
      const extra = `
        <p style="margin-top:10px;">
          <strong style="color:#C5A059;">Brand:</strong> ${p.brand || "-"} |
          <strong style="color:#C5A059;">Category:</strong> ${p.category || "-"}
        </p>
        ${specsHtml(p.specs)}
      `;
      $("#modalExtra").html(extra);
    }

    $("#productModal").css("display", "flex");
  }

  function closeModal() {
    if (!has("#productModal")) return;
    $("#productModal").hide();
    CURRENT_ID = null;
  }

  $(document).on("click", "#closeModal", closeModal);
  $(document).on("click", "#productModal", function (e) {
    if (e.target.id === "productModal") closeModal();
  });

  $(document).on("click", "#addToCartBtn", function () {
    if (!CURRENT_ID) return;
    const p = ALL_PRODUCTS[CURRENT_ID];
    if (!p) return;
    addToCart(p);
    closeModal();
  });

  $(document).on("click", ".product-card", function () {
    const id = $(this).data("id");
    const p = ALL_PRODUCTS[id];
    if (p) openModal(p);
  });

  async function loadJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data.products || []);

    return arr.map((p, i) => {
      const id = p.id || `${url}_${i}`;
      const obj = { ...p, id };
      obj.price_num = num(obj.price_num || obj.priceNum || obj.price);
      ALL_PRODUCTS[id] = obj;
      return obj;
    });
  }

  // --- Filtering Events ---
  $(document).off("click", ".sidebar-item.cat").on("click", ".sidebar-item.cat", function () {
    const cat = String($(this).data("cat") || "");
    if (cat === "") {
      FILTERS.query = "";
      if (has("#brandSearch")) $("#brandSearch").val("");
      FILTERS.category = "";
      IS_ALL_VIEW = false; // Reset to home view when clicking 'All'
    } else {
      FILTERS.category = cat;
    }
    renderAll();
  });

  $(document).off("click", ".sidebar-item.price").on("click", ".sidebar-item.price", function () {
    const min = $(this).data("min");
    const max = $(this).data("max");
    FILTERS.minPrice = (min === "" || min === undefined) ? null : Number(min);
    FILTERS.maxPrice = (max === "" || max === undefined) ? null : Number(max);
    renderAll();
  });

  if (has("#searchBtn")) {
    $("#searchBtn").on("click", function () {
      FILTERS.query = ($("#brandSearch").val() || "").trim();
      renderAll();
    });
  }

  if (has("#brandSearch")) {
    $("#brandSearch").on("keyup", function (e) {
      if (e.key === "Enter") {
        FILTERS.query = ($("#brandSearch").val() || "").trim();
        renderAll();
      }
    });
  }

  // INIT
  (async function () {
    try {
      updateCartBadge();
      TOP_PRODUCTS = await loadJson(JSON_TOP);
      NEW_PRODUCTS = await loadJson(JSON_NEW);
      renderAll();
    } catch (err) {
      console.error("SHOP ERROR:", err);
    }
  })();
}

/* =========================================================
    2) CART PAGE
========================================================= */
function initCartPage() {
  if (!has("#cartItems")) return;

  function saveCart(cart) {
    setCart(cart);
    updateCartBadge();
  }

  function renderCart() {
    const cart = getCart();
    const items = Object.values(cart);

    if (!items.length) {
      $("#cartItems").html("Empty cart");
      if (has("#cartTotal")) $("#cartTotal").text("0 DA");
      return;
    }

    let total = 0;
    const html = items.map(it => {
      const price = num(it.price_num);
      const qty = num(it.qty);
      total += price * qty;
      return `
        <div style="display:flex;gap:12px;align-items:center;border:1px solid #C5A059;padding:12px;border-radius:10px;margin:12px 0;background:#141414;">
          <img src="${it.image || ""}" style="width:90px;height:90px;object-fit:cover;border-radius:10px;">
          <div style="flex:1;">
            <strong style="color:#C5A059;">${it.title || ""}</strong><br>
            <span style="color:#ccc;">${moneyDA(price)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="dec" data-id="${it.id}" style="width:32px;border:1px solid #C5A059;background:transparent;color:#fff;">-</button>
            <span>${qty}</span>
            <button class="inc" data-id="${it.id}" style="width:32px;border:1px solid #C5A059;background:transparent;color:#fff;">+</button>
          </div>
          <button class="rm" data-id="${it.id}" style="background:transparent;border:none;color:#ff5a5a;">Remove</button>
        </div>`;
    }).join("");

    $("#cartItems").html(html);
    if (has("#cartTotal")) $("#cartTotal").text(moneyDA(total));
  }

  $(document).on("click", ".inc", function () {
    const id = $(this).data("id");
    const cart = getCart();
    if (cart[id]) { cart[id].qty += 1; saveCart(cart); renderCart(); }
  });

  $(document).on("click", ".dec", function () {
    const id = $(this).data("id");
    const cart = getCart();
    if (cart[id]) {
      cart[id].qty -= 1;
      if (cart[id].qty <= 0) delete cart[id];
      saveCart(cart); renderCart();
    }
  });

  $(document).on("click", ".rm", function () {
    const id = $(this).data("id");
    const cart = getCart();
    delete cart[id];
    saveCart(cart); renderCart();
  });

  renderCart();
}

function initCheckout() { 
  if (!has("#wilaya")) return; 

  // 1. Fill the Wilaya List
  const wilayas = [
    "1-Adrar", "2-Chlef", "3-Laghouat", "4-Oum El Bouaghi", "5-Batna", "6-Béjaïa", "7-Biskra", 
    "8-Béchar", "9-Blida", "10-Bouira", "11-Tamanrasset", "12-Tébessa", "13-Tlemcen", "14-Tiaret", 
    "15-Tizi Ouzou", "16-Alger", "17-Djelfa", "18-Jijel", "19-Sétif", "20-Saïda", "21-Skikda", 
    "22-Sidi Bel Abbès", "23-Annaba", "24-Guelma", "25-Constantine", "26-Médéa", "27-Mostaganem", 
    "28-M'Sila", "29-Mascara", "30-Ouargla", "31-Oran", "32-El Bayadh", "33-Illizi", "34-Bordj Bou Arréridj", 
    "35-Boumerdès", "36-El Tarf", "37-Tindouf", "38-Tissemsilt", "39-El Oued", "40-Khenchela", 
    "41-Souk Ahras", "42-Tipaza", "43-Mila", "44-Aïn Defla", "45-Naâma", "46-Aïn Témouchent", 
    "47-Ghardaïa", "48-Relizane", "49-El M'Ghair", "50-El Meniaa", "51-Ouled Djellal", "52-Bordj Badji Mokhtar", 
    "53-Béni Abbès", "54-Timimoun", "55-Touggourt", "56-Djanet", "57-In Salah", "58-In Guezzam"
  ];

  let options = '<option value="">Select Wilaya...</option>';
  wilayas.forEach(w => options += `<option value="${w}">${w}</option>`);
  $("#wilaya").html(options);

  // 2. Calculation & Summary Logic
  function refreshCheckout() {
    const cart = getCart();
    const items = Object.values(cart);
    let subtotal = 0;
    let qtyTotal = 0;

    const html = items.map(it => {
      const lineTotal = num(it.price_num) * num(it.qty);
      subtotal += lineTotal;
      qtyTotal += it.qty;
      return `<div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:13px; color:#ccc;">
                <span>${it.title} (x${it.qty})</span>
                <span>${moneyDA(lineTotal)}</span>
              </div>`;
    }).join("");

    $("#orderItems").html(html || "Cart is empty");
    $("#orderCount").text(`${qtyTotal} items`);
    $("#sumProducts").text(moneyDA(subtotal));
    
    // Flat shipping fee when a wilaya is chosen
    const shipping = $("#wilaya").val() ? 600 : 0;
    $("#sumDelivery").text(moneyDA(shipping));
    $("#sumTotal").text(moneyDA(subtotal + shipping));
  }

  $(document).on("change", "#wilaya", refreshCheckout);
  refreshCheckout();

  // 3. WhatsApp Checkout Button
  $("#checkoutBtn").on("click", function() {
    const cart = getCart();
    const items = Object.values(cart);
    if (!items.length) return alert("Your cart is empty!");

    const firstName = $("#nom").val();
    const lastName = $("#prenom").val();
    const phone = $("#tel").val();
    const wilaya = $("#wilaya").val();
    
    if (!firstName || !phone || !wilaya) return alert("Please fill in your Name, Phone and State.");

    let message = `*NEW ORDER - AYMEN PHONE*\n\n`;
    message += `*Customer:* ${firstName} ${lastName}\n`;
    message += `*Phone:* ${phone}\n`;
    message += `*State:* ${wilaya}\n`;
    message += `*Delivery:* ${$("#livraisonType").val()}\n\n`;
    message += `*Items:*\n`;
    
    items.forEach(it => message += `- ${it.title} (x${it.qty}) - ${moneyDA(num(it.price_num) * it.qty)}\n`);
    message += `\n*TOTAL:* ${$("#sumTotal").text()}`;

    const waLink = `https://wa.me/213776486355?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  });
}

function initServicesModals() {
  window.openModal = (id) => { if (has("#"+id)) $("#"+id).css("display", "flex"); };
  window.closeModal = (id) => { if (has("#"+id)) $("#"+id).css("display", "none"); };
}

/* =========================================================
    5) BOOTSTRAP
========================================================= */
$(document).ready(function () {
  updateCartBadge();
  initShop();
  initCartPage();
  initCheckout();
  initServicesModals();
});
function openRepairModal() {
  document.getElementById("repairModal").style.display = "flex";
}
function closeRepairModal() {
  document.getElementById("repairModal").style.display = "none";
}

function openDeliveryModal() {
  document.getElementById("deliveryModal").style.display = "flex";
}
function closeDeliveryModal() {
  document.getElementById("deliveryModal").style.display = "none";
}

function openWarrantyModal() {
  document.getElementById("warrantyModal").style.display = "flex";
}
function closeWarrantyModal() {
  document.getElementById("warrantyModal").style.display = "none";
}

function openTradeModal() {
  document.getElementById("tradeModal").style.display = "flex";
}
function closeTradeModal() {
  document.getElementById("tradeModal").style.display = "none";
}

function openSetupModal() {
  document.getElementById("setupModal").style.display = "flex";
}
function closeSetupModal() {
  document.getElementById("setupModal").style.display = "none";
}

function openSupportModal() {
  document.getElementById("supportModal").style.display = "flex";
}
function closeSupportModal() {
  document.getElementById("supportModal").style.display = "none";
}

/* Close modal when clicking outside */
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};
