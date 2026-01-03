<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';
require_once __DIR__ . '/../../config/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents("php://input"), true);

$message_id  = $data['message_id'] ?? null;
$admin_reply = trim($data['admin_reply'] ?? '');
$admin_id    = $data['admin_id'] ?? 1; // أدمن واحد

if (!$message_id || $admin_reply === '') {
    jsonResponse(false, "Message ID and reply are required");
}

try {
    $db = Database::getConnection();

    // 1️⃣ جلب إيميل الزبون
    $stmt = $db->prepare("SELECT customer_email FROM contact_messages WHERE id = ?");
    $stmt->execute([$message_id]);
    $message = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$message) {
        jsonResponse(false, "Message not found");
    }

    $customer_email = $message['customer_email'];

    // 2️⃣ تحديث الرسالة
    $stmt = $db->prepare("
        UPDATE contact_messages
        SET 
            admin_reply = ?,
            replied_by = ?,
            replied_at = NOW(),
            status = 'replied'
        WHERE id = ?
    ");

    $stmt->execute([
        $admin_reply,
        $admin_id,
        $message_id
    ]);

    // 3️⃣ إرسال الرد بالإيميل
    sendMail(
        $customer_email,
        "Reply from Smart Store",
        $admin_reply
    );

    jsonResponse(true, "Reply sent successfully");

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
