<?php

namespace App\Domain\Lead\Entities;

use App\Domain\Lead\Events\DomainEvent;
use App\Domain\Lead\Events\LeadSubmitted;
use App\Domain\Lead\Exceptions\InvalidLeadData;
use App\Domain\Lead\ValueObjects\Email;
use App\Domain\Lead\ValueObjects\Message;
use App\Domain\Lead\ValueObjects\Name;
use App\Domain\Lead\ValueObjects\Phone;

final class Lead
{
    public const STATUS_SUBMITTED = 'submitted';

    /** @var list<DomainEvent> */
    private array $recordedEvents = [];

    private function __construct(
        public readonly string $id,
        public readonly string $idempotencyKey,
        public readonly Name $name,
        public readonly Phone $phone,
        public readonly ?Email $email,
        public readonly ?Message $message,
        public string $status,
        public readonly \DateTimeImmutable $submittedAt,
        ?string $requestId,
        bool $recordEvent,
    ) {
        if ($recordEvent) {
            $this->recordedEvents[] = new LeadSubmitted($this->id, $this->submittedAt, $requestId);
        }
    }

    public static function submit(string $id, string $idempotencyKey, string $name, string $phone, ?string $email, ?string $message, \DateTimeImmutable $submittedAt, ?string $requestId = null): self
    {
        $idempotencyKey = trim($idempotencyKey);
        if ($idempotencyKey === '' || mb_strlen($idempotencyKey) > 128) {
            throw new InvalidLeadData('Idempotency key must contain from 1 to 128 characters.');
        }

        return new self($id, $idempotencyKey, Name::fromString($name), Phone::fromString($phone), Email::fromNullable($email), Message::fromNullable($message), self::STATUS_SUBMITTED, $submittedAt, $requestId, true);
    }

    public static function reconstitute(string $id, string $idempotencyKey, string $name, string $phone, ?string $email, ?string $message, string $status, \DateTimeImmutable $submittedAt): self
    {
        return new self($id, $idempotencyKey, Name::fromString($name), Phone::fromString($phone), Email::fromNullable($email), Message::fromNullable($message), $status, $submittedAt, null, false);
    }

    /** @return list<DomainEvent> */
    public function releaseEvents(): array
    {
        $events = $this->recordedEvents;
        $this->recordedEvents = [];

        return $events;
    }

    public function hasSameSubmission(string $name, string $phone, ?string $email, ?string $message): bool
    {
        return $this->name->value === Name::fromString($name)->value
            && $this->phone->value === Phone::fromString($phone)->value
            && $this->email?->value === Email::fromNullable($email)?->value
            && $this->message?->value === Message::fromNullable($message)?->value;
    }

    public function changeStatus(string $targetStatus): void
    {
        $transitions = [self::STATUS_SUBMITTED => ['in_progress', 'rejected'], 'in_progress' => ['completed', 'rejected'], 'completed' => [], 'rejected' => []];
        if (! in_array($targetStatus, $transitions[$this->status] ?? [], true)) {
            throw new InvalidLeadData("Status transition from {$this->status} to {$targetStatus} is not allowed.");
        }
        $this->status = $targetStatus;
    }
}
