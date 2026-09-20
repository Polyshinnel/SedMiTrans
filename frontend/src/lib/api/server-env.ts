import 'server-only';

function getApiInternalUrl(): string {
  const apiInternalUrl = process.env.API_INTERNAL_URL;
  if (!apiInternalUrl) throw new Error('API_INTERNAL_URL is required');

  return apiInternalUrl.replace(/\/$/, '');
}

export const serverEnv = {
  get apiInternalUrl(): string {
    return getApiInternalUrl();
  },
  mediaInternalUrl: (process.env.MEDIA_INTERNAL_URL ?? 'http://nginx').replace(/\/$/, ''),
};
