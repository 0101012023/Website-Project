<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../../config/database.php'; // تأكدي من مسار قاعدة البيانات

try {
    $pdo = Database::connect(); // نفترض عندك class Database مع connect()

    // جلب كل المنتجات
    $stmt = $pdo->prepare("SELECT * FROM products ORDER BY id ASC");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // تقسيم المنتجات
    $topProducts = array_slice($products, 0, 6);    // Top 6
    $newProducts = array_slice($products, -6);      // آخر 6 -> New

    echo json_encode([
        "success" => true,
        "data" => [
            "top" => $topProducts,
            "new" => $newProducts
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
