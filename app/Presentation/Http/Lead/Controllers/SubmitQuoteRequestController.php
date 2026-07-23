<?php

namespace App\Presentation\Http\Lead\Controllers;

use App\Application\Lead\Commands\SubmitQuoteRequest;
use App\Application\Lead\Handlers\SubmitQuoteRequestHandler;
use App\Presentation\Http\Lead\Requests\SubmitQuoteRequestRequest;
use App\Presentation\Http\Lead\Resources\LeadResource;
use Illuminate\Http\JsonResponse;

final class SubmitQuoteRequestController
{
    public function __invoke(SubmitQuoteRequestRequest $request, SubmitQuoteRequestHandler $handler): JsonResponse|LeadResource
    {
        $data = $request->validated();
        $lead = $handler->handle(new SubmitQuoteRequest($data['idempotency_key'], $data['name'], $data['phone'], $data['email'] ?? null, $data['message'] ?? null, $request->attributes->getString('request_id')));

        return (new LeadResource($lead))->response()->setStatusCode(201);
    }
}
