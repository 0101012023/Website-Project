<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents("php://input"), true);

$wilaya        = trim($data['wilaya'] ?? '');
$delivery_type = trim($data['delivery_type'] ?? '');
$items         = $data['items'] ?? [];

if ($wilaya === '' || $delivery_type === '' || empty($items)) {
    jsonResponse(false, "Invalid cart data");
}

try {
    $db = Database::getConnection();

    $products_total = 0;
    $calculated_items = [];

    foreach ($items as $item) {
        $product_id = $item['product_id'] ?? null;
        $quantity   = (int)($item['quantity'] ?? 0);

        if (!$product_id || $quantity <= 0) {
            jsonResponse(false, "Invalid product data");
        }

        $stmt = $db->prepare("
            SELECT id, name, price, stock_quantity
            FROM products
            WHERE id = ? AND is_active = 1
        ");
        $stmt->execute([$product_id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            jsonResponse(false, "Product not found");
        }

        if ($quantity > $product['stock_quantity']) {
            jsonResponse(false, "Only {$product['stock_quantity']} items available for {$product['name']}");
        }

        $subtotal = $product['price'] * $quantity;
        $products_total += $subtotal;

        $calculated_items[] = [
            'product_id' => $product_id,
            'name'       => $product['name'],
            'unit_price'=> $product['price'],
            'quantity'  => $quantity,
            'subtotal'  => $subtotal
        ];
    }

    // حساب سعر التوصيل
    $stmt = $db->prepare("
        SELECT price
        FROM delivery_prices
        WHERE wilaya = ? AND delivery_type = ? AND is_active = 1
        LIMIT 1
    ");
    $stmt->execute([$wilaya, $delivery_type]);
    $delivery = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$delivery) {
        jsonResponse(false, "Delivery price not defined for this wilaya");
    }

    $delivery_price = (float)$delivery['price'];
    $total_price    = $products_total + $delivery_price;

    jsonResponse(true, "Cart calculated successfully", [
        'items'          => $calculated_items,
        'products_total'=> $products_total,
        'delivery_price'=> $delivery_price,
        'total_price'   => $total_price
    ]);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
