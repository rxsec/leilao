import Link from "next/link";
import { ChevronDown, Search, UserRound } from "lucide-react";
import { logoutUser } from "@/app/actions";
import { BrandLogo } from "@/components/brand-logo";
import { navigation } from "@/lib/branding";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-[#d6e0e8] bg-[linear-gradient(180deg,#f3f6f9,#edf2f6)] px-4 py-4 text-[#103f5a] shadow-[0_10px_30px_rgba(16,63,90,0.08)] sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full items-center justify-center gap-6 xl:justify-between xl:gap-12">
          <Link
            href="/"
            className="flex w-full items-center justify-center xl:w-auto xl:justify-start"
          >
            <BrandLogo className="h-12 w-[15rem] sm:h-14 sm:w-[18rem] lg:h-14 lg:w-[20rem]" />
          </Link>

          <nav className="hidden items-center gap-6 text-[0.95rem] font-semibold xl:flex 2xl:gap-10 2xl:text-[0.98rem]">
            <Link
              href="/leiloes"
              className="flex items-center gap-1 whitespace-nowrap text-[#18232c] transition hover:text-[#0f5d86]"
            >
              Leilões
            </Link>
            {navigation.map((item) => (
              <Link
                key={item}
                href={`/#${slugify(item)}`}
                className="flex items-center gap-1 whitespace-nowrap text-[#18232c] transition hover:text-[#0f5d86]"
              >
                {item}
                {item === "Categorias" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : null}
              </Link>
            ))}
            {user ? (
              <Link
                href="/meus-lances"
                className="flex items-center gap-1 whitespace-nowrap text-[#18232c] transition hover:text-[#0f5d86]"
              >
                Meus lances
              </Link>
            ) : null}
            {user?.role === "admin" ? (
              <Link
                href="/admin"
                className="flex items-center gap-1 whitespace-nowrap text-[#18232c] transition hover:text-[#0f5d86]"
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>

        <nav className="grid grid-cols-2 gap-2 xl:hidden sm:grid-cols-5">
          <Link
            href="/leiloes"
            className="flex h-11 items-center justify-center rounded-2xl border border-[#cfe0ea] bg-white/80 px-4 text-sm font-semibold text-[#18425d] shadow-[0_4px_14px_rgba(15,93,134,0.06)] transition hover:bg-white"
          >
            Leilões
          </Link>
          {navigation.map((item) => (
            <Link
              key={item}
              href={`/#${slugify(item)}`}
              className="flex h-11 items-center justify-center rounded-2xl border border-[#cfe0ea] bg-white/80 px-4 text-sm font-semibold text-[#18425d] shadow-[0_4px_14px_rgba(15,93,134,0.06)] transition hover:bg-white"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center xl:gap-4">
          <form
            action="/leiloes"
            className="lg:flex-1 xl:min-w-[24rem] xl:max-w-[34rem]"
          >
            <label className="flex h-12 w-full items-center gap-3 rounded-full border border-[#d7e0e8] bg-white px-4 text-sm text-neutral-500 shadow-[0_6px_18px_rgba(15,93,134,0.06)]">
              <Search className="h-4 w-4 text-[#8a98a6]" />
              <input
                name="q"
                className="w-full bg-transparent outline-none placeholder:text-neutral-400"
                placeholder="Buscar por itens ou categorias..."
              />
            </label>
          </form>

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
                  className="gold-button inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition hover:brightness-95"
                >
                  <UserRound className="h-4 w-4" />
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}
