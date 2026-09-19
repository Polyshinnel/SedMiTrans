<?php

namespace App\Application\Lead\Commands;

final readonly class SubmitQuoteRequest
{
    public function __construct(
        public string $idempotencyKey,
        public string $name,
        public string $phone,
        public ?string $email,
        public ?string $message,
        public ?string $cargo = null,
        public ?string $route = null,
        public ?string $cargoParameters = null,
        public ?string $requestId = null,
        public string $type = 'quote',
    ) {}
}
