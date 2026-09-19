import 'server-only';

import { decodeJson, type Decoder, ApiError } from '@/lib/api/types';
import type { CaseStudy, ContactSettings, PaginatedCases, SeoPage } from '@/lib/api/types';
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

export async function getContactSettings(): Promise<ContactSettings> {
  const response = await serverApi<{ data: ContactSettings }>('contacts', { cache: 'no-store' });
  return response.data;
}

export async function getSeoPage(key: string): Promise<SeoPage> {
  const response = await serverApi<{ data: SeoPage }>(`seo/${key}`, { cache: 'no-store' });
  return response.data;
}

export async function getCases(page = 1, perPage = 12): Promise<PaginatedCases> {
  const response = await serverApi<PaginatedCases>(`cases?page=${page}&per_page=${perPage}`, { cache: 'no-store' });
  return response;
}

export async function getCase(slug: string): Promise<CaseStudy> {
  const response = await serverApi<{ data: CaseStudy }>(`cases/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  return response.data;
}
