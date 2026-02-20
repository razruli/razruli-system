export type UserTData = {
  id: string;
  email: string;
  createdAt: Date;
  image?: string;
  role?: "broker" | "carrier";
  status?: "active" | "inactive" | "pending";
};

export type UserTableRow = UserTData & {
  subRows?: UserTableRow[]; // For TanStack accordion expansion
};
