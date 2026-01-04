<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Invalid request method");
}

$data = json_decode(file_get_contents('php://input'), true);

$customer_first_name = $data['customer_first_name'] ?? '';
$customer_last_name  = $data['customer_last_name'] ?? '';
$customer_email      = $data['customer_email'] ?? '';
$customer_phone      = $data['customer_phone'] ?? '';
$customer_address    = $data['customer_address'] ?? '';
$wilaya              = $data['wilaya'] ?? '';
$delivery_type       = $data['delivery_type'] ?? '';
$products            = $data['products'] ?? [];

if (empty($customer_first_name) || empty($customer_email) || empty($products)) {
    jsonResponse(false, "Missing required fields");
}

try {
    $db = Database::getConnection();
    $db->beginTransaction();

    $products_total = 0;
    $order_items = [];

    foreach ($products as $p) {
        $stmt = $db->prepare("SELECT id, name, price, stock_quantity FROM products WHERE id = ?");
        $stmt->execute([$p['id']]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception("Product ID {$p['id']} not found");
        }

        if ($p['quantity'] > $product['stock_quantity']) {
            throw new Exception(
                "Insufficient stock for {$product['name']}. Available: {$product['stock_quantity']}"
            );
        }

        $subtotal = $product['price'] * $p['quantity'];
        $products_total += $subtotal;

        $order_items[] = [
            'product_id'   => $product['id'],
            'product_name' => $product['name'],
            'unit_price'   => $product['price'],
            'quantity'     => $p['quantity'],
            'subtotal'     => $subtotal
        ];
    }

    // سعر التوصيل
    $stmt = $db->prepare(
        "SELECT price FROM delivery_prices 
         WHERE wilaya = ? AND delivery_type = ? AND is_active = 1 
         LIMIT 1"
    );
    $stmt->execute([$wilaya, $delivery_type]);
    $delivery = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$delivery) {
        throw new Exception("Delivery price not found for this wilaya and type");
    }

    $delivery_price = $delivery['price'];
    $total_price = $products_total + $delivery_price;

    $order_reference = 'ORD-' . strtoupper(uniqid());

    $stmt = $db->prepare("
        INSERT INTO orders (
            order_reference,
            customer_first_name,
            customer_last_name,
            customer_email,
            customer_phone,
            customer_address,
            wilaya,
            delivery_type,
            products_total,
            delivery_price,
            total_price,
            status,
            created_at,
            updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW()
        )
    ");

    $stmt->execute([
        $order_reference,
        $customer_first_name,
        $customer_last_name,
        $customer_email,
        $customer_phone,
        $customer_address,
        $wilaya,
        $delivery_type,
        $products_total,
        $delivery_price,
        $total_price
    ]);

    $order_id = $db->lastInsertId();

    foreach ($order_items as $item) {
        $stmt = $db->prepare("
            INSERT INTO order_items (
                order_id,
                product_id,
                product_name,
                unit_price,
                quantity,
                subtotal,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");

        $stmt->execute([
            $order_id,
            $item['product_id'],
            $item['product_name'],
            $item['unit_price'],
            $item['quantity'],
            $item['subtotal']
        ]);

        $stmt = $db->prepare(
            "UPDATE products 
             SET stock_quantity = stock_quantity - ? 
             WHERE id = ?"
        );
        $stmt->execute([$item['quantity'], $item['product_id']]);
    }

    $db->commit();

    jsonResponse(true, "Order created successfully", [
        'order_id'        => $order_id,
        'order_reference'=> $order_reference,
        'total_price'    => $total_price
    ]);

} catch (Exception $e) {
    $db->rollBack();
    jsonResponse(false, $e->getMessage());
}
