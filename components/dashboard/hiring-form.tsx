"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "@/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { Textarea } from "@/shared/ui/shadcn/textarea";

const hiringRequestSchema = z.object({
  positionTitle: z
    .string()
    .min(2, "Position title must be at least 2 characters"),
  department: z.string().min(1, "Please select a department"),
  priority: z.string().min(1, "Please select a priority"),
  headcount: z.preprocess(
    (v) => Number(v),
    z
      .number()
      .min(1, "At least 1 position required")
      .max(50, "Maximum 50 per request"),
  ),
  workloadAllocation: z.number().min(10).max(100),
  justification: z
    .string()
    .min(10, "Please provide a justification (min 10 characters)"),
  budgetApproved: z.boolean(),
  remoteEligible: z.boolean(),
});

type HiringRequestValues = z.infer<typeof hiringRequestSchema>;

export function HiringRequestForm() {
  const form = useForm<HiringRequestValues>({
    resolver: zodResolver(hiringRequestSchema),
    defaultValues: {
      positionTitle: "",
      department: "",
      priority: "",
      headcount: 1,
      workloadAllocation: 80,
      justification: "",
      budgetApproved: false,
      remoteEligible: true,
    },
  });

  function onSubmit(data: HiringRequestValues) {
    toast.success("Hiring request submitted", {
      description: `${data.headcount}x ${data.positionTitle} for ${data.department}`,
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <UserPlus className="size-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">
              New Hiring Request
            </CardTitle>
            <CardDescription>
              Submit a request for new positions based on workload analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="positionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">
                          Critical - Immediate
                        </SelectItem>
                        <SelectItem value="high">
                          High - Next 30 days
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium - Next quarter
                        </SelectItem>
                        <SelectItem value="low">
                          Low - Future planning
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headcount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headcount</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={50} {...field} />
                    </FormControl>
                    <FormDescription>Number of positions</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workloadAllocation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Expected Workload Allocation</FormLabel>
                    <span className="text-sm font-medium text-primary">
                      {field.value}%
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    How much of this role will be allocated to the primary
                    process
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justification</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain the business need and how this position addresses workload gaps..."
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="budgetApproved"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex flex-col gap-0.5">
                      <FormLabel className="text-sm">Budget Approved</FormLabel>
                      <FormDescription className="text-xs">
                        Has budget been pre-approved?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remoteEligible"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex flex-col gap-0.5">
                      <FormLabel className="text-sm">Remote Eligible</FormLabel>
                      <FormDescription className="text-xs">
                        Can this role be fully remote?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
