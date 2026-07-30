import apiClient from "@/lib/api-client";
import { mockUsers } from "@/lib/mock-data";
import { delay, generateId, nowIso } from "@/lib/mock-helpers";
import type { User, UserInput, PaginatedResponse } from "@/types";

const USE_MOCK = true;
const RESOURCE = "/users";

let db: User[] = [...mockUsers];

export const userService = {
  async getAll(): Promise<User[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<PaginatedResponse<User> | User[]>(RESOURCE);
    return Array.isArray(data) ? data : data.content;
  },

  async getById(id: string): Promise<User | undefined> {
    if (USE_MOCK) return delay(db.find((u) => u.id === id));
    const { data } = await apiClient.get<User>(`${RESOURCE}/${id}`);
    return data;
  },

  async create(input: UserInput): Promise<User> {
    if (USE_MOCK) {
      const user: User = { ...input, id: generateId("us"), joinedAt: nowIso() };
      db = [user, ...db];
      return delay(user);
    }
    const { data } = await apiClient.post<User>(RESOURCE, input);
    return data;
  },

  async update(id: string, input: Partial<UserInput>): Promise<User> {
    if (USE_MOCK) {
      db = db.map((u) => (u.id === id ? { ...u, ...input } : u));
      return delay(db.find((u) => u.id === id)!);
    }
    const { data } = await apiClient.put<User>(`${RESOURCE}/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<{ id: string }> {
    if (USE_MOCK) {
      db = db.filter((u) => u.id !== id);
      return delay({ id });
    }
    await apiClient.delete(`${RESOURCE}/${id}`);
    return { id };
  },
};
