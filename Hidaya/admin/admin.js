// ===== Login Functionality =====
const form = document.getElementById('adminLoginForm');
const errorMsg = document.getElementById('errorMsg');

if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if(username === '' || password === '') {
            errorMsg.textContent = "Please fill in all fields!";
        } else {
            errorMsg.textContent = "";
            alert("Form submitted! Your friend can handle PHP login here.");
            form.reset();
        }
    });
}

// ===== Gestion des Stocks Functionality =====
const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("#stockTable tbody");

if(addBtn) {
    addBtn.addEventListener("click", () => {
        const name = document.getElementById("productName").value.trim();
        const qty = document.getElementById("productQty").value.trim();
        if(name && qty) {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = name;
            row.insertCell(1).innerText = qty;

            const delCell = row.insertCell(2);
            const delBtn = document.createElement("button");
            delBtn.innerText = "Delete";
            delBtn.classList.add("delete-btn");
            delBtn.onclick = () => row.remove();
            delCell.appendChild(delBtn);

            // Clear inputs
            document.getElementById("productName").value = "";
            document.getElementById("productQty").value = "";
        } else {
            alert("Please fill both fields!");
        }
    });
}
