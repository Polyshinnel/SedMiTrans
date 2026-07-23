<?php

namespace App\Presentation\Filament\Lead\Pages;

use App\Presentation\Filament\Lead\LeadResource;
use Filament\Resources\Pages\ListRecords;

final class ListLeads extends ListRecords
{
    protected static string $resource = LeadResource::class;
}
