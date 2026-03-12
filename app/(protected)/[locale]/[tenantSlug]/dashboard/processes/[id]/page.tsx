export default function ProcessDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Process Detail - {params.id}</div>;
}
