// ================== Admin Login ==================
const form = document.getElementById("adminLoginForm");
const errorMsg = document.getElementById("errorMsg");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            errorMsg.textContent = "Please fill in all fields.";
            return;
        }

        // Frontend validation only
        errorMsg.textContent = "";

        alert("Login data sent. PHP will handle authentication.");

        form.reset();
    });
}

// ================== Gestion des Stocks ==================
const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("#stockTable tbody");

// Products array
let products = [];

// Load initial products from JSON file
fetch('products.json')
  .then(response => response.json())
  .then(data => {
      products = data;
      // Merge with any previously saved products in LocalStorage
      const savedProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
      products = [...products, ...savedProducts];
      renderTable();
  })
  .catch(err => console.log("Could not load products.json", err));

// Render table function
function renderTable() {
    tableBody.innerHTML = "";

    products.forEach((prod, index) => {
        const row = tableBody.insertRow();

        row.insertCell(0).innerText = prod.name;
        row.insertCell(1).innerText = prod.brand;
        row.insertCell(2).innerText = prod.category;
        row.insertCell(3).innerText = prod.quantity;
        row.insertCell(4).innerText = prod.price;
        row.insertCell(5).innerHTML = prod.image ? `<img src="${prod.image}" width="50" alt="Product Image">` : "N/A";

        // Action cell with Delete button
        const actionCell = row.insertCell(6);
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("delete-btn");
        delBtn.onclick = () => {
            products.splice(index, 1);
            localStorage.setItem("allProducts", JSON.stringify(products));
            renderTable();
        };
        actionCell.appendChild(delBtn);
    });
}

// Add new product
if (addBtn) {
    addBtn.addEventListener("click", () => {
        const name = document.getElementById("productName").value.trim();
        const brand = document.getElementById("productBrand").value.trim();
        const category = document.getElementById("productCategory").value.trim();
        const quantity = document.getElementById("productQty").value.trim();
        const price = document.getElementById("productPrice").value.trim();
        const image = document.getElementById("productImage").value.trim();

        if (!name || !brand || !category || !quantity || !price) {
            alert("Please fill all fields except image (optional).");
            return;
        }

        const newProduct = { name, brand, category, quantity, price, image };
        products.push(newProduct);

        // Save new products to LocalStorage
        localStorage.setItem("allProducts", JSON.stringify(products));

        renderTable();

        // Clear inputs
        document.getElementById("productName").value = "";
        document.getElementById("productBrand").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productQty").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productImage").value = "";
    });
}
