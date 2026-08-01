import Link from "next/link";
import { logoutUser } from "@/app/actions";
import { BrandLogo } from "@/components/brand-logo";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-[#d6e0e8] bg-[linear-gradient(180deg,#f3f6f9,#edf2f6)] px-4 py-4 text-[#103f5a] shadow-[0_10px_30px_rgba(16,63,90,0.08)] sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <BrandLogo className="h-12 w-[15rem] sm:h-14 sm:w-[18rem]" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#18232c] lg:flex">
            <Link href="/leiloes" className="transition hover:text-[#0f5d86]">
              Leiloes
            </Link>
            {user ? (
              <Link
                href="/meus-lances"
                className="transition hover:text-[#0f5d86]"
              >
                Meus lances
              </Link>
            ) : null}
            {user?.role === "admin" ? (
              <Link href="/admin" className="transition hover:text-[#0f5d86]">
                Admin
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full border border-[#cfe0ea] bg-white/80 px-4 py-2 text-sm font-semibold text-[#18425d]">
                {user.name}
              </span>
              <Link
                href="/meus-lances"
                className="flex h-11 items-center justify-center rounded-2xl border border-[#0f5d86]/18 bg-white px-4 text-sm font-semibold text-[#0f5d86] transition hover:bg-[#eef5fa]"
              >
                Minha conta
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="gold-button inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition hover:brightness-95"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="flex h-11 items-center justify-center rounded-2xl border border-[#0f5d86]/18 bg-white px-4 text-sm font-semibold text-[#0f5d86] transition hover:bg-[#eef5fa]"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="gold-button inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition hover:brightness-95"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
