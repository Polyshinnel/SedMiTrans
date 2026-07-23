<?php

namespace App\Domain\Lead\ValueObjects;

use App\Domain\Lead\Exceptions\InvalidLeadData;

final readonly class Name
{
    private function __construct(public string $value) {}

    public static function fromString(string $value): self
    {
        $value = trim($value);

        if ($value === '' || mb_strlen($value) > 120) {
            throw new InvalidLeadData('Lead name must contain from 1 to 120 characters.');
        }

        return new self($value);
    }
}
