<?php

namespace App\Presentation\Http\Seo\Controllers;

use App\Infrastructure\Seo\SeoPageSettings;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class GetSeoPageController
{
    public function __invoke(string $key, SeoPageSettings $settings): JsonResponse
    {
        $page = $settings->find($key);

        abort_if($page === null, Response::HTTP_NOT_FOUND);

        return response()->json(['data' => $page]);
    }
}
