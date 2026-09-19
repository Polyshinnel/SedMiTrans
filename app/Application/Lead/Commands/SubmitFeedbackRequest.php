<?php

namespace App\Application\Lead\Commands;

final readonly class SubmitFeedbackRequest
{
    public function __construct(
        public string $idempotencyKey,
        public string $name,
        public string $phone,
        public ?string $email,
        public ?string $message,
        public ?string $requestId = null,
    ) {}
}
