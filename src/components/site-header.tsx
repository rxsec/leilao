import Link from "next/link";
import {
  ChevronDown,
  Heart,
  LayoutGrid,
  Menu,
  MonitorPlay,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { logoutUser } from "@/app/actions";
import { BrandLogo } from "@/components/brand-logo";
import { getAuctionFilterOptions } from "@/lib/auction-data";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const [user, categories, liveLotsCount] = await Promise.all([
    getCurrentUser(),
    getAuctionFilterOptions(),
    prisma.lot.count({ where: { status: "live" } }),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d7e3ec] bg-[#dfe8f5]/96 px-4 py-3 text-[#103f5a] shadow-[0_12px_34px_rgba(15,93,134,0.08)] backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#44627a] transition hover:bg-white/70"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center">
            <BrandLogo className="h-9 w-[11rem] sm:h-10 sm:w-[12rem]" />
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-4 lg:flex">
          <details className="group relative">
            <summary className="flex h-11 min-w-[9.5rem] cursor-pointer list-none items-center justify-center gap-2 rounded-full bg-[#ff9e28] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,158,40,0.28)]">
              <LayoutGrid className="h-4 w-4" />
              Categorias
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>

            <div className="absolute left-0 top-[calc(100%+0.8rem)] z-50 w-[22rem] rounded-[1.4rem] border border-[#d7e3ec] bg-white p-3 shadow-[0_24px_60px_rgba(15,93,134,0.14)]">
              <div className="grid gap-2 sm:grid-cols-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/leiloes?category=${category.slug}`}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-[#244457] transition hover:bg-[#eef5fa] hover:text-[#0f5d86]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </details>

          <form
            action="/leiloes"
            className="flex h-14 w-full max-w-[28rem] items-center rounded-full bg-white pl-6 pr-2 shadow-[0_10px_24px_rgba(15,93,134,0.08)]"
          >
            <input
              name="q"
              className="w-full bg-transparent text-[1rem] text-[#244457] outline-none placeholder:text-[#6f8797]"
              placeholder="Pesquisar..."
            />
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5fb] text-[#0f5d86] transition hover:bg-[#e0edf8]"
              aria-label="Pesquisar"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/leiloes"
            className="hidden items-center gap-2 rounded-full bg-[#ffd8df] px-4 py-3 text-sm font-semibold text-[#651a26] md:flex"
          >
            <MonitorPlay className="h-4 w-4" />
            Ao vivo
            {liveLotsCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#cf203d] px-1 text-[0.7rem] text-white">
                {liveLotsCount}
              </span>
            ) : null}
          </Link>

          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/meus-lances"}
              className="hidden text-sm font-semibold text-[#39566f] transition hover:text-[#0f5d86] md:block"
            >
              Minha conta
            </Link>
          ) : (
            <Link
              href="/entrar"
              className="hidden text-sm font-semibold text-[#39566f] transition hover:text-[#0f5d86] md:block"
            >
              Entrar
            </Link>
          )}

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[#39566f] transition hover:bg-white/70 md:flex"
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[#39566f] transition hover:bg-white/70 md:flex"
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>

          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/meus-lances"}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a6fc4] text-white shadow-[0_10px_24px_rgba(42,111,196,0.22)] transition hover:brightness-105"
                aria-label="Conta do usuário"
              >
                <UserRound className="h-5 w-5" />
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="hidden rounded-full border border-[#cfe0ea] bg-white/80 px-4 py-2 text-sm font-semibold text-[#18425d] transition hover:bg-white lg:block"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/cadastro"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a6fc4] text-white shadow-[0_10px_24px_rgba(42,111,196,0.22)] transition hover:brightness-105"
              aria-label="Criar conta"
            >
              <UserRound className="h-5 w-5" />
            </Link>
          )}

          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className="hidden rounded-full border border-[#cfe0ea] bg-white/80 px-4 py-2 text-sm font-semibold text-[#18425d] transition hover:bg-white xl:block"
            >
              Admin
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-3 flex max-w-[120rem] items-center gap-3 lg:hidden">
        <details className="group relative">
          <summary className="flex h-11 min-w-[9rem] cursor-pointer list-none items-center justify-center gap-2 rounded-full bg-[#ff9e28] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,158,40,0.28)]">
            <LayoutGrid className="h-4 w-4" />
            Categorias
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>

          <div className="absolute left-0 top-[calc(100%+0.8rem)] z-50 w-[18rem] rounded-[1.2rem] border border-[#d7e3ec] bg-white p-3 shadow-[0_24px_60px_rgba(15,93,134,0.14)]">
            <div className="grid gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/leiloes?category=${category.slug}`}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-[#244457] transition hover:bg-[#eef5fa] hover:text-[#0f5d86]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </details>

        <form
          action="/leiloes"
          className="flex h-12 flex-1 items-center rounded-full bg-white pl-5 pr-2 shadow-[0_10px_24px_rgba(15,93,134,0.08)]"
        >
          <input
            name="q"
            className="w-full bg-transparent text-sm text-[#244457] outline-none placeholder:text-[#6f8797]"
            placeholder="Pesquisar..."
          />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef5fb] text-[#0f5d86]"
            aria-label="Pesquisar"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
