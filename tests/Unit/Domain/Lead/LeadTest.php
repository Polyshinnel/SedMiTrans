<?php

namespace Tests\Unit\Domain\Lead;

use App\Domain\Lead\Entities\Lead;
use App\Domain\Lead\Exceptions\InvalidLeadData;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class LeadTest extends TestCase
{
    #[Test]
    public function it_normalizes_values_and_records_submission_event(): void
    {
        $lead = Lead::submit('01J00000000000000000000000', ' key ', ' Alice ', '+7 (999) 123-45-67', 'ALICE@EXAMPLE.TEST ', ' Hello ', new \DateTimeImmutable('2026-07-22T10:00:00Z'));

        self::assertSame('submitted', $lead->status);
        self::assertSame('key', $lead->idempotencyKey);
        self::assertSame('+79991234567', $lead->phone->value);
        self::assertSame('alice@example.test', $lead->email?->value);
        self::assertCount(1, $lead->releaseEvents());
        self::assertSame([], $lead->releaseEvents());
    }

    #[Test]
    public function it_rejects_invalid_phone(): void
    {
        $this->expectException(InvalidLeadData::class);

        Lead::submit('01J00000000000000000000000', 'key', 'Alice', 'bad', null, null, new \DateTimeImmutable);
    }
}
