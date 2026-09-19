<?php

namespace App\Presentation\Filament\Cases\Pages;

use App\Presentation\Filament\Cases\CasesResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

final class ListCases extends ListRecords
{
    protected static string $resource = CasesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Создать кейс'),
        ];
    }
}
