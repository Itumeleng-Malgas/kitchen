import { request } from '@umijs/max';

// Returns subscription for current user's restaurant
export async function fetchSubscription() {
  return request('/subscription/current', {
    method: 'GET',
  });
}
