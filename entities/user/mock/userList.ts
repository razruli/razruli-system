// entities/user/mockUsers.ts

import { UserTableRow } from "../type";

import { generateMockUsers } from "./generateMockUsers";

export const mockGeneratedUsers = generateMockUsers(120);

export const mockUsers: UserTableRow[] = [
  {
    id: "1",
    email: "alice@example.com",
    role: "broker",
    createdAt: new Date("2026-01-01T10:00:00Z"),
    status: "active",
  },
  {
    id: "2",
    email: "bob@example.com",
    role: "carrier",
    createdAt: new Date("2026-01-05T14:30:00Z"),
    status: "inactive",
  },
  {
    id: "3",
    email: "carol@example.com",
    role: "broker",
    createdAt: new Date("2026-01-10T08:45:00Z"),
    status: "active",
  },
  {
    id: "4",
    email: "dave@example.com",
    role: "carrier",
    createdAt: new Date("2026-01-12T12:15:00Z"),
    status: "pending",
  },
  {
    id: "5",
    email: "eve@example.com",
    role: "broker",
    createdAt: new Date("2026-01-15T09:20:00Z"),
    status: "inactive",
  },
];
