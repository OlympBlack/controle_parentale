<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Pre-computed bcrypt hash used to simulate password checking when the user
     * is not found, preventing timing-based email enumeration attacks.
     */
    private const DUMMY_HASH = '$2y$12$LMPLBVXq1/Y3dVKHMo9iyOXLaVXU5tqVVKD5U5IIZQ6gXFQ8oFzCi';

    /**
     * Register a new parent account and issue a Sanctum token.
     *
     * @return array{user: User, token: string}
     */
    public function register(array $data, ?string $deviceName): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => mb_strtolower($data['email']),
            'password' => $data['password'],
            'phone'    => $data['phone'] ?? null,
            'locale'   => $data['locale']   ?? config('app.locale', 'fr'),
            'timezone' => $data['timezone'] ?? null,
        ]);

        $token = $user->createToken(
            $this->sanitizeDeviceName($deviceName),
            ['*'],
            $this->tokenExpiresAt()
        )->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Authenticate a user by email + password and issue a new token.
     * Returns null on any credential failure (no information leakage).
     *
     * @return array{user: User, token: string}|null
     */
    public function login(string $email, string $password, ?string $deviceName): ?array
    {
        $user = User::where('email', mb_strtolower($email))->first();

        // Always run Hash::check to ensure constant-time response regardless
        // of whether the email exists, preventing timing-based enumeration.
        $passwordValid = $user
            ? Hash::check($password, $user->password)
            : (Hash::check($password, self::DUMMY_HASH) && false);

        if (!$passwordValid) {
            return null;
        }

        $user->updateQuietly(['last_login_at' => now()]);

        $token = $user->createToken(
            $this->sanitizeDeviceName($deviceName),
            ['*'],
            $this->tokenExpiresAt()
        )->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Revoke only the token used for the current request.
     */
    public function revokeCurrentToken(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Revoke all tokens for the user (security incident, stolen device).
     */
    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Change the user's password after verifying the current one.
     * Revokes all other sessions except the current token.
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->update(['password' => $newPassword]);

        // Revoke all tokens except the current session to keep the user logged in.
        $user->tokens()
            ->where('id', '!=', $user->currentAccessToken()->id)
            ->delete();

        return true;
    }

    /**
     * Strip HTML tags, trim and truncate the device name to prevent injection.
     */
    private function sanitizeDeviceName(?string $name): string
    {
        if (empty($name)) {
            return 'unknown';
        }

        return mb_substr(strip_tags(trim($name)), 0, 255);
    }

    /**
     * Returns the token expiration date based on sanctum config, or null if tokens never expire.
     */
    private function tokenExpiresAt(): ?\DateTimeInterface
    {
        $minutes = config('sanctum.expiration');

        return $minutes ? now()->addMinutes($minutes) : null;
    }
}
