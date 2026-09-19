<?php

namespace App\Presentation\Filament\Seo\Pages;

use App\Presentation\Filament\Seo\SeoPageResource;
use Filament\Resources\Pages\EditRecord;

final class EditSeoPage extends EditRecord
{
    protected static string $resource = SeoPageResource::class;
}
