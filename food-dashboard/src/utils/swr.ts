import { request } from '@umijs/max';
import type { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 5000,
  errorRetryCount: 1,
  fetcher: async (key: string) => {
    const [, url] = key.split('::');
    return request(url);
  },
};
