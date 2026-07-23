<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

final class AssignRequestId
{
    public function handle(Request $request, Closure $next): Response
    {
        $provided = $request->header('X-Request-Id');
        $requestId = is_string($provided) && preg_match('/^[A-Za-z0-9_-]{8,128}$/', $provided) === 1
            ? $provided
            : (string) Str::ulid();

        $request->attributes->set('request_id', $requestId);
        Log::withContext(['request_id' => $requestId]);
        /** @var Response $response */
        $response = $next($request);
        $response->headers->set('X-Request-Id', $requestId);

        return $response;
    }
}
