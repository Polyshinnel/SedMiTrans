<?php

namespace App\Presentation\Filament\Lead\Pages;

use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use App\Presentation\Filament\Lead\LeadResource;
use Filament\Resources\Pages\ViewRecord;

final class ViewLead extends ViewRecord
{
    protected static string $resource = LeadResource::class;

    public function mount(int|string $record): void
    {
        parent::mount($record);
        /** @var LeadRecord $lead */
        $lead = $this->getRecord();
        if ($lead->status !== 'read') {
            $lead->forceFill(['status' => 'read', 'read_at' => now()])->save();
            $this->record = $lead->fresh();
        }
    }
}
