<?php

namespace App\Enums;

enum UserRole: string
{
    case Patient = 'patient';
    case Staff = 'staff';
    case Manager = 'manager';

    /** Landing page after login. */
    public function home(): string
    {
        return match ($this) {
            self::Patient => '/',
            self::Staff => '/petugas',
            self::Manager => '/manajemen',
        };
    }
}
