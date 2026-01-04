<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

try {
    $db = Database::getConnection();

    if (!$db) {
        jsonResponse(false, "Database connection failed");
    }

    $sql = "
        SELECT 
            id,
            name,
            created_at
        FROM categories
        ORDER BY name ASC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(true, "Categories list", $categories);

} catch (PDOException $e) {
    jsonResponse(false, "Error loading categories");
}