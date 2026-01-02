const tableBody = document.querySelector("#ordersTable tbody");

// Example orders (you can delete these later)
let orders = [
    {
        id: 1,
        clientName: "Ahmed Benali",
        phone: "0550123456",
        address: "Algiers",
        deliveryType: "Home",
        products: [
            { name: "iPhone 14", qty: 1 },
            { name: "AirPods Pro", qty: 1 }
        ],
        time: "2026-01-02 15:30",
        totalPrice: 265000
    },
    {
        id: 2,
        clientName: "Sara Khaldi",
        phone: "0669876543",
        address: "Oran",
        deliveryType: "Desk",
        products: [
            { name: "Samsung S23", qty: 1 }
        ],
        time: "2026-01-02 16:10",
        totalPrice: 198000
    }
];

// Load saved orders
const savedOrders = JSON.parse(localStorage.getItem("allOrders"));
if (savedOrders) {
    orders = savedOrders;
}

// Render orders
function renderOrders() {
    tableBody.innerHTML = "";

    orders.forEach((order, index) => {
        const row = tableBody.insertRow();

        row.insertCell(0).innerText = order.id;
        row.insertCell(1).innerText = order.clientName;
        row.insertCell(2).innerText = order.phone;
        row.insertCell(3).innerText = order.address;
        row.insertCell(4).innerText = order.deliveryType;

        // Products list
        const productsCell = row.insertCell(5);
        productsCell.innerHTML = order.products
            .map(p => `${p.name} (x${p.qty})`)
            .join("<br>");

        row.insertCell(6).innerText = order.time;
        row.insertCell(7).innerText = order.totalPrice;

        // Action
        const actionCell = row.insertCell(8);
        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("delete-btn");
        delBtn.onclick = () => {
            orders.splice(index, 1);
            localStorage.setItem("allOrders", JSON.stringify(orders));
            renderOrders();
        };
        actionCell.appendChild(delBtn);
    });
}

// Initial render
renderOrders();
