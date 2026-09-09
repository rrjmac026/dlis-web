<?php

namespace App\Enums;

enum OrdinanceState: string
{
    case Draft = 'draft';
    case Passed = 'passed';
    case Enacted = 'enacted';
}
