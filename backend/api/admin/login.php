<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

// قراءة بيانات الطلب
$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(false, "Email and password are required");
}

try {
    $db = Database::getConnection();

    // جلب الأدمن
    $stmt = $db->prepare("
        SELECT id, username, email, password_hash, role, is_active
        FROM admins
        WHERE email = ?
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin) {
        jsonResponse(false, "Invalid credentials");
    }

    if ((int)$admin['is_active'] !== 1) {
        jsonResponse(false, "Account is disabled");
    }

    if (!password_verify($password, $admin['password_hash'])) {
        jsonResponse(false, "Invalid credentials");
    }

    // إنشاء Session
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['admin_name'] = $admin['username'];
    $_SESSION['admin_role'] = $admin['role'];

    // تحديث آخر تسجيل دخول
    $stmt = $db->prepare("UPDATE admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = ?");
    $stmt->execute([$admin['id']]);

    jsonResponse(true, "Login successful", [
        'admin' => [
            'id' => $admin['id'],
            'username' => $admin['username'],
            'email' => $admin['email'],
            'role' => $admin['role']
        ]
    ]);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
