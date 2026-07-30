import apiClient from "@/lib/api-client";
import { mockMovies } from "@/lib/mock-data";
import { delay, generateId, nowIso } from "@/lib/mock-helpers";
import type { Movie, MovieInput, PaginatedResponse } from "@/types";

// Toggle this flag (or drive it from an env var) once the Spring Boot
// backend is live. Every method below already has the real Axios call
// written and commented, so flipping USE_MOCK is the only change needed.
const USE_MOCK = true;
const RESOURCE = "/movies";

let db: Movie[] = [...mockMovies];

export const movieService = {
  async getAll(): Promise<Movie[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<PaginatedResponse<Movie> | Movie[]>(RESOURCE);
    return Array.isArray(data) ? data : data.content;
  },

  async getById(id: string): Promise<Movie | undefined> {
    if (USE_MOCK) return delay(db.find((m) => m.id === id));
    const { data } = await apiClient.get<Movie>(`${RESOURCE}/${id}`);
    return data;
  },

  async create(input: MovieInput): Promise<Movie> {
    if (USE_MOCK) {
      const movie: Movie = {
        ...input,
        id: generateId("mv"),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db = [movie, ...db];
      return delay(movie);
    }
    const { data } = await apiClient.post<Movie>(RESOURCE, input);
    return data;
  },

  async update(id: string, input: Partial<MovieInput>): Promise<Movie> {
    if (USE_MOCK) {
      db = db.map((m) => (m.id === id ? { ...m, ...input, updatedAt: nowIso() } : m));
      const updated = db.find((m) => m.id === id)!;
      return delay(updated);
    }
    const { data } = await apiClient.put<Movie>(`${RESOURCE}/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<{ id: string }> {
    if (USE_MOCK) {
      db = db.filter((m) => m.id !== id);
      return delay({ id });
    }
    await apiClient.delete(`${RESOURCE}/${id}`);
    return { id };
  },
};
