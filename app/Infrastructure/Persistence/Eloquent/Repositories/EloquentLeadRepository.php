<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Lead\Contracts\LeadFinder;
use App\Domain\Lead\Contracts\LeadRepository;
use App\Domain\Lead\Entities\Lead;
use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;

final class EloquentLeadRepository implements LeadRepository, LeadFinder
{
    public function save(Lead $lead): void
    {
        $record = LeadRecord::query()->find($lead->id) ?? new LeadRecord;
        $record->id = $lead->id;
        $record->forceFill([
            'idempotency_key' => $lead->idempotencyKey,
            'type' => $lead->type,
            'name' => $lead->name->value,
            'phone' => $lead->phone->value,
            'email' => $lead->email?->value,
            'message' => $lead->message?->value,
            'cargo' => $lead->cargo,
            'route' => $lead->route,
            'cargo_parameters' => $lead->cargoParameters,
            'status' => $lead->status === 'submitted' ? 'new' : $lead->status,
            'read_at' => $lead->readAt,
            'submitted_at' => $lead->submittedAt,
        ]);
        $record->save();
    }

    public function findByIdempotencyKey(string $key): ?Lead
    {
        $record = LeadRecord::query()->where('idempotency_key', $key)->first();

        return $record === null ? null : $this->map($record);
    }

    public function findById(string $id): ?Lead
    {
        $record = LeadRecord::query()->find($id);

        return $record === null ? null : $this->map($record);
    }

    private function map(LeadRecord $record): Lead
    {
        return Lead::reconstitute($record->id, $record->idempotency_key, $record->type ?? 'quote', $record->name, $record->phone, $record->email, $record->message, $record->cargo, $record->route, $record->cargo_parameters, $record->status, \DateTimeImmutable::createFromInterface($record->submitted_at), $record->read_at ? \DateTimeImmutable::createFromInterface($record->read_at) : null);
    }
}
