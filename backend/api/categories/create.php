<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents("php://input"), true);

$name        = trim($data['name'] ?? '');
$description = trim($data['description'] ?? '');

if ($name === '') {
    jsonResponse(false, "Category name is required");
}

try {
    $db = Database::getConnection();

    // منع التكرار
    $stmt = $db->prepare("SELECT id FROM categories WHERE name = ?");
    $stmt->execute([$name]);

    if ($stmt->fetch()) {
        jsonResponse(false, "Category already exists");
    }

    $stmt = $db->prepare("
        INSERT INTO categories (name, description, created_at)
        VALUES (?, ?, NOW())
    ");
    $stmt->execute([$name, $description]);

    jsonResponse(true, "Category created successfully");

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
