<?php
require_once __DIR__ . '/../../core/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

session_unset();
session_destroy();

jsonResponse(true, "Logged out successfully");
