<?php

namespace App\Application\Lead\Handlers;

use App\Application\Identity\Contracts\AccessChecker;
use App\Application\Identity\Contracts\AuditLogger;
use App\Application\Lead\Commands\ChangeLeadStatus;
use App\Application\Lead\Exceptions\LeadNotFound;
use App\Domain\Lead\Contracts\LeadRepository;
use App\Domain\Lead\Contracts\LeadFinder;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

final readonly class ChangeLeadStatusHandler
{
    public function __construct(private LeadRepository $leads, private LeadFinder $finder, private AccessChecker $access, private AuditLogger $audit) {}

    public function handle(ChangeLeadStatus $command): void
    {
        if (! $this->access->hasPermission($command->actorId, 'lead.change-status')) throw new AuthorizationException('Недостаточно прав для изменения статуса заявки.');
        DB::transaction(function () use ($command): void {
            $lead = $this->finder->findById($command->leadId) ?? throw new LeadNotFound('Заявка не найдена.');
            $from = $lead->status; $lead->changeStatus($command->targetStatus); $this->leads->save($lead);
            $this->audit->record($command->actorId, 'lead.status_changed', 'lead', $lead->id, ['status' => ['from' => $from, 'to' => $lead->status]]);
        });
    }
}
