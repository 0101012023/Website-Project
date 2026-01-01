/* =========================================================
  main.js  (ONE FILE FOR ALL PAGES)
========================================================= */

/* -------------------------
   0) Shared Helpers
------------------------- */
function num(x) { return Number(x ?? 0) || 0; }
function moneyDA(n) { return `${num(n)} DA`; } 
function qs(sel) { return document.querySelector(sel); }
function has(sel) { return !!document.querySelector(sel); }

// localStorage cart
function getCart() { return JSON.parse(localStorage.getItem("cart") || "{}"); }
function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

// Update cart badge if exists
function updateCartBadge() {
  if (!has("#cartBadge")) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((s, it) => s + (it.qty || 0), 0);
  $("#cartBadge").text(count);
}

/* =========================================================
   1) SHOP PAGE
   (requires: #top-sales-display, #whats-new-display)
========================================================= */
function initShop() {
  // if not shop page => skip
  if (!has("#top-sales-display") && !has("#whats-new-display")) return;

  /* JSON paths  */
  const JSON_TOP = "./top-sales.json";
  const JSON_NEW = "./whats-new.json";

  const FILTERS = { category: "", minPrice: null ,maxPrice: null, query: "" };

  let TOP_PRODUCTS = [];
  let NEW_PRODUCTS = [];
  const ALL_PRODUCTS = {};
  let CURRENT_ID = null;

  // Pass filters
  function passFilters(p) {
    if (FILTERS.category && String(p.category).toLowerCase() !== String(FILTERS.category).toLowerCase()) return false;
    if (FILTERS.minPrice != null && num(p.price_num) < FILTERS.minPrice) return false;
     if (FILTERS.maxPrice != null && num(p.price_num) > FILTERS.maxPrice) return false;

    if (FILTERS.query) {
      const q = FILTERS.query.toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      if (!brand.includes(q) && !title.includes(q)) return false;
    }
    return true;
  }

  // Render one product card
  function renderCard(p) {
    return `
      <div class="section-card product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.title}">
        <h4 style="font-size:12px;margin:6px 0;">${p.title}</h4>
        <p style="font-size:11px;color:#bbb;min-height:28px;">${p.description || ""}</p>
        <h3 style="margin-top:6px;">${moneyDA(p.price_num)}</h3>
      </div>
    `;
  }

  // Render both sections
  function renderAll() {
    const top = TOP_PRODUCTS.filter(passFilters);
    const nw  = NEW_PRODUCTS.filter(passFilters);

    $("#top-sales-display").html(top.map(renderCard).join(""));
    $("#whats-new-display").html(nw.map(renderCard).join(""));

    // message
    const shown = top.length + nw.length;
    if (has("#product-display") && has("#default-message")) {
      if (!FILTERS.category && FILTERS.maxPrice == null && !FILTERS.query) {
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

  // Add to cart
  function addToCart(product) {
    const cart = getCart();
    const id = product.id;
    if (!cart[id]) cart[id] = { ...product, qty: 1 };
    else cart[id].qty += 1;
    setCart(cart);
    updateCartBadge();
  }

  // Modal helpers (optional if modal exists)
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

  // Events: modal close
  $(document).on("click", "#closeModal", closeModal);
  $(document).on("click", "#productModal", function (e) {
    if (e.target.id === "productModal") closeModal();
  });

  // Events: add to cart from modal
  $(document).on("click", "#addToCartBtn", function () {
    if (!CURRENT_ID) return;
    const p = ALL_PRODUCTS[CURRENT_ID];
    if (!p) return;
    addToCart(p);
    closeModal();
  });

  // Events: open modal
  $(document).on("click", ".product-card", function () {
    const id = $(this).data("id");
    const p = ALL_PRODUCTS[id];
    if (p) openModal(p);
  });

  // Load JSON
  async function loadJson(url) {
    const res = await fetch(url);
    const data = await res.json();

    return data.map((p, i) => {
      const id = p.id || `${url}_${i}`;
      const obj = { ...p, id };
      if (obj.price_num == null && obj.priceNum != null) obj.price_num = obj.priceNum;
      obj.price_num = num(obj.price_num);
      ALL_PRODUCTS[id] = obj;
      return obj;
    });
  }

  // Filter events (need data-cat/data-max in HTML)
  $(document).on("click", ".sidebar-item.cat", function () {
  const cat = String($(this).data("cat") || "");

  if (cat === "") {
    //  All:face bar recherche
    FILTERS.query = "";
    $("#brandSearch").val("");
  
    FILTERS.category = "";
  } else {
    FILTERS.category = cat;
  }

  renderAll();
});


  $(document).on("click", ".sidebar-item.price", function () {
    const min = $(this).data("min");
    const max = $(this).data("max");
    FILTERS.minPrice = (min === "" || min == null) ? null : Number(min);
    FILTERS.maxPrice = (max === "" || max == null) ? null : Number(max);
    renderAll();
  });

  $("#searchBtn").on("click", function () {
    FILTERS.query = ($("#brandSearch").val() || "").trim();
    renderAll();
  });

  $("#brandSearch").on("keyup", function (e) {
    if (e.key === "Enter") {
      FILTERS.query = ($("#brandSearch").val() || "").trim();
      renderAll();
    }
  });

  // INIT
  (async function () {
    updateCartBadge();
    TOP_PRODUCTS = await loadJson(JSON_TOP);
    NEW_PRODUCTS = await loadJson(JSON_NEW);
    renderAll();
  })();
}

/* =========================================================
   2) PANIER PAGE
   (requires: #cartItems and #cartTotal)
========================================================= */
function initCartPage() {
  if (!has("#cartItems")) return;

  function saveCart(cart) { setCart(cart); updateCartBadge(); }

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
          <img src="${it.image}" style="width:90px;height:90px;object-fit:cover;border-radius:10px;border:1px solid rgba(197,160,89,.4);">
          <div style="flex:1;">
            <strong style="color:#C5A059;display:block;margin-bottom:6px;">${it.title}</strong>
            <span style="color:#ccc;">${moneyDA(price)}</span>
          </div>

          <div style="display:flex;align-items:center;gap:8px;">
            <button class="dec" data-id="${it.id}" style="width:32px;height:32px;border:1px solid #C5A059;background:transparent;color:#fff;border-radius:6px;">-</button>
            <span style="min-width:24px;text-align:center;">${qty}</span>
            <button class="inc" data-id="${it.id}" style="width:32px;height:32px;border:1px solid #C5A059;background:transparent;color:#fff;border-radius:6px;">+</button>
          </div>

          <button class="rm" data-id="${it.id}" style="background:transparent;border:none;color:#ff5a5a;font-weight:800;">Remove</button>
        </div>
      `;
    }).join("");

    $("#cartItems").html(html);
    if (has("#cartTotal")) $("#cartTotal").text(moneyDA(total));
  }

  // +1
  $(document).on("click", ".inc", function () {
    const id = $(this).data("id");
    const cart = getCart();
    if (!cart[id]) return;
    cart[id].qty += 1;
    saveCart(cart);
    renderCart();
  });

  // -1
  $(document).on("click", ".dec", function () {
    const id = $(this).data("id");
    const cart = getCart();
    if (!cart[id]) return;
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart(cart);
    renderCart();
  });

  // remove
  $(document).on("click", ".rm", function () {
    const id = $(this).data("id");
    const cart = getCart();
    delete cart[id];
    saveCart(cart);
    renderCart();
  });

  // INIT
  updateCartBadge();
  renderCart();
}

/* =========================================================
   3) CHECKOUT PAGE
   (requires: #wilaya + #livraisonType + totals ids)
========================================================= */
function initCheckout() {
  if (!has("#wilaya") || !has("#livraisonType")) return;

  // 58 wilayas fees
    const DELIVERY = {
  "01": { name: "Adrar", bureau: 1000, domicile: 1400 },
  "02": { name: "Chlef", bureau: 500, domicile: 850 },
  "03": { name: "Laghouat", bureau: 500, domicile: 950 },
  "04": { name: "Oum El Bouaghi", bureau: 500, domicile: 850 },
  "05": { name: "Batna", bureau: 500, domicile: 850 },
  "06": { name: "Bejaia", bureau: 350, domicile: 800 },
  "07": { name: "Biskra", bureau: 600, domicile: 950 },
  "08": { name: "Bechar", bureau: 650, domicile: 1000 },
  "09": { name: "Blida", bureau: 600, domicile: 850 },
  "10": { name: "Bouira", bureau: 500, domicile: 850 },
  "11": { name: "Tamanrasset", bureau: 1200, domicile: 1700 },
  "12": { name: "Tebessa", bureau: 500, domicile: 900 },
  "13": { name: "Tlemcen", bureau: 500, domicile: 750 },
  "14": { name: "Tiaret", bureau: 500, domicile: 800 },
  "15": { name: "Tizi Ouzou", bureau: 500, domicile: 850 },
  "16": { name: "Alger", bureau: 400, domicile: 650 },
  "17": { name: "Djelfa", bureau: 600, domicile: 950 },
  "18": { name: "Jijel", bureau: 500, domicile: 850 },
  "19": { name: "Setif", bureau: 500, domicile: 850 },
  "20": { name: "Saida", bureau: 600, domicile: 750 },
  "21": { name: "Skikda", bureau: 500, domicile: 750 },
  "22": { name: "Sidi Bel Abbes", bureau: 500, domicile: 750 },
  "23": { name: "Annaba", bureau: 500, domicile: 850 },
  "24": { name: "Guelma", bureau: 500, domicile: 850 },
  "25": { name: "Constantine", bureau: 500, domicile: 850 },
  "26": { name: "Medea", bureau: 600, domicile: 850 },
  "27": { name: "Mostaganem", bureau: 600, domicile: 850 },
  "28": { name: "MSila", bureau: 600, domicile: 900 },
  "29": { name: "Mascara", bureau: 500, domicile: 750 },
  "30": { name: "Ouargla", bureau: 650, domicile: 1000 },
  "31": { name: "Oran", bureau: 500, domicile: 750 },
  "32": { name: "El Bayadh", bureau: 700, domicile: 1200 },
  "33": { name: "Illizi", bureau: 1000, domicile: 1700 },
  "34": { name: "Bordj Bou Arreridj", bureau: 500, domicile: 850 },
  "35": { name: "Boumerdes", bureau: 500, domicile: 800 },
  "36": { name: "El Tarf", bureau: 500, domicile: 900 },
  "37": { name: "Tindouf", bureau: 1000, domicile: 1700 },
  "38": { name: "Tissemsilt", bureau: 500, domicile: 850 },
  "39": { name: "El Oued", bureau: 650, domicile: 1000 },
  "40": { name: "Khenchela", bureau: 500, domicile: 850 },
  "41": { name: "Souk Ahras", bureau: 500, domicile: 850 },
  "42": { name: "Tipaza", bureau: 500, domicile: 850 },
  "43": { name: "Mila", bureau: 500, domicile: 850 },
  "44": { name: "Ain Defla", bureau: 500, domicile: 800 },
  "45": { name: "Naama", bureau: 600, domicile: 1000 },
  "46": { name: "Ain Temouchent", bureau: 350, domicile: 500 },
  "47": { name: "Ghardaia", bureau: 600, domicile: 950 },
  "48": { name: "Relizane", bureau: 500, domicile: 800 },
  "49": { name: "El M'Ghair", bureau: 850, domicile: 1000 },
  "50": { name: "El Meniaa", bureau: 850, domicile: 1000 },
  "51": { name: "Ouled Djellal", bureau: 600, domicile: 1000 },
  "52": { name: "Beni Abbes", bureau: 600, domicile: 850 },
  "53": { name: "Timimoun", bureau: 1000, domicile: 1400 },
  "54": { name: "Touggourt", bureau: 650, domicile: 1000 },
  "55": { name: "Djanet", bureau: 1000, domicile: 1700 },
  "56": { name: "In Salah", bureau:1000, domicile: 1700 },
  "57": { name: "In Guezzam", bureau: 1000, domicile: 1700 },
  "58": { name: "Bordj Badji Mokhtar", bureau: 600, domicile: 850 }
};

  let discount = 0;

  function productsTotal() {
    const cart = getCart();
    return Object.values(cart).reduce((s, it) => s + (num(it.price_num) * num(it.qty)), 0);
  }

  function fillWilayas() {
    const $w = $("#wilaya");
    $w.html(`<option value="">choose...</option>`);
    Object.entries(DELIVERY).forEach(([code, w]) => {
      $w.append(`<option value="${code}">${code} - ${w.name}</option>`);
    });
  }

  function deliveryFee() {
  const w = $("#wilaya").val();
  const t = $("#livraisonType").val();
  if (!w || !t) return 0;

  return Number(DELIVERY[w][t]);
}


  function toggleBureau() {
    if (has("#bureauWrap")) $("#bureauWrap").hide();
    if (has("#bureau")) $("#bureau").val("");
  }
  function renderOrderItems() {
  // لازم تكون دايرة في HTML
  if (!has("#orderItems")) return;

  const cart = getCart();
  const items = Object.values(cart);

  // total qty
  const count = items.reduce((s, it) => s + num(it.qty), 0);
  if (has("#orderCount")) $("#orderCount").text(`${count} items`);

  if (!items.length) {
    $("#orderItems").html(`<div class="order-empty">Empty cart</div>`);
    return;
  }

  const html = items.map(it => {
    const qty = num(it.qty);

    // fallback price
    const price = num(it.price_num != null ? it.price_num : it.priceNum);

    const lineTotal = qty * price;

    return `
      <div class="order-item">
        <div class="order-left">
          <img class="order-img" src="${it.image || ""}" alt="">
          <div class="order-info">
            <div class="order-name">${it.title || "Item"}</div>
            <div class="order-meta">Qty: <b>${qty}</b> × ${moneyDA(price)}</div>
          </div>
        </div>
        <div class="order-right">${moneyDA(lineTotal)}</div>
      </div>
    `;
  }).join("");

  $("#orderItems").html(html);
}


  function refresh() {
    const sub = productsTotal();
    const ship = deliveryFee();
    const total = Math.max(0, sub + ship - discount);

    if (has("#sumProducts")) $("#sumProducts").text(moneyDA(sub));
    if (has("#sumDelivery")) $("#sumDelivery").text(moneyDA(ship));
    if (has("#sumDiscount")) $("#sumDiscount").text(moneyDA(discount));
    if (has("#sumTotal")) $("#sumTotal").text(moneyDA(total));

    renderOrderItems(); 
  }

  
  // totals update
  $(document).on("change", "#wilaya", function () {
    toggleBureau();
    refresh();
  });
  $(document).on("change", "#livraisonType", function () {
    toggleBureau();
    refresh();
  });

  // submit
  $("#checkoutBtn").on("click", function () {
    const cart = getCart();

    if (!Object.keys(cart).length) return alert("Panier vide.");
    if (!$("#nom").val().trim() || !$("#prenom").val().trim() || !$("#tel").val().trim())
      return alert("add First name / Last Name / Phone.");
    if (!$("#wilaya").val() || !$("#livraisonType").val() || !$("#email").val())
      return alert("add State / Type livraison / email.");

    const payload = {
      nom: $("#nom").val().trim(),
      prenom: $("#prenom").val().trim(),
      tel: $("#tel").val().trim(),
      wilaya: $("#wilaya").val(),
      livraisonType: $("#livraisonType").val(),
      email : $("#email").val(),
      subtotal: productsTotal(),
      shipping: deliveryFee(),
      discount,
      total: Math.max(0, productsTotal() + deliveryFee() - discount),
      items: Object.values(cart)
    };

    console.log("ORDER:", payload);

    //  after submit clear cart
    setCart({});
    updateCartBadge();
    refresh();

    
  
   window.location.href = "shop.html";
  });

  // INIT
  $(document).ready(function () {
    fillWilayas();
    toggleBureau();
    refresh();
  });
}

/* =========================================================
   4) SERVICES PAGE (Modals)
========================================================= */
function initServicesModals() {
  // expose functions globally (so onclick="openDeliveryModal()" works)
  window.openModal = (id) => { const el = document.getElementById(id); if (el) el.style.display = "flex"; };
  window.closeModal = (id) => { const el = document.getElementById(id); if (el) el.style.display = "none"; };

  window.openDeliveryModal = () => window.openModal("deliveryModal");
  window.closeDeliveryModal = () => window.closeModal("deliveryModal");

  window.openRepairModal = () => window.openModal("repairModal");
  window.closeRepairModal = () => window.closeModal("repairModal");

  window.openWarrantyModal = () => window.openModal("warrantyModal");
  window.closeWarrantyModal = () => window.closeModal("warrantyModal");

  window.openTradeModal = () => window.openModal("tradeModal");
  window.closeTradeModal = () => window.closeModal("tradeModal");

  window.openSetupModal = () => window.openModal("setupModal");
  window.closeSetupModal = () => window.closeModal("setupModal");

  window.openSupportModal = () => window.openModal("supportModal");
  window.closeSupportModal = () => window.closeModal("supportModal");
}





// services-fentre//

// Delivery modal
function openDeliveryModal() {
  document.getElementById("deliveryModal").style.display = "flex";
}
function closeDeliveryModal() {
  document.getElementById("deliveryModal").style.display = "none";
}

// Repair modal
function openRepairModal() {
  document.getElementById("repairModal").style.display = "flex";
}
function closeRepairModal() {
  document.getElementById("repairModal").style.display = "none";
}

// Warranty modal
function openWarrantyModal() {
  document.getElementById("warrantyModal").style.display = "flex";
}
function closeWarrantyModal() {
  document.getElementById("warrantyModal").style.display = "none";
}

// Trade-In modal
function openTradeModal() {
  document.getElementById("tradeModal").style.display = "flex";
}
function closeTradeModal() {
  document.getElementById("tradeModal").style.display = "none";
}

// Setup modal
function openSetupModal() {
  document.getElementById("setupModal").style.display = "flex";
}
function closeSetupModal() {
  document.getElementById("setupModal").style.display = "none";
}

// Support modal
function openSupportModal() {
  document.getElementById("supportModal").style.display = "flex";
}
function closeSupportModal() {
  document.getElementById("supportModal").style.display = "none";
}


/* =========================================================
   5) BOOTSTRAP: run init for existing page parts
========================================================= */
$(document).ready(function () {
  updateCartBadge();     // badge if exists on any page
  initShop();            // only runs if shop IDs exist
  initCartPage();        // only runs if cart IDs exist
  initCheckout();        // only runs if checkout IDs exist
  initServicesModals();  // safe always
});
