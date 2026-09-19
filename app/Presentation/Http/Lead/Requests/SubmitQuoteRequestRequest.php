<?php

namespace App\Presentation\Http\Lead\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class SubmitQuoteRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['idempotency_key' => $this->header('Idempotency-Key')]);
    }

    public function rules(): array
    {
        return [
            'idempotency_key' => ['required', 'string', 'max:128'],
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^\\+?[0-9()\\s-]{7,32}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'cargo' => ['nullable', 'string', 'max:5000'],
            'route' => ['nullable', 'string', 'max:5000'],
            'cargo_parameters' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
