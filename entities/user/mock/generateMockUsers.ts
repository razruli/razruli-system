import { UserTableRow } from "../type";

const ROLES: UserTableRow["role"][] = ["broker", "carrier"];
const STATUSES: UserTableRow["status"][] = ["active", "inactive", "pending"];

export const generateMockUsers = (count: number = 120): UserTableRow[] =>
  Array.from({ length: count }, (_, index) => {
    const id = (index + 1).toString();

    return {
      id,
      email: `user${id}@example.com`,
      role: ROLES[index % ROLES.length],
      status: STATUSES[index % STATUSES.length],
      createdAt: new Date(Date.UTC(2026, 0, 1 + index, 9, 0, 0)),
    };
  });
