/**
 * Base API client configuration.
 * Automatically switches to backend endpoints if VITE_API_BASE_URL is configured,
 * or allows seamless local execution via services.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorBody || response.statusText}`);
  }

  return response.json();
}

