<?php

namespace App\Enums;

enum OrdinanceStatus: string
{
    case InEffect = 'in_effect';
    case Amended = 'amended';
    case Superseded = 'superseded';
    case Repealed = 'repealed';
    case UnderReview = 'under_review';
}
