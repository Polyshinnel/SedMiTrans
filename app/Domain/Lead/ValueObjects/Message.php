<?php

namespace App\Domain\Lead\ValueObjects;

use App\Domain\Lead\Exceptions\InvalidLeadData;

final readonly class Message
{
    private function __construct(public string $value) {}

    public static function fromNullable(?string $value): ?self
    {
        $value = $value === null ? null : trim($value);

        if ($value === null || $value === '') {
            return null;
        }

        if (mb_strlen($value) > 5000) {
            throw new InvalidLeadData('Lead message must not exceed 5000 characters.');
        }

        return new self($value);
    }
}
