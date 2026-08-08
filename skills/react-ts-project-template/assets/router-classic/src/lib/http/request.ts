import { env } from "../../config/env";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
