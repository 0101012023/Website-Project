<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    jsonResponse(false, "Product ID is required");
}

$productId = (int) $_GET['id'];

try {
    $db = Database::getConnection();

    $sql = "SELECT 
                id,
                name,
                slug,
                category_id,
                brand,
                short_description,
                description,
                specifications,
                price,
                stock_quantity,
                is_available,
                main_image,
                gallery_images,
                created_at
            FROM products
            WHERE id = :id
            LIMIT 1";

    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id', $productId, PDO::PARAM_INT);
    $stmt->execute();

    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        jsonResponse(false, "Product not found");
    }

    jsonResponse(true, "Product details", $product);

} catch (PDOException $e) {
    jsonResponse(false, "Database error");
}



