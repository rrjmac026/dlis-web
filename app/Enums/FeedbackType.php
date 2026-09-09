<?php

namespace App\Enums;

enum FeedbackType: string
{
    case Bug = 'bug';
    case Concern = 'concern';
    case Suggestion = 'suggestion';
}
