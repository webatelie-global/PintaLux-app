<?php
declare(strict_types=1);

require __DIR__ . '/app/bootstrap.php';

use PintaLux\Auth;
use PintaLux\Csrf;
use PintaLux\Database;
use PintaLux\Totp;

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function e(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function page(string $title, string $body): never {
    $title = e($title);
    echo '<!doctype html><html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'.$title.' · PintaLux</title><link rel="stylesheet" href="/assets/app.css"></head><body><main class="shell"><header class="top"><div class="brand">Pinta<span>Lux</span></div><div class="tag">SISÄINEN TYÖJÄRJESTELMÄ</div></header>'.$body.'<footer>© PintaLux · Luottamuksellinen</footer></main></body></html>';
    exit;
}
function formToken(): string { return '<input type="hidden" name="_csrf" value="'.e(Csrf::token()).'">'; }

if ($path === '/logout') {
    Auth::logout();
    header('Location: /login'); exit;
}

if ($path === '/login' && $method === 'GET') {
    if (Auth::user()) { header('Location: /'); exit; }
    page('Kirjaudu sisään', '<section class="panel narrow"><h1>Kirjaudu sisään</h1><p class="muted">Käytä yrityksen henkilökohtaista käyttäjätiliäsi.</p>'.(isset($_GET['error'])?'<p class="error">Kirjautuminen epäonnistui. Tarkista tiedot ja yritä uudelleen.</p>':'').'<form method="post" action="/login">'.formToken().'<label>Sähköposti<input name="email" type="email" autocomplete="username" required></label><label>Salasana<input name="password" type="password" autocomplete="current-password" required></label><button>Jatka</button></form></section>');
}

if ($path === '/login' && $method === 'POST') {
    Csrf::verify($_POST['_csrf'] ?? '');
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');
    $pdo = Database::connection();
    $stmt = $pdo->prepare('SELECT id,email,password_hash,role,is_active,totp_secret,totp_enabled FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user || !$user['is_active'] || !password_verify($password, $user['password_hash'])) {
        usleep(350000);
        header('Location: /login?error=1'); exit;
    }
    session_regenerate_id(true);
    $_SESSION['pending_2fa_user'] = (int)$user['id'];
    $_SESSION['pending_2fa_at'] = time();
    header('Location: /verify-2fa'); exit;
}

if ($path === '/verify-2fa' && $method === 'GET') {
    if (empty($_SESSION['pending_2fa_user']) || time() - (int)($_SESSION['pending_2fa_at'] ?? 0) > 300) {
        unset($_SESSION['pending_2fa_user'], $_SESSION['pending_2fa_at']);
        header('Location: /login'); exit;
    }
    page('Vahvista kirjautuminen', '<section class="panel narrow"><h1>Vahvista kirjautuminen</h1><p class="muted">Syötä tunnistussovelluksen kuusinumeroinen koodi.</p><form method="post" action="/verify-2fa">'.formToken().'<label>Vahvistuskoodi<input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required></label><button>Vahvista</button></form></section>');
}

if ($path === '/verify-2fa' && $method === 'POST') {
    Csrf::verify($_POST['_csrf'] ?? '');
    $pending = (int)($_SESSION['pending_2fa_user'] ?? 0);
    if (!$pending || time() - (int)($_SESSION['pending_2fa_at'] ?? 0) > 300) { header('Location: /login'); exit; }
    $stmt = Database::connection()->prepare('SELECT id,email,role,is_active,totp_secret,totp_enabled FROM users WHERE id=? LIMIT 1');
    $stmt->execute([$pending]); $user = $stmt->fetch();
    $code = preg_replace('/\D/', '', (string)($_POST['code'] ?? ''));
    if (!$user || !$user['is_active'] || !$user['totp_enabled'] || !Totp::verify((string)$user['totp_secret'], $code)) {
        usleep(350000); header('Location: /verify-2fa?error=1'); exit;
    }
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];
    unset($_SESSION['pending_2fa_user'], $_SESSION['pending_2fa_at']);
    header('Location: /'); exit;
}

if ($path === '/') {
    $user = Auth::requireUser();
    $roleLabels = ['ADMIN'=>'Ylläpito','TELE'=>'Telemarkkinointi','MYYJAT'=>'Myynti','ASENTAJAT'=>'Asentajat'];
    $sections = [
      'ADMIN'=>[['Käyttäjät ja käyttöoikeudet','Hallinnoi henkilökohtaisia tunnuksia ja rooleja'],['Asiakkaat ja kartoitukset','Asiakastiedot, tapaamiset ja mittauskäynnit'],['Tarjoukset ja sopimukset','Tarjous- ja sopimusasiakirjat'],['Työt ja kalenteri','Työtehtävät, aikataulut ja työntekijät'],['Laskutus ja talous','Laskut, ALV-laskurit ja matkalaskut']],
      'TELE'=>[['Asiakkaat','Asiakashankinta ja yhteydenotot'],['Kartoituskalenteri','Lisää kartoituskäyntejä kalenteriin']],
      'MYYJAT'=>[['Sopimuspohjat','Muokattavat sopimusmallit'],['Kotimyyntiasiakirja','Kotimyyntiin liittyvät asiakirjat'],['Kartoituspohja','Kartoituskäynnin lomake']],
      'ASENTAJAT'=>[['Oma kalenteri','Omat työtehtävät ja aikataulut'],['Omat kartoitukset ja työt','Vain sinulle osoitetut tehtävät']]
    ];
    $cards = '';
    foreach ($sections[$user['role']] ?? [] as [$name,$desc]) $cards .= '<article class="tile"><h2>'.e($name).'</h2><p>'.e($desc).'</p><span class="soon">Tulossa seuraavassa kehitysvaiheessa</span></article>';
    page('Etusivu', '<section class="welcome"><div><p class="eyebrow">TERVETULOA</p><h1>'.e($user['email']).'</h1><p class="muted">'.e($roleLabels[$user['role']] ?? 'Käyttäjä').'</p></div><a class="logout" href="/logout">Kirjaudu ulos</a></section><section class="grid">'.$cards.'</section>');
}

http_response_code(404);
page('Sivua ei löydy', '<section class="panel"><h1>404</h1><p>Sivua ei löydy.</p><a href="/">Takaisin etusivulle</a></section>');
