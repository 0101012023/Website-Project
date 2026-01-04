<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, "Invalid request method");
}

// استدعاء order_id من query string: ?order_id=1
$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    jsonResponse(false, "Order ID is required");
}

try {
    $db = Database::getConnection();

    // جلب معلومات الطلب
    $sqlOrder = "SELECT 
                    id,
                    order_reference,
                    customer_first_name,
                    customer_last_name,
                    customer_email,
                    customer_phone,
                    customer_address,
                    wilaya,
                    delivery_type,
                    products_total,
                    delivery_price,
                    total_price,
                    paid_amount,
                    remaining_amount,
                    payment_method,
                    payment_confirmed_at,
                    status,
                    admin_notes,
                    created_at,
                    updated_at
                 FROM orders
                 WHERE id = ?";

    $stmtOrder = $db->prepare($sqlOrder);
    $stmtOrder->execute([$order_id]);
    $order = $stmtOrder->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        jsonResponse(false, "Order not found");
    }

    // جلب عناصر الطلب المرتبطة به من order_items
    $sqlItems = "SELECT 
                    id,
                    product_id,
                    product_name,
                    unit_price,
                    quantity,
                    subtotal,
                    created_at
                 FROM order_items
                 WHERE order_id = ?";
    $stmtItems = $db->prepare($sqlItems);
    $stmtItems->execute([$order_id]);
    $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

    // إضافة العناصر للرد
    $order['items'] = $items;

    jsonResponse(true, "Order details", $order);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
