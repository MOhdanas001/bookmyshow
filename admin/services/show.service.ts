import apiClient from "@/lib/api-client";
import { mockShows, mockMovies, mockTheatres } from "@/lib/mock-data";
import { delay, generateId, nowIso } from "@/lib/mock-helpers";
import type { Show, ShowInput, PaginatedResponse } from "@/types";

const USE_MOCK = true;
const RESOURCE = "/shows";

let db: Show[] = [...mockShows];

export const showService = {
  async getAll(): Promise<Show[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<PaginatedResponse<Show> | Show[]>(RESOURCE);
    return Array.isArray(data) ? data : data.content;
  },

  async getById(id: string): Promise<Show | undefined> {
    if (USE_MOCK) return delay(db.find((s) => s.id === id));
    const { data } = await apiClient.get<Show>(`${RESOURCE}/${id}`);
    return data;
  },

  async create(input: ShowInput): Promise<Show> {
    if (USE_MOCK) {
      const movie = mockMovies.find((m) => m.id === input.movieId);
      const theatre = mockTheatres.find((t) => t.id === input.theatreId);
      const show: Show = {
        ...input,
        id: generateId("sh"),
        movieTitle: movie?.title ?? "Unknown Movie",
        theatreName: theatre?.name ?? "Unknown Theatre",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db = [show, ...db];
      return delay(show);
    }
    const { data } = await apiClient.post<Show>(RESOURCE, input);
    return data;
  },

  async update(id: string, input: Partial<ShowInput>): Promise<Show> {
    if (USE_MOCK) {
      db = db.map((s) => (s.id === id ? { ...s, ...input, updatedAt: nowIso() } : s));
      return delay(db.find((s) => s.id === id)!);
    }
    const { data } = await apiClient.put<Show>(`${RESOURCE}/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<{ id: string }> {
    if (USE_MOCK) {
      db = db.filter((s) => s.id !== id);
      return delay({ id });
    }
    await apiClient.delete(`${RESOURCE}/${id}`);
    return { id };
  },
};
