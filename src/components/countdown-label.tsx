"use client";

import { useEffect, useState } from "react";

export function CountdownLabel({
  endsAtIso,
  fallbackLabel,
}: {
  endsAtIso: string | null;
  fallbackLabel?: string;
}) {
  const [label, setLabel] = useState(() =>
    formatCountdownLabel(endsAtIso) ?? fallbackLabel ?? "Encerramento em breve",
  );

  useEffect(() => {
    const updateLabel = () => {
      setLabel(
        formatCountdownLabel(endsAtIso) ??
          fallbackLabel ??
          "Encerramento em breve",
      );
    };

    updateLabel();
    const intervalId = window.setInterval(updateLabel, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endsAtIso, fallbackLabel]);

  return <>{label}</>;
}

function formatCountdownLabel(endsAtIso: string | null) {
  if (!endsAtIso) {
    return null;
  }

  const endsAt = new Date(endsAtIso);
  const diff = endsAt.getTime() - Date.now();

  if (diff <= 0) {
    return "Encerrado";
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `Termina em ${days}d ${String(hours).padStart(2, "0")}h ${String(
      minutes,
    ).padStart(2, "0")}m`;
  }

  if (hours > 0) {
    return `Termina em ${String(hours).padStart(2, "0")}h ${String(
      minutes,
    ).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  return `Termina em ${String(minutes).padStart(2, "0")}m ${String(
    seconds,
  ).padStart(2, "0")}s`;
}
