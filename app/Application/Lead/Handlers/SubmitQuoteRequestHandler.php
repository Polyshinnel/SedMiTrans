<?php

namespace App\Application\Lead\Handlers;

use App\Application\Lead\Commands\SubmitQuoteRequest;
use App\Application\Lead\Exceptions\IdempotencyConflict;
use App\Domain\Lead\Contracts\DomainEventPublisher;
use App\Domain\Lead\Contracts\LeadRepository;
use App\Domain\Lead\Entities\Lead;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final readonly class SubmitQuoteRequestHandler
{
    public function __construct(private LeadRepository $leads, private DomainEventPublisher $events) {}

    public function handle(SubmitQuoteRequest $command): Lead
    {
        [$lead, $events] = DB::transaction(function () use ($command): array {
            $existing = $this->leads->findByIdempotencyKey($command->idempotencyKey);

            if ($existing !== null) {
                if (! $existing->hasSameSubmission($command->name, $command->phone, $command->email, $command->message)) {
                    throw new IdempotencyConflict('Idempotency key is already used for another request.');
                }

                return [$existing, []];
            }

            $lead = Lead::submit((string) Str::ulid(), $command->idempotencyKey, $command->name, $command->phone, $command->email, $command->message, new \DateTimeImmutable, $command->requestId);
            $this->leads->save($lead);

            return [$lead, $lead->releaseEvents()];
        });

        // First release compromise: synchronous after-commit publishing. Replace with an outbox before adding external consumers.
        $this->events->publish($events);

        return $lead;
    }
}
