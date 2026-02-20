// features/users-table/lib/map-users-to-rows.ts

import { UserTableRow } from "../../type";

export function mapUsersToRows(users: any[]): UserTableRow[] {
  const tUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name ?? "",
    createdAt: new Date(u.createdAt),
    image: u.image?.toString() || "",
  }));

  return tUsers;
}
