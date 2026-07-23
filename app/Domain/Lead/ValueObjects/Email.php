<?php

namespace App\Domain\Lead\ValueObjects;

use App\Domain\Lead\Exceptions\InvalidLeadData;

final readonly class Email
{
    private function __construct(public string $value) {}

    public static function fromNullable(?string $value): ?self
    {
        $value = $value === null ? null : strtolower(trim($value));

        if ($value === null || $value === '') {
            return null;
        }

        if (mb_strlen($value) > 255 || filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidLeadData('Lead email has an invalid format.');
        }

        return new self($value);
    }
}
