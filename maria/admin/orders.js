// ================== Orders Management Logic ==================

const ordersTableBody = document.querySelector("#ordersTable tbody");

// 1. Fetch all orders from the PHP API
async function fetchOrders() {
    try {
        // Adjust path if your API is in a subfolder
        const response = await fetch('api/orders/get_allorders.php');
        const result = await response.json();

        if (result.success) {
            renderOrders(result.data);
        } else {
            console.error("API Error:", result.message);
        }
    } catch (err) {
        console.error("Connection to API failed:", err);
    }
}

// 2. Render the orders into the table
function renderOrders(orders) {
    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = "";

    if (orders.length === 0) {
        ordersTableBody.innerHTML = "<tr><td colspan='9' style='text-align:center;'>No orders found.</td></tr>";
        return;
    }

    orders.forEach(order => {
        const row = ordersTableBody.insertRow();
        
        // Status Badge Style
        const statusClass = order.status.toLowerCase() === 'pending' ? 'status-pending' : 'status-completed';

        row.innerHTML = `
            <td><strong>${order.order_reference}</strong></td>
            <td>${order.customer_first_name} ${order.customer_last_name}</td>
            <td>${order.customer_phone}</td>
            <td>${order.wilaya}</td>
            <td>${order.delivery_type}</td>
            <td>${parseFloat(order.total_price).toLocaleString()} DA</td>
            <td><span class="badge ${statusClass}">${order.status}</span></td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>
                <button class="delete-btn" onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        `;
    });
}

// 3. Delete an order using the delete.php API
async function deleteOrder(orderId) {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

    try {
        const response = await fetch('api/orders/delete.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: orderId })
        });

        const result = await response.json();

        if (result.success) {
            alert("Order deleted successfully.");
            fetchOrders(); // Refresh the list
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error("Delete request failed:", err);
        alert("Failed to delete order. Check console for details.");
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", fetchOrders);