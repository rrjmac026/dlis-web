<?php

namespace App\Enums;

enum FinalAction: string
{
    case Approving = 'approving';
    case Authorizing = 'authorizing';
    case Creating = 'creating';
    case Declaring = 'declaring';
    case Conducting = 'conducting';
    case Extending = 'extending';
}
