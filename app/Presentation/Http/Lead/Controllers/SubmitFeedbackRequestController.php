<?php

namespace App\Presentation\Http\Lead\Controllers;

use App\Application\Lead\Commands\SubmitFeedbackRequest;
use App\Application\Lead\Handlers\SubmitFeedbackRequestHandler;
use App\Presentation\Http\Lead\Requests\SubmitFeedbackRequestRequest;
use App\Presentation\Http\Lead\Resources\LeadResource;
use Illuminate\Http\JsonResponse;

final class SubmitFeedbackRequestController
{
    public function __invoke(SubmitFeedbackRequestRequest $request, SubmitFeedbackRequestHandler $handler): JsonResponse|LeadResource
    {
        $data = $request->validated();
        $lead = $handler->handle(new SubmitFeedbackRequest($data['idempotency_key'], $data['name'], $data['phone'], $data['email'] ?? null, $data['message'] ?? null, $request->attributes->getString('request_id')));

        return (new LeadResource($lead))->response()->setStatusCode(201);
    }
}
