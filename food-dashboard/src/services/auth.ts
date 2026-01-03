import { request } from '@umijs/max';

// Returns current logged-in user
export async function fetchCurrentUser() {
  return request('/auth/me', {
    method: 'GET',
  });
}
