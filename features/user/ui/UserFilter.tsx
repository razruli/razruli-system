import { Select } from "@/shared/ui";

type Props = {
  value: any;
  onChange: ({}: any) => void;
};
export function UserFilters({ value, onChange }: Props) {
  return (
    <Select
      value={value.role}
      onValueChange={(role) => onChange({ ...value, role })}
    />
  );
}
