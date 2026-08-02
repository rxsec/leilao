import Link from "next/link";
import { PasswordRecoveryForm } from "@/components/password-recovery-form";

export default function RecuperarSenhaPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_45%,#f8f5ef_100%)] px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-xl rounded-[1.4rem] border border-[#d5e0e8] bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
          Recuperar senha
        </p>
        <h1 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.05em] text-neutral-950">
          Solicite uma nova senha
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          Envie a solicitação com o e-mail da conta. O administrador poderá
          liberar uma senha temporária para você voltar ao painel.
        </p>
        <div className="mt-6">
          <PasswordRecoveryForm />
        </div>
        <p className="mt-6 text-sm text-neutral-500">
          Lembrou a senha?{" "}
          <Link href="/entrar" className="font-semibold text-[#0f5d86]">
            Voltar para o login
          </Link>
        </p>
      </section>
    </main>
  );
}
