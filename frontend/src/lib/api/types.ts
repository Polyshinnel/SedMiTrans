export type ApiErrorKind = 'validation' | 'rate_limit' | 'not_found' | 'server' | 'network';

export interface ApiErrorPayload { message?: string; errors?: Record<string, string[]>; request_id?: string; }

export class ApiError extends Error {
  constructor(public readonly kind: ApiErrorKind, public readonly status: number, public readonly requestId?: string, public readonly errors?: Record<string, string[]>, public readonly retryAfter?: number) {
    super(`API request failed (${status})`);
    this.name = 'ApiError';
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    const requestId = response.headers.get('x-request-id') ?? undefined;
    let payload: ApiErrorPayload | undefined;
    try { payload = await response.json() as ApiErrorPayload; } catch { /* Deliberately do not log response bodies. */ }
    const kind: ApiErrorKind = response.status === 422 ? 'validation' : response.status === 429 ? 'rate_limit' : response.status === 404 ? 'not_found' : response.status >= 500 ? 'server' : 'network';
    const retryAfterHeader = response.headers.get('retry-after');
    const retryAfter = retryAfterHeader !== null && /^\d+$/.test(retryAfterHeader) ? Number(retryAfterHeader) : undefined;
    return new ApiError(kind, response.status, requestId ?? payload?.request_id, payload?.errors, retryAfter);
  }
}

export type Decoder<T> = (value: unknown) => T;

export interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  telegram_url: string;
  whatsapp_url: string;
  max_url: string;
  working_hours: string;
  latitude: string;
  longitude: string;
}

export interface SeoPage {
  key: string;
  name: string;
  path: string;
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  seo: { title: string; description: string };
  title: string;
  excerpt: string;
  date: string;
  body: string;
  image: string | null;
  gallery: string[];
}

export interface PaginatedCases {
  data: CaseStudy[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export async function decodeJson<T>(response: Response, decoder?: Decoder<T>): Promise<T> {
  const payload: unknown = await response.json();
  return decoder ? decoder(payload) : payload as T;
}
