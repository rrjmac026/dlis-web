<?php

namespace App\Enums;

enum FeedbackType: int
{
    case Bug = 0;
    case Concern = 1;
    case Suggestion = 2;
}