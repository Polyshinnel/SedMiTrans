<?php

namespace App\Application\Lead\Handlers;

use App\Application\Lead\Commands\SubmitFeedbackRequest;
use App\Application\Lead\Commands\SubmitQuoteRequest;
use App\Domain\Lead\Entities\Lead;
use App\Domain\Lead\Contracts\DomainEventPublisher;
use App\Domain\Lead\Contracts\LeadRepository;

final readonly class SubmitFeedbackRequestHandler
{
    public function __construct(private LeadRepository $leads, private DomainEventPublisher $events) {}

    public function handle(SubmitFeedbackRequest $command): Lead
    {
        return (new SubmitQuoteRequestHandler($this->leads, $this->events))->handle(new SubmitQuoteRequest(
            $command->idempotencyKey,
            $command->name,
            $command->phone,
            $command->email,
            $command->message,
            null,
            null,
            null,
            $command->requestId,
            'feedback',
        ));
    }
}
