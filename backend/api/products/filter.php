<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

try {
    $db = Database::getConnection();

    $conditions = [];
    $params = [];

    if (!empty($_GET['category_id'])) {
        $conditions[] = "category_id = :category_id";
        $params[':category_id'] = (int) $_GET['category_id'];
    }

    if (!empty($_GET['search'])) {
        $conditions[] = "name LIKE :search";
        $params[':search'] = '%' . $_GET['search'] . '%';
    }

    if (!empty($_GET['min_price'])) {
        $conditions[] = "price >= :min_price";
        $params[':min_price'] = (float) $_GET['min_price'];
    }

    if (!empty($_GET['max_price'])) {
        $conditions[] = "price <= :max_price";
        $params[':max_price'] = (float) $_GET['max_price'];
    }

    if (isset($_GET['is_available'])) {
        $conditions[] = "is_available = :is_available";
        $params[':is_available'] = (int) $_GET['is_available'];
    }

    $sql = "SELECT 
                id,
                name,
                slug,
                category_id,
                brand,
                price,
                stock_quantity,
                is_available,
                main_image,
                created_at
            FROM products";

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, "Filtered products", $products);

} catch (PDOException $e) {
    jsonResponse(false, "Filtering error");
}