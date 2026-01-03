<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, "Invalid request method");
}

try {
    $db = Database::getConnection();

    $sql = "SELECT 
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
            ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, "Orders list", $orders);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
