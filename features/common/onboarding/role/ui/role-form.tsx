"use client";

import { useRoleData, useRoleActions } from "../lib";
import { ROLES } from "../model";

export function RoleForm() {
  const data = useRoleData();
  const { setData } = useRoleActions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Your Role</h2>
        <p className="text-muted-foreground mt-1">
          Choose the role that best describes your position
        </p>
      </div>

      <div className="space-y-3">
        {ROLES.map((roleOption) => (
          <button
            key={roleOption.value}
            onClick={() => setData({ role: roleOption.value })}
            className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
              data?.role === roleOption.value
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <p className="font-semibold">{roleOption.label}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {roleOption.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
