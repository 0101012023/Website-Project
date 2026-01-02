const tableBody = document.querySelector("#ordersTable tbody");

let orders = [];
let deliveryPrices = [];

// Load delivery prices
fetch('delivery.json')
    .then(res => res.json())
    .then(data => deliveryPrices = data)
    .catch(err => console.error(err));

// Load orders
fetch('orders.json')
    .then(res => res.json())
    .then(data => {
        orders = data;
        displayOrders();
    })
    .catch(err => console.error(err));

function displayOrders() {
    tableBody.innerHTML = "";

    orders.forEach(order => {
        const row = tableBody.insertRow();

        row.insertCell(0).innerText = order.id;
        row.insertCell(1).innerText = order.client_name + " " + order.client_surname;
        row.insertCell(2).innerText = order.time;
        row.insertCell(3).innerText = order.phone;
        row.insertCell(4).innerText = order.address;
        row.insertCell(5).innerText = order.delivery_type;

        // Products
        const productsCell = row.insertCell(6);
        let productsText = "";
        let total = 0;
        order.products.forEach(p => {
            productsText += `${p.name} x ${p.quantity} = ${p.price*p.quantity} DA\n`;
            total += p.price*p.quantity;
        });
        productsCell.innerText = productsText;

        // Add delivery price
        const delivery = deliveryPrices.find(d => d.wilaya === order.wilaya);
        if(delivery) {
            total += order.delivery_type === "home" ? delivery.home : delivery.desk;
        }

        row.insertCell(7).innerText = total;
    });
}
