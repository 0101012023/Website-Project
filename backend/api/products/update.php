<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

try {
    $db = Database::getConnection();

    if (
        empty($_POST['id']) ||
        empty($_POST['name']) ||
        empty($_POST['category_id']) ||
        empty($_POST['brand']) ||
        empty($_POST['price']) ||
        !isset($_POST['stock_quantity'])
    ) {
        jsonResponse(false, "Missing required fields");
    }

    $productId = (int) $_POST['id'];

    // Get current image
    $stmt = $db->prepare("SELECT main_image FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        jsonResponse(false, "Product not found");
    }

    $imageName = $product['main_image'];

    // New image upload (optional)
    if (!empty($_FILES['main_image']['name'])) {
        $newImage = time() . '_' . basename($_FILES['main_image']['name']);
        $uploadPath = __DIR__ . '/../../uploads/' . $newImage;

        if (!move_uploaded_file($_FILES['main_image']['tmp_name'], $uploadPath)) {
            jsonResponse(false, "Image upload failed");
        }

        // delete old image
        if ($imageName && file_exists(__DIR__ . '/../../uploads/' . $imageName)) {
            unlink(__DIR__ . '/../../uploads/' . $imageName);
        }

        $imageName = $newImage;
    }

    $isAvailable = ($_POST['stock_quantity'] > 0) ? 1 : 0;

    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $_POST['name'])));

    $sql = "UPDATE products SET
                name = :name,
                slug = :slug,
                category_id = :category_id,
                brand = :brand,
                description = :description,
                price = :price,
                stock_quantity = :stock_quantity,
                is_available = :is_available,
                main_image = :main_image,
                updated_at = NOW()
            WHERE id = :id";

    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':name' => $_POST['name'],
        ':slug' => $slug,
        ':category_id' => (int) $_POST['category_id'],
        ':brand' => $_POST['brand'],
        ':description' => $_POST['description'] ?? null,
        ':price' => (float) $_POST['price'],
        ':stock_quantity' => (int) $_POST['stock_quantity'],
        ':is_available' => $isAvailable,
        ':main_image' => $imageName,
        ':id' => $productId
    ]);

    jsonResponse(true, "Product updated successfully");

} catch (PDOException $e) {
    jsonResponse(false, "Error updating product");
}
