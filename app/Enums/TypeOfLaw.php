<?php

namespace App\Enums;

enum TypeOfLaw: string
{
    case Resolution = 'resolution';
    case Ordinance = 'ordinance';
    case Minutes = 'minutes';
}
