"use client";

import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";

import { useCompanyData, useCompanyActions } from "../lib";
import { INDUSTRIES, TIMEZONES } from "../model";

export function CompanyForm() {
  const data = useCompanyData();
  const { setData } = useCompanyActions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Information</h2>
        <p className="text-muted-foreground mt-1">Tell us about your company</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            placeholder="Acme Corp"
            value={data?.name || ""}
            onChange={(e) => setData({ name: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={data?.industry || ""}
            onValueChange={(value) => setData({ industry: value })}
          >
            <SelectTrigger id="industry" className="mt-2">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={data?.timezone || ""}
            onValueChange={(value) => setData({ timezone: value })}
          >
            <SelectTrigger id="timezone" className="mt-2">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Work Start Time</Label>
            <Input
              id="start"
              type="time"
              value={data?.workingHours?.start || ""}
              onChange={(e) =>
                setData({
                  workingHours: {
                    ...data?.workingHours,
                    start: e.target.value,
                  } as any,
                })
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="end">Work End Time</Label>
            <Input
              id="end"
              type="time"
              value={data?.workingHours?.end || ""}
              onChange={(e) =>
                setData({
                  workingHours: {
                    ...data?.workingHours,
                    end: e.target.value,
                  } as any,
                })
              }
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
