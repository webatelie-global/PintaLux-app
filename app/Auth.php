<?php
declare(strict_types=1);
namespace PintaLux;

final class Auth {
    public static function user(): ?array {
        $id = (int)($_SESSION['user_id'] ?? 0);
        if (!$id) return null;
        $stmt = Database::connection()->prepare('SELECT id,email,role,is_active FROM users WHERE id=? LIMIT 1');
        $stmt->execute([$id]); $user = $stmt->fetch();
        if (!$user || !$user['is_active']) { self::logout(); return null; }
        return $user;
    }
    public static function requireUser(): array {
        $user = self::user();
        if (!$user) { header('Location: /login'); exit; }
        return $user;
    }
    public static function requireRole(array $roles): array {
        $user = self::requireUser();
        if (!in_array($user['role'], $roles, true)) { http_response_code(403); exit('Ei käyttöoikeutta.'); }
        return $user;
    }
    public static function logout(): void {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time()-42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
    }
}
