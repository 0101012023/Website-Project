<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

try {
    $db = Database::getConnection();

    $sql = "SELECT id, name, brand, price, stock_quantity, description, main_image
            FROM products
            WHERE stock_quantity > 0
            ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, "Liste des produits", $products);

} catch (Exception $e) {
    echo "PDO ERROR: " . $e->getMessage();
    exit;
}