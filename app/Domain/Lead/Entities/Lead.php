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
        public readonly string $type,
        public readonly Name $name,
        public readonly Phone $phone,
        public readonly ?Email $email,
        public readonly ?Message $message,
        public readonly ?string $cargo,
        public readonly ?string $route,
        public readonly ?string $cargoParameters,
        public string $status,
        public readonly \DateTimeImmutable $submittedAt,
        public ?\DateTimeImmutable $readAt,
        ?string $requestId,
        bool $recordEvent,
    ) {
        if ($recordEvent) {
            $this->recordedEvents[] = new LeadSubmitted($this->id, $this->submittedAt, $requestId);
        }
    }

    public static function submit(string $id, string $idempotencyKey, string $name, string $phone, ?string $email, ?string $message, \DateTimeImmutable $submittedAt, ?string $requestId = null, string $type = 'quote', ?string $cargo = null, ?string $route = null, ?string $cargoParameters = null): self
    {
        $idempotencyKey = trim($idempotencyKey);
        if ($idempotencyKey === '' || mb_strlen($idempotencyKey) > 128) {
            throw new InvalidLeadData('Idempotency key must contain from 1 to 128 characters.');
        }

        if (! in_array($type, ['quote', 'feedback'], true)) {
            throw new InvalidLeadData('Lead type must be quote or feedback.');
        }

        return new self($id, $idempotencyKey, $type, Name::fromString($name), Phone::fromString($phone), Email::fromNullable($email), Message::fromNullable($message), self::nullableText($cargo), self::nullableText($route), self::nullableText($cargoParameters), self::STATUS_SUBMITTED, $submittedAt, null, $requestId, true);
    }

    public static function reconstitute(string $id, string $idempotencyKey, string $type, string $name, string $phone, ?string $email, ?string $message, ?string $cargo, ?string $route, ?string $cargoParameters, string $status, \DateTimeImmutable $submittedAt, ?\DateTimeImmutable $readAt = null): self
    {
        return new self($id, $idempotencyKey, $type, Name::fromString($name), Phone::fromString($phone), Email::fromNullable($email), Message::fromNullable($message), self::nullableText($cargo), self::nullableText($route), self::nullableText($cargoParameters), $status === 'submitted' ? 'new' : $status, $submittedAt, $readAt, null, false);
    }

    /** @return list<DomainEvent> */
    public function releaseEvents(): array
    {
        $events = $this->recordedEvents;
        $this->recordedEvents = [];

        return $events;
    }

    public function hasSameSubmission(string $name, string $phone, ?string $email, ?string $message, ?string $cargo = null, ?string $route = null, string $type = 'quote', ?string $cargoParameters = null): bool
    {
        return $this->type === $type
            && $this->name->value === Name::fromString($name)->value
            && $this->phone->value === Phone::fromString($phone)->value
            && $this->email?->value === Email::fromNullable($email)?->value
            && $this->message?->value === Message::fromNullable($message)?->value
            && $this->cargo === self::nullableText($cargo)
            && $this->route === self::nullableText($route)
            && $this->cargoParameters === self::nullableText($cargoParameters);
    }

    public function markAsRead(): void
    {
        $this->readAt ??= new \DateTimeImmutable;
        $this->status = 'read';
    }

    private static function nullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    public function changeStatus(string $targetStatus): void
    {
        $transitions = [self::STATUS_SUBMITTED => ['read'], 'new' => ['read'], 'read' => []];
        if (! in_array($targetStatus, $transitions[$this->status] ?? [], true)) {
            throw new InvalidLeadData("Status transition from {$this->status} to {$targetStatus} is not allowed.");
        }
        $this->status = $targetStatus;
    }
}
