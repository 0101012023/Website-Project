<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents('php://input'), true);

$order_id   = $data['order_id'] ?? null;
$new_status = $data['status'] ?? null;

if (!$order_id || !$new_status) {
    jsonResponse(false, "Order ID and new status are required");
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        UPDATE orders 
        SET status = ?, updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$new_status, $order_id]);

    if ($stmt->rowCount() > 0) {
        jsonResponse(true, "Order status updated successfully", [
            'order_id' => $order_id,
            'status'   => $new_status
        ]);
    } else {
        jsonResponse(false, "Order not found or status unchanged");
    }

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
