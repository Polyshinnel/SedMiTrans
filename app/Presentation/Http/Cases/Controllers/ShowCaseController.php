<?php

namespace App\Presentation\Http\Cases\Controllers;

use App\Infrastructure\Persistence\Eloquent\Models\CaseRecord;
use App\Presentation\Http\Cases\Resources\CaseResource;

final class ShowCaseController
{
    public function __invoke(string $slug): CaseResource
    {
        return new CaseResource(CaseRecord::query()->with('images')->where('slug', $slug)->firstOrFail());
    }
}
