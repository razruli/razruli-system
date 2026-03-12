export default function EmployeeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Employee Detail - {params.id}</div>;
}
