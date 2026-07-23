'use client';

import { decodeJson, type Decoder, ApiError } from '@/lib/api/types';

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? '/api/v1').replace(/\/$/, '');

export async function browserApi<T>(path: string, init: RequestInit = {}, decoder?: Decoder<T>): Promise<T> {
  try {
    const response = await fetch(`${apiUrl}/${path.replace(/^\//, '')}`, {
      ...init,
      signal: init.signal ?? AbortSignal.timeout(8_000),
      headers: { Accept: 'application/json', ...init.headers },
    });
    if (!response.ok) throw await ApiError.fromResponse(response);
    return decodeJson(response, decoder);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('network', 0);
  }
}
