<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/response.php';

/**
 * التحقق من تسجيل دخول الأدمن
 */
function requireAdminAuth()
{
    if (!isset($_SESSION['admin_id'])) {
        jsonResponse(false, "Unauthorized access");
        exit;
    }
}

/**
 * إرجاع معلومات الأدمن الحالي (اختياري)
 */
function getAuthenticatedAdmin()
{
    if (!isset($_SESSION['admin_id'])) {
        return null;
    }

    return [
        'id' => $_SESSION['admin_id'],
        'email' => $_SESSION['admin_email'] ?? null,
        'name' => $_SESSION['admin_name'] ?? null
    ];
}
