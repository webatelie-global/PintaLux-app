<?php
declare(strict_types=1);
namespace PintaLux;
use PDO;
use RuntimeException;

final class Database {
    private static ?PDO $pdo = null;
    public static function connection(): PDO {
        if (self::$pdo) return self::$pdo;
        $host = getenv('DB_HOST'); $name = getenv('DB_NAME');
        $user = getenv('DB_USER'); $pass = getenv('DB_PASSWORD');
        if (!$host || !$name || !$user || $pass === false) {
            throw new RuntimeException('Database environment is not configured.');
        }
        self::$pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES=>false,
        ]);
        return self::$pdo;
    }
}
