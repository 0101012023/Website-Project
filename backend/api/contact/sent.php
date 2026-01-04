<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents("php://input"), true);

$customer_name  = trim($data['customer_name'] ?? '');
$customer_email = trim($data['customer_email'] ?? '');
$subject        = trim($data['subject'] ?? '');
$message        = trim($data['message'] ?? '');

if ($customer_name === '' || $customer_email === '' || $message === '') {
    jsonResponse(false, "Missing required fields");
}

try {
    $db = Database::getConnection();

    $stmt = $db->prepare("
        INSERT INTO contact_messages
        (customer_name, customer_email, subject, message, status, created_at)
        VALUES (?, ?, ?, ?, 'new', NOW())
    ");

    $stmt->execute([
        $customer_name,
        $customer_email,
        $subject,
        $message
    ]);

    jsonResponse(true, "Message sent successfully");

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
