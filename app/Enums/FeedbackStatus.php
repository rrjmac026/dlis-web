<?php

namespace App\Enums;

enum FeedbackStatus: string
{
    case Open = 'open';
    case Resolved = 'resolved';
}
