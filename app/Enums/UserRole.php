<?php

namespace App\Enums;

enum UserRole: int
{
    case Viewer = 0;
    case Encoder = 1;
    case Admin = 2;
    case SuperAdmin = 3;
}
