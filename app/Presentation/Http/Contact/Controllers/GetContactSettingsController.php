<?php

namespace App\Presentation\Http\Contact\Controllers;

use App\Infrastructure\Contact\ContactSettings;
use Illuminate\Http\JsonResponse;

final class GetContactSettingsController
{
    public function __invoke(ContactSettings $settings): JsonResponse
    {
        return response()->json(['data' => $settings->get()]);
    }
}
