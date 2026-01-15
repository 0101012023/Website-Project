<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'] ?? null;

if (!$order_id) {
    jsonResponse(false, "Order ID is required");
}

try {
    $db = Database::getConnection();

    // حذف عناصر الطلب أولًا (order_items)
    $stmtItems = $db->prepare("DELETE FROM order_items WHERE order_id = ?");
    $stmtItems->execute([$order_id]);

    // حذف الطلب نفسه
    $stmtOrder = $db->prepare("DELETE FROM orders WHERE id = ?");
    $stmtOrder->execute([$order_id]);

    if ($stmtOrder->rowCount() > 0) {
        jsonResponse(true, "Order deleted successfully", ['order_id' => $order_id]);
    } else {
        jsonResponse(false, "Order not found");
    }

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
