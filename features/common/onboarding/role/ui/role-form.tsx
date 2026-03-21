"use client";

import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";
import { Textarea } from "@/shared/ui/shadcn/textarea";

import { useRoleData, useRoleActions } from "../lib";
import { useRoleError } from "../lib/store/selectors";
import { ROLES } from "../model";

export function RoleForm() {
  const data = useRoleData();
  const { setData } = useRoleActions();
  const error = useRoleError();

  const handleFieldChange = (field: string, value: any) => {
    setData({ [field]: value } as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Your Role</h2>
        <p className="text-muted-foreground mt-1">
          Choose your role and add optional information
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Select Your Role <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-3">
          {ROLES.map((roleOption) => (
            <button
              key={roleOption.value}
              onClick={() => handleFieldChange("role", roleOption.value)}
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data?.phone || ""}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio (Optional)</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself and your background..."
            value={data?.bio || ""}
            onChange={(e) => handleFieldChange("bio", e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
