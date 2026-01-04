
<?php
require_once "../config/database.php";
require_once "../core/response.php";

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    jsonResponse(true, "Connexion à la base de données réussie");
} else {
    jsonResponse(false, "Échec de connexion");
}