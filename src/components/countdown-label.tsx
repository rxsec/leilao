export function CountdownLabel({
  status,
}: {
  status: "live" | "scheduled" | "closed";
}) {
  return <>{status === "closed" ? "Encerrado" : "Disponivel para lances"}</>;
}
