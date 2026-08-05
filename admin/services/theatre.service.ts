import apiClient from "@/lib/api-client";
import { mockTheatres } from "@/lib/mock-data";
import { delay, generateId, nowIso } from "@/lib/mock-helpers";
import type { Theatre, TheatreInput, PaginatedResponse } from "@/types";

const USE_MOCK = false;
const RESOURCE = "/admin/theatres";

let db: Theatre[] = [...mockTheatres];

export const theatreService = {
  async getAll(): Promise<Theatre[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<PaginatedResponse<Theatre> | Theatre[]>(RESOURCE);
    return Array.isArray(data) ? data : data.content;
  },

  async getById(id: string): Promise<Theatre | undefined> {
    if (USE_MOCK) return delay(db.find((t) => t.id === id));
    const { data } = await apiClient.get<Theatre>(`${RESOURCE}/${id}`);
    return data;
  },

  async create(input: TheatreInput): Promise<Theatre> {
    if (USE_MOCK) {
      const theatre: Theatre = {
        ...input,
        id: generateId("th"),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db = [theatre, ...db];
      return delay(theatre);
    }
    const { data } = await apiClient.post<Theatre>(RESOURCE, input);
    return data;
  },

  async update(id: string, input: Partial<TheatreInput>): Promise<Theatre> {
    if (USE_MOCK) {
      db = db.map((t) => (t.id === id ? { ...t, ...input, updatedAt: nowIso() } : t));
      return delay(db.find((t) => t.id === id)!);
    }
    const { data } = await apiClient.put<Theatre>(`${RESOURCE}/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<{ id: string }> {
    if (USE_MOCK) {
      db = db.filter((t) => t.id !== id);
      return delay({ id });
    }
    await apiClient.delete(`${RESOURCE}/${id}`);
    return { id };
  },
};
