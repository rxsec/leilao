import { AuthForm } from "@/components/auth-form";

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_45%,#f8f5ef_100%)] px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-xl rounded-[1.4rem] border border-[#d5e0e8] bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
          Cadastro
        </p>
        <h1 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.05em] text-neutral-950">
          Crie sua conta
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          O primeiro usuario criado assume o papel de administrador para operar
          o painel inicial do projeto.
        </p>
        <div className="mt-6">
          <AuthForm mode="register" />
        </div>
      </section>
    </main>
  );
}
