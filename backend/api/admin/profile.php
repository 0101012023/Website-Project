<?php
require_once __DIR__ . '/../../core/response.php';
require_once __DIR__ . '/../../core/auth.php';

requireAdminAuth();

jsonResponse(true, "Admin profile", [
    "admin" => $_SESSION['admin']
]);
