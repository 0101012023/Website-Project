<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

try {
    $db = Database::getConnection();

    if (empty($_POST['id'])) {
        jsonResponse(false, "Product ID is required");
    }

    $productId = (int) $_POST['id'];

    // Get product and image name
    $stmt = $db->prepare("SELECT main_image FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        jsonResponse(false, "Product not found");
    }

    $imageName = $product['main_image'];

    // Delete product from database
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$productId]);

    // Delete image file if exists
    if ($imageName && file_exists(__DIR__ . '/../../uploads/' . $imageName)) {
        unlink(__DIR__ . '/../../uploads/' . $imageName);
    }

    jsonResponse(true, "Product deleted successfully");

} catch (PDOException $e) {
    jsonResponse(false, "Error deleting product");
}
