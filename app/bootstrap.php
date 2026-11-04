<?php
declare(strict_types=1);

require_once __DIR__.'/Database.php';
require_once __DIR__.'/Auth.php';
require_once __DIR__.'/Csrf.php';
require_once __DIR__.'/Totp.php';

$secure = (($_ENV['SESSION_SECURE'] ?? getenv('SESSION_SECURE') ?: 'true') === 'true');
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_set_cookie_params([
 'lifetime'=>0, 'path'=>'/', 'domain'=>'',
 'secure'=>$secure, 'httponly'=>true, 'samesite'=>'Lax'
]);
session_start();

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header("Content-Security-Policy: default-src 'self'; style-src 'self'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'self'");
