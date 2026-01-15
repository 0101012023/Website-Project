
<?php
class Database {
    private static $conn = null;

    private static $host = "localhost";
    private static $db_name = "site_e_commerce";
    private static $username = "root";
    private static $password = "";

    public static function getConnection() {
        if (self::$conn === null) {
            try {
                self::$conn = new PDO(
                    "mysql:host=" . self::$host . ";dbname=" . self::$db_name . ";charset=utf8",
                    self::$username,
                    self::$password
                );
                self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(PDOException $exception) {
                die("Database connection error: " . $exception->getMessage());
            }
        }
        return self::$conn;
    }
}