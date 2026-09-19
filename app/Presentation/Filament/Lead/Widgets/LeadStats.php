<?php

namespace App\Presentation\Filament\Lead\Widgets;

use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use App\Presentation\Filament\Lead\LeadResource;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

final class LeadStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Запросы обратной связи', LeadRecord::query()->where('type', 'feedback')->count())
                ->description('Открыть список запросов')->url(LeadResource::getUrl('index', ['tableFilters' => ['type' => ['value' => 'feedback']]]))->color('info'),
            Stat::make('Запросы расчёта', LeadRecord::query()->where('type', 'quote')->count())
                ->description('Открыть список расчётов')->url(LeadResource::getUrl('index', ['tableFilters' => ['type' => ['value' => 'quote']]]))->color('warning'),
        ];
    }
}
