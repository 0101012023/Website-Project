/**
 * ADMIN.JS - FULL INTEGRATED CODE
 * Covers: Login, Stocks, Orders, and Dynamic Categories
 */

// ================== 1. AUTHENTICATION (Login) ==================
const loginForm = document.getElementById("adminLoginForm");
const errorMsg = document.getElementById("errorMsg");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            errorMsg.textContent = "Please fill in all fields.";
            return;
        }

        try {
            // Replace with your actual auth API path
            const response = await fetch('api/auth/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem("adminLoggedIn", "true");
                window.location.href = "admin-dashboard.html";
            } else {
                errorMsg.textContent = result.message || "Invalid credentials.";
                errorMsg.style.color = "#ff4d4d";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMsg.textContent = "Server connection failed.";
        }
    });
}

// Security Check: Redirect if not logged in (Exclude login page itself)
if (!window.location.pathname.includes("login.html") && localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Logout Function
function adminLogout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}


// ================== 2. GESTION DES STOCKS (Products) ==================
const addBtn = document.getElementById("addBtn");
const stockTableBody = document.querySelector("#stockTable tbody");

// A. Fetch Live Products
async function fetchProducts() {
    if (!stockTableBody) return; // Only run on gestion-stock.html
    try {
        const response = await fetch('api/products/filter.php'); 
        const result = await response.json();
        
        if (result.success) {
            renderStockTable(result.data);
        }
    } catch (err) {
        console.error("Failed to load products:", err);
    }
}

// B. Render Stock Table
function renderStockTable(products) {
    stockTableBody.innerHTML = "";
    products.forEach((prod) => {
        const row = stockTableBody.insertRow();
        row.innerHTML = `
            <td>${prod.name}</td>
            <td>${prod.brand}</td>
            <td>${prod.category_id}</td>
            <td>${prod.stock_quantity}</td>
            <td>${prod.price} DA</td>
            <td>
                ${prod.main_image ? `<img src="uploads/${prod.main_image}" width="50" style="border-radius:4px;">` : "No Image"}
            </td>
            <td>
                <button class="delete-btn" onclick="deleteProduct(${prod.id})">Delete</button>
            </td>
        `;
    });
}

// C. Create Product (Multipart for Images)
if (addBtn) {
    addBtn.addEventListener("click", async () => {
        const name = document.getElementById("productName").value.trim();
        const brand = document.getElementById("productBrand").value.trim();
        const catId = document.getElementById("productCategory").value;
        const qty = document.getElementById("productQty").value;
        const price = document.getElementById("productPrice").value;
        const imageFile = document.getElementById("productImage").files[0];

        if (!name || !brand || !catId || !qty || !price || !imageFile) {
            alert("All fields including the image are required.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('category_id', catId);
        formData.append('stock_quantity', qty);
        formData.append('price', price);
        formData.append('description', "Added via Admin Panel");
        formData.append('main_image', imageFile);

        try {
            const response = await fetch('api/products/createproduct.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                alert("Product Added Successfully!");
                location.reload(); 
            } else {
                alert("Error: " + result.message);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        }
    });
}

// D. Delete Product
async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch('api/products/deleteproduct.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            fetchProducts();
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Delete failed:", err);
    }
}


// ================== 3. ORDERS MANAGEMENT ==================
const ordersTableBody = document.querySelector("#ordersTable tbody");

async function fetchOrders() {
    if (!ordersTableBody) return; // Only run on orders.html
    try {
        const response = await fetch('api/orders/get_allorders.php');
        const result = await response.json();
        if (result.success) {
            renderOrdersTable(result.data);
        }
    } catch (err) {
        console.error("Failed to load orders:", err);
    }
}

function renderOrdersTable(orders) {
    ordersTableBody.innerHTML = "";
    orders.forEach(order => {
        const row = ordersTableBody.insertRow();
        row.innerHTML = `
            <td>${order.order_reference}</td>
            <td>${order.customer_first_name} ${order.customer_last_name}</td>
            <td>${order.total_price} DA</td>
            <td><span class="status-badge">${order.status}</span></td>
            <td>${order.created_at}</td>
            <td>
                <button class="delete-btn" onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        `;
    });
}

async function deleteOrder(id) {
    if (!confirm("Permanently delete this order?")) return;
    try {
        const response = await fetch('api/orders/delete.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: id })
        });
        const result = await response.json();
        if (result.success) {
            fetchOrders();
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Order delete error:", err);
    }
}


// ================== 4. LOAD CATEGORIES (Helper) ==================
async function loadCategories() {
    const catSelect = document.getElementById("productCategory");
    if (!catSelect) return;

    try {
        const response = await fetch('api/categories/get_all.php');
        const result = await response.json();
        if (result.success) {
            catSelect.innerHTML = '<option value="">Select Category</option>';
            result.data.forEach(cat => {
                const opt = document.createElement("option");
                opt.value = cat.id;
                opt.textContent = cat.name;
                catSelect.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

// ================== INITIALIZE ==================
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchOrders();
    loadCategories();
});