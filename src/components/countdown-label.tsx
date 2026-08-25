export function CountdownLabel({
  status,
}: {
  status: "draft" | "live" | "scheduled" | "closed";
}) {
  return <>{status === "closed" ? "Encerrado" : "Disponivel para lances"}</>;
}
