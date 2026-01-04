<?php
$data = [
    "email" => "aymen@gmail.com",
    "password" => "admin123"  // تأكد أن هذا هو الباسورد الصحيح
];

$ch = curl_init('http://localhost/Website-Project/api/admin/login.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
