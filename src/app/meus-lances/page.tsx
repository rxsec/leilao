import Link from "next/link";
import { ChangePasswordForm } from "@/components/change-password-form";
import { PayOrderForm } from "@/components/pay-order-form";
import { requireUser } from "@/lib/auth";
import {
  getUserDashboardData,
  type UserBidItem,
  type UserOrderItem,
} from "@/lib/account-data";

export default async function MeusLancesPage() {
  const user = await requireUser();
  const { bids, orders, hasDatabase } = await getUserDashboardData(user.id);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_38%,#f8f5ef_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#0c2331,#0f5d86)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(15,93,134,0.2)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#bfe2f3]">
            Minha conta
          </p>
          <h1 className="mt-3 text-[2.5rem] font-extrabold tracking-[-0.05em]">
            {user.name}, acompanhe seus lances
          </h1>
          <p className="mt-3 max-w-[42rem] text-sm leading-7 text-white/80">
            Veja sua posição nos lotes e conclua o pagamento quando houver um
            arremate confirmado.
          </p>
          {!hasDatabase ? (
            <p className="mt-4 text-sm text-[#d8edf8]">
              Os dados da conta aparecerao aqui assim que os primeiros lances e
              pedidos forem registrados.
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="section-card rounded-[1.3rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Meus lances
            </p>
            <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
              Histórico de participação
            </h2>
            <div className="mt-5 space-y-3">
              {bids.length > 0 ? (
                bids.map((bid: UserBidItem) => (
                  <div
                    key={bid.bidId}
                    className="rounded-xl border border-[#d5e0e8] bg-white px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link
                          href={`/leiloes/${bid.lotSlug}`}
                          className="text-lg font-extrabold text-neutral-950"
                        >
                          {bid.lotTitle}
                        </Link>
                        <p className="mt-1 text-sm text-neutral-500">
                          {bid.createdAtLabel}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-extrabold text-[#0f5d86]">
                          {bid.amount}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Atual: {bid.currentBid}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#d5e0e8] bg-[#f8fbfd] px-3 py-1 text-xs font-semibold uppercase text-neutral-600">
                        {bid.lotStatus}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          bid.isWinning
                            ? "bg-[#e0f2fb] text-[#0f5d86]"
                            : "bg-[#f4f4f5] text-neutral-500"
                        }`}
                      >
                        {bid.isWinning ? "Liderando" : "Superado"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  Você ainda não participou de nenhum lote.
                </p>
              )}
            </div>
          </section>

          <div className="space-y-6">
            <section className="section-card rounded-[1.3rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Segurança
              </p>
              <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Alterar senha
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Atualize sua senha sempre que quiser reforçar a proteção da sua
                conta.
              </p>
              <div className="mt-5">
                <ChangePasswordForm />
              </div>
            </section>

            <section className="section-card rounded-[1.3rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Checkout
              </p>
              <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Pedidos pós-arremate
              </h2>
              <div className="mt-5 space-y-4">
                {orders.length > 0 ? (
                  orders.map((order: UserOrderItem) => (
                    <div
                      key={order.orderId}
                      className="rounded-xl border border-[#d5e0e8] bg-white px-4 py-4"
                    >
                      <p className="font-extrabold text-neutral-950">
                        {order.lotTitle}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Criado em {order.createdAtLabel}
                      </p>
                      <p className="mt-3 text-xl font-extrabold text-[#0f5d86]">
                        {order.amount}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[#d5e0e8] bg-[#f8fbfd] px-3 py-1 text-xs font-semibold uppercase text-neutral-600">
                          {order.status}
                        </span>
                        {order.status === "paid" && order.paidAtLabel ? (
                          <span className="text-xs text-neutral-500">
                            Pago em {order.paidAtLabel}
                          </span>
                        ) : null}
                      </div>
                      {order.status === "pending" ? (
                        <div className="mt-4">
                          <PayOrderForm orderId={order.orderId} />
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    Nenhum pedido aguardando pagamento.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
