import apiClient from "@/lib/api-client";
import { mockUsers } from "@/lib/mock-data";
import { delay, generateId, nowIso } from "@/lib/mock-helpers";
import type { User, UserInput, PaginatedResponse } from "@/types";

const USE_MOCK = false;
const RESOURCE = "/admin/users";

let db: User[] = [...mockUsers];

function normalizeUser(u: any): User {
  const roleStr = u.role ? String(u.role).toLowerCase() : "customer";
  return {
    id: String(u.id ?? ""),
    name: u.name ?? "",
    email: u.email ?? "",
    phone: u.phone ?? "",
    role: (roleStr === "admin" ? "admin" : "customer") as any,
    status: u.enabled !== false ? "active" : "inactive",
    joinedAt: u.createdAt ?? u.joinedAt ?? "",
  };
}

export const userService = {
  async getAll(): Promise<User[]> {
    if (USE_MOCK) return delay(db);
    const { data } = await apiClient.get<any>(RESOURCE);
    const list = Array.isArray(data) ? data : (data?.content ?? []);
    return list.map(normalizeUser);
  },

  async getById(id: string): Promise<User | undefined> {
    if (USE_MOCK) return delay(db.find((u) => u.id === id));
    const { data } = await apiClient.get<any>(`${RESOURCE}/${id}`);
    return data ? normalizeUser(data) : undefined;
  },

  async create(input: UserInput): Promise<User> {
    if (USE_MOCK) {
      const user: User = { ...input, id: generateId("us"), joinedAt: nowIso() };
      db = [user, ...db];
      return delay(user);
    }
    const { data } = await apiClient.post<any>(RESOURCE, input);
    return normalizeUser(data);
  },

  async update(id: string, input: Partial<UserInput>): Promise<User> {
    if (USE_MOCK) {
      db = db.map((u) => (u.id === id ? { ...u, ...input } : u));
      return delay(db.find((u) => u.id === id)!);
    }
    const { data } = await apiClient.put<any>(`${RESOURCE}/${id}`, input);
    return normalizeUser(data);
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
