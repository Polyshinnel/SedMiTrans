<?php

namespace App\Presentation\Filament\Seo\Pages;

use App\Presentation\Filament\Seo\SeoPageResource;
use Filament\Resources\Pages\ListRecords;

final class ListSeoPages extends ListRecords
{
    protected static string $resource = SeoPageResource::class;
}
