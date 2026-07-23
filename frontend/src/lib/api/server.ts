import 'server-only';

import { decodeJson, type Decoder, ApiError } from '@/lib/api/types';
import { serverEnv } from '@/lib/api/server-env';

type ServerApiInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

export async function serverApi<T>(path: string, init: ServerApiInit = {}, decoder?: Decoder<T>): Promise<T> {
  try {
    const response = await fetch(`${serverEnv.apiInternalUrl}/${path.replace(/^\//, '')}`, {
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
