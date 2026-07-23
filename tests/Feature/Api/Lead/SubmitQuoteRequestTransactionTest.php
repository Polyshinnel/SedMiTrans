<?php

namespace Tests\Feature\Api\Lead;

use App\Application\Lead\Commands\SubmitQuoteRequest;
use App\Application\Lead\Handlers\SubmitQuoteRequestHandler;
use App\Domain\Lead\Contracts\DomainEventPublisher;
use App\Domain\Lead\Contracts\LeadRepository;
use App\Domain\Lead\Entities\Lead;
use Tests\TestCase;

final class SubmitQuoteRequestTransactionTest extends TestCase
{
    public function test_it_does_not_publish_an_event_when_persistence_rolls_back(): void
    {
        $repository = new class implements LeadRepository
        {
            public function save(Lead $lead): void
            {
                throw new \RuntimeException('Database write failed.');
            }

            public function findByIdempotencyKey(string $key): ?Lead
            {
                return null;
            }
        };
        $publisher = new class implements DomainEventPublisher
        {
            public array $published = [];

            public function publish(array $events): void
            {
                $this->published = $events;
            }
        };

        try {
            (new SubmitQuoteRequestHandler($repository, $publisher))->handle(new SubmitQuoteRequest('rollback-1', 'Alice', '+79991234567', null, null));
            self::fail('Expected persistence exception.');
        } catch (\RuntimeException) {
            self::assertSame([], $publisher->published);
        }
    }
}
