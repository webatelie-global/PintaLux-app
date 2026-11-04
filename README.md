# PintaLux — application foundation

Private internal business application for PintaLux. Finnish UI, Black & Gold design.

## Current scope
This is the initial secure foundation, not the complete business system yet:
- PHP 8.3+ application structure for IONOS Deploy Now
- PDO/MariaDB connection
- password login with session hardening
- TOTP two-factor authentication (RFC 6238) with recovery-code support planned for the next security pass
- server-side role checks for ADMIN, TELE, MYYJAT, ASENTAJAT
- CSRF protection and login throttling foundation
- Finnish Black & Gold starter dashboard

## Important
Do not deploy this starter as a production system until:
1. database credentials are configured as deployment secrets (never commit them);
2. the first administrator is created securely;
3. HTTPS is active;
4. TOTP enrollment and recovery procedures have been tested;
5. backups, file upload validation, audit logging, and operational monitoring are configured.

## IONOS
Deploy Now supports PHP applications and provisions a MariaDB database for PHP projects.
See https://docs.ionos.space/docs/deploy-php-apps/ and https://docs.ionos.space/docs/database/.

## Local structure
- `index.php` — front controller
- `app/` — application code
- `database/schema.sql` — initial schema
- `storage/` — private runtime files; never serve publicly
- `.htaccess` — Apache hardening and routing

Configure environment variables in the IONOS deployment settings / GitHub Actions secrets:
- `APP_ENV=production`
- `APP_KEY` — long random secret (32+ bytes, hex recommended)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `SESSION_SECURE=true`

No real credentials belong in this repository.
