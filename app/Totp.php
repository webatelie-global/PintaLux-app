<?php
declare(strict_types=1);
namespace PintaLux;

/** RFC 6238 TOTP verification. Enrollment/QR provisioning will be added in the admin setup phase. */
final class Totp {
    public static function verify(string $base32Secret, string $code, int $window = 1): bool {
        if (!preg_match('/^\d{6}$/', $code) || $base32Secret === '') return false;
        $key = self::decodeBase32($base32Secret);
        if ($key === '') return false;
        $counter = intdiv(time(), 30);
        for ($i=-$window; $i<=$window; $i++) {
            $msg = pack('N*', 0) . pack('N*', $counter + $i);
            $hash = hash_hmac('sha1', $msg, $key, true);
            $offset = ord(substr($hash, -1)) & 0x0F;
            $binary = unpack('N', substr($hash, $offset, 4))[1] & 0x7fffffff;
            $otp = str_pad((string)($binary % 1000000), 6, '0', STR_PAD_LEFT);
            if (hash_equals($otp, $code)) return true;
        }
        return false;
    }
    private static function decodeBase32(string $input): string {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $input = strtoupper(rtrim($input, '='));
        $bits = '';
        foreach (str_split($input) as $char) {
            $pos = strpos($alphabet, $char);
            if ($pos === false) return '';
            $bits .= str_pad(decbin($pos), 5, '0', STR_PAD_LEFT);
        }
        $out = '';
        foreach (str_split($bits, 8) as $byte) if (strlen($byte) === 8) $out .= chr(bindec($byte));
        return $out;
    }
}
