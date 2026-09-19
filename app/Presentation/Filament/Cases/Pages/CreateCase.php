<?php

namespace App\Presentation\Filament\Cases\Pages;

use App\Presentation\Filament\Cases\CasesResource;
use Filament\Resources\Pages\CreateRecord;

final class CreateCase extends CreateRecord
{
    protected static string $resource = CasesResource::class;
}
