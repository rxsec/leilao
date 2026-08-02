"use client";

import { useActionState } from "react";
import { initialFormState } from "@/app/action-states";
import { deleteCategory } from "@/app/actions";

export function DeleteCategoryForm({
  categoryId,
}: {
  categoryId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteCategory,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="categoryId" value={categoryId} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-[#efd0d0] bg-white px-4 text-sm font-semibold text-[#8b2f2f] transition hover:bg-[#fff6f6] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Excluindo..." : "Excluir categoria"}
      </button>
      {state.status !== "idle" ? (
        <p
          className={`text-xs ${
            state.status === "success" ? "text-[#0f5d86]" : "text-neutral-500"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
