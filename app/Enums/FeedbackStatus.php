<?php

namespace App\Enums;

enum FeedbackStatus: int
{
    case Open = 0;
    case Resolved = 1;
}