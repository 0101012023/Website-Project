<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

$db = Database::getConnection();

$stmt = $db->query("
    SELECT 
        id,
        customer_name,
        customer_email,
        subject,
        message,
        admin_reply,
        status,
        created_at,
        replied_at
    FROM contact_messages
    ORDER BY created_at DESC
");

$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(true, "Messages list", $messages);
