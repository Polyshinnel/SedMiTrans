<?php

use App\Application\Lead\Exceptions\IdempotencyConflict;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\App\Http\Middleware\AssignRequestId::class);
        $middleware->redirectGuestsTo(fn (): string => route('filament.admin.auth.login'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (IdempotencyConflict $exception, Request $request): ?Response {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'message' => 'The idempotency key has already been used with a different payload.',
            ], Response::HTTP_CONFLICT);
        });

        $exceptions->render(function (Throwable $exception, Request $request): ?Response {
            if (! app()->environment('production') || ! $request->is('api/v1/health')) {
                return null;
            }

            Log::error('Readiness check failed.', ['exception' => $exception]);

            return response()->json(['status' => 'unavailable'], Response::HTTP_SERVICE_UNAVAILABLE);
        });
    })->create();
