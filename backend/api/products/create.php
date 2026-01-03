<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

try {
    $db = Database::getConnection();

    // Required fields
    if (
        empty($_POST['name']) ||
        empty($_POST['category_id']) ||
        empty($_POST['brand']) ||
        empty($_POST['price']) ||
        !isset($_POST['stock_quantity'])
    ) {
        jsonResponse(false, "Missing required fields");
    }

    // Image upload
    if (empty($_FILES['main_image']['name'])) {
        jsonResponse(false, "Main image is required");
    }

    $imageName = time() . '_' . basename($_FILES['main_image']['name']);
    $uploadPath = __DIR__ . '/../../uploads/' . $imageName;

    if (!move_uploaded_file($_FILES['main_image']['tmp_name'], $uploadPath)) {
        jsonResponse(false, "Image upload failed");
    }

    $isAvailable = ($_POST['stock_quantity'] > 0) ? 1 : 0;

    $sql = "INSERT INTO products (
                name,
                slug,
                category_id,
                brand,
                description,
                price,
                stock_quantity,
                is_available,
                main_image,
                created_at,
                updated_at
            ) VALUES (
                :name,
                :slug,
                :category_id,
                :brand,
                :description,
                :price,
                :stock_quantity,
                :is_available,
                :main_image,
                NOW(),
                NOW()
            )";

    $stmt = $db->prepare($sql);

    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $_POST['name'])));

    $stmt->execute([
        ':name' => $_POST['name'],
        ':slug' => $slug,
        ':category_id' => (int) $_POST['category_id'],
        ':brand' => $_POST['brand'],
        ':description' => $_POST['description'] ?? null,
        ':price' => (float) $_POST['price'],
        ':stock_quantity' => (int) $_POST['stock_quantity'],
        ':is_available' => $isAvailable,
        ':main_image' => $imageName
    ]);

    jsonResponse(true, "Product created successfully");

} catch (PDOException $e) {
    jsonResponse(false, "Error creating product");
}
