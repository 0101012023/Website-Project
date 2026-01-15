<?php
header('Content-Type: application/json; charset=UTF-8');

echo json_encode([
    'success' => false,
    'message' => 'Direct access is not allowed',
    'data'    => null
]);
exit;
