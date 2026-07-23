import 'server-only';

const apiInternalUrl = process.env.API_INTERNAL_URL;
if (!apiInternalUrl) throw new Error('API_INTERNAL_URL is required');

export const serverEnv = {
  apiInternalUrl: apiInternalUrl.replace(/\/$/, ''),
  mediaInternalUrl: (process.env.MEDIA_INTERNAL_URL ?? 'http://nginx').replace(/\/$/, ''),
};
