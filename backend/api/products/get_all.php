<?php
require_once __DIR__ . '/../../config/database.php';

// دالة لإرسال JSON للـ frontend
function jsonResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);
    exit;
}

try {
    $db = Database::getConnection();

    $sql = "SELECT 
                id,
                name,
                brand,
                price,
                stock_quantity,
                description,
                main_image,
                gallery_images,
                created_at,
                updated_at
            FROM products
            ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, "Liste des produits", $products);

} catch (Exception $e) {
    jsonResponse(false, "Erreur lors du chargement des produits: " . $e->getMessage());
}
