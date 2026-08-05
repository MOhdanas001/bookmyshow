import apiClient from "@/lib/api-client";
import { mockShows, mockMovies, mockTheatres } from "@/lib/mock-data";
import { delay, generateId, nowIso } from "@/lib/mock-helpers";
import type { Show, ShowInput, PaginatedResponse } from "@/types";

const USE_MOCK = false;
const RESOURCE = "/admin/shows";

let db: Show[] = [...mockShows];

function normalizeShow(item: any): Show {
  return {
    ...item,
    id: String(item.id),
    date: item.date ?? item.showDate ?? "",
    time: item.time ?? item.showTime ?? "",
  };
}

export const showService = {
  async getAll(): Promise<Show[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<any>(RESOURCE);
    const rawList = Array.isArray(data) ? data : (data?.content ?? []);
    return rawList.map(normalizeShow);
  },

  async getById(id: string): Promise<Show | undefined> {
    if (USE_MOCK) return delay(db.find((s) => s.id === id));
    const { data } = await apiClient.get<any>(`${RESOURCE}/${id}`);
    return data ? normalizeShow(data) : undefined;
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
    const payload = {
      movieId: Number(input.movieId),
      theatreId: Number(input.theatreId),
      showDate: (input as any).date ?? (input as any).showDate,
      showTime: (input as any).time ?? (input as any).showTime,
      ticketPrice: input.ticketPrice,
    };
    const { data } = await apiClient.post<any>(RESOURCE, payload);
    return normalizeShow(data);
  },

  async update(id: string, input: Partial<ShowInput>): Promise<Show> {
    if (USE_MOCK) {
      db = db.map((s) => (s.id === id ? { ...s, ...input, updatedAt: nowIso() } : s));
      return delay(db.find((s) => s.id === id)!);
    }
    const payload = {
      movieId: input.movieId ? Number(input.movieId) : undefined,
      theatreId: input.theatreId ? Number(input.theatreId) : undefined,
      showDate: (input as any).date ?? (input as any).showDate,
      showTime: (input as any).time ?? (input as any).showTime,
      ticketPrice: input.ticketPrice,
    };
    const { data } = await apiClient.put<any>(`${RESOURCE}/${id}`, payload);
    return normalizeShow(data);
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
