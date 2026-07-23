<?php

namespace App\Domain\Lead\ValueObjects;

use App\Domain\Lead\Exceptions\InvalidLeadData;

final readonly class Phone
{
    private function __construct(public string $value) {}

    public static function fromString(string $value): self
    {
        $value = preg_replace('/[^\d+]/u', '', trim($value)) ?? '';

        if (str_starts_with($value, '00')) {
            $value = '+'.substr($value, 2);
        }

        if (! preg_match('/^\+?[1-9]\d{6,30}$/', $value)) {
            throw new InvalidLeadData('Lead phone has an invalid format.');
        }

        return new self($value);
    }
}
