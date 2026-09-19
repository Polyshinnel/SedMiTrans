<?php

namespace App\Presentation\Http\Cases\Controllers;

use App\Infrastructure\Persistence\Eloquent\Models\CaseRecord;
use App\Presentation\Http\Cases\Resources\CaseResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ListCasesController
{
    public function __invoke(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max($request->integer('per_page', 12), 1), 100);
        $cases = CaseRecord::query()->with('images')->orderByDesc('published_at')->paginate($perPage)->withQueryString();

        return CaseResource::collection($cases);
    }
}
