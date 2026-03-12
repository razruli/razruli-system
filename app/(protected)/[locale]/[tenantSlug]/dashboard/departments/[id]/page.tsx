export default function DepartmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Department Detail - {params.id}</div>;
}
