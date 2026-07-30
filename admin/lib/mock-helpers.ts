// Small helpers that make the in-memory mock arrays behave like a real
// async REST API (latency + immutability). Services import these so
// swapping to real `apiClient` calls later is a one-line change per method.

export function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredCloneSafe(data)), ms));
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

function structuredCloneSafe<T>(data: T): T {
  if (typeof structuredClone === "function") return structuredClone(data);
  return JSON.parse(JSON.stringify(data));
}
