import { AdminCategoryForm } from "@/components/admin-category-form";
import { AdminLotForm } from "@/components/admin-lot-form";
import { CloseLotForm } from "@/components/close-lot-form";
import { DeleteCategoryForm } from "@/components/delete-category-form";
import { ResolvePasswordResetForm } from "@/components/resolve-password-reset-form";
import {
  type AdminCustomer,
  getAdminPanelData,
  type AdminCategory,
  type AdminLot,
  type AdminPasswordResetRequest,
} from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  await requireAdmin();
  const { categories, customers, lots, passwordResetRequests, hasDatabase } =
    await getAdminPanelData();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef4f8_0%,#f7f8fa_38%,#f8f5ef_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#0c2331,#0f5d86)] px-6 py-8 text-white shadow-[0_20px_50px_rgba(15,93,134,0.2)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#bfe2f3]">
            Admin
          </p>
          <h1 className="mt-3 text-[2.5rem] font-extrabold tracking-[-0.05em]">
            Painel de operação do leilão
          </h1>
          <p className="mt-3 max-w-[44rem] text-sm leading-7 text-white/80">
            Cadastre lotes, suba imagens, defina regras de operação e resolva
            solicitações dos usuários em um só lugar.
          </p>
          {!hasDatabase ? (
            <p className="mt-4 text-sm text-[#d8edf8]">
              Configure o banco para persistir o painel administrativo.
            </p>
          ) : null}
        </div>

        <div className="mt-8 space-y-8">
          <section className="section-card rounded-[1.3rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Clientes
            </p>
            <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
              Cadastros realizados
            </h2>
            <div className="mt-5 space-y-4">
              {customers.length > 0 ? (
                customers.map((customer: AdminCustomer) => (
                  <div
                    key={customer.id}
                    className="rounded-[1.2rem] border border-[#d5e0e8] bg-[#f9fbfd] p-4"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <p className="text-lg font-extrabold text-neutral-950">
                        {customer.name}
                      </p>
                      <span className="rounded-full bg-[#eef5fa] px-3 py-1 text-xs font-semibold uppercase text-[#0f5d86]">
                        {customer.role}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MiniInfo label="E-mail" value={customer.email} />
                      <MiniInfo label="CPF" value={customer.cpf ?? "-"} />
                      <MiniInfo
                        label="Nascimento"
                        value={
                          customer.birth_date
                            ? formatDate(customer.birth_date)
                            : "-"
                        }
                      />
                      <MiniInfo
                        label="WhatsApp"
                        value={customer.whatsapp ?? "-"}
                      />
                      <MiniInfo label="CEP" value={customer.cep ?? "-"} />
                      <MiniInfo label="Rua" value={customer.street ?? "-"} />
                      <MiniInfo
                        label="Número"
                        value={customer.street_number ?? "-"}
                      />
                      <MiniInfo
                        label="Complemento"
                        value={customer.complement ?? "-"}
                      />
                      <MiniInfo
                        label="Bairro"
                        value={customer.neighborhood ?? "-"}
                      />
                      <MiniInfo label="Cidade" value={customer.city ?? "-"} />
                      <MiniInfo label="Estado" value={customer.state ?? "-"} />
                      <MiniInfo
                        label="Cadastrado em"
                        value={formatDateTime(customer.created_at)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  Nenhum cliente cadastrado ainda.
                </p>
              )}
            </div>
          </section>

          <section className="section-card rounded-[1.3rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Recuperação de senha
            </p>
            <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
              Solicitações dos usuários
            </h2>
            <div className="mt-5 space-y-4">
              {passwordResetRequests.length > 0 ? (
                passwordResetRequests.map(
                  (request: AdminPasswordResetRequest) => (
                    <div
                      key={request.id}
                      className="grid gap-4 rounded-[1.2rem] border border-[#d5e0e8] bg-[#f9fbfd] p-4 xl:grid-cols-[1fr_20rem]"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-extrabold text-neutral-950">
                            {request.email}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                              request.status === "resolved"
                                ? "bg-[#e0f2fb] text-[#0f5d86]"
                                : "bg-[#fff3dd] text-[#9a4d00]"
                            }`}
                          >
                            {request.status === "resolved"
                              ? "Resolvida"
                              : "Pendente"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-neutral-500">
                          Aberta em {formatDateTime(request.created_at)}
                        </p>
                        {request.resolved_at ? (
                          <p className="mt-1 text-sm text-neutral-500">
                            Resolvida em {formatDateTime(request.resolved_at)}
                          </p>
                        ) : null}
                        {request.note ? (
                          <p className="mt-3 rounded-xl border border-[#d5e0e8] bg-white px-4 py-3 text-sm text-neutral-600">
                            {request.note}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <ResolvePasswordResetForm
                          requestId={request.id}
                          disabled={request.status === "resolved"}
                        />
                      </div>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-neutral-500">
                  Nenhuma solicitação de recuperação recebida até agora.
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="section-card rounded-[1.3rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Nova categoria
              </p>
              <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Cadastro de categorias
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Crie e ajuste as categorias que alimentam o cadastro dos lotes.
              </p>
              <div className="mt-5">
                <AdminCategoryForm />
              </div>
            </div>

            <div className="section-card rounded-[1.3rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Categorias existentes
              </p>
              <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Gerencie as categorias
              </h2>
              <div className="mt-5 space-y-4">
                {categories.length > 0 ? (
                  categories.map((category: AdminCategory) => (
                    <div
                      key={category.id}
                      className="rounded-[1.2rem] border border-[#d5e0e8] bg-[#f9fbfd] p-4"
                    >
                      <div className="mb-4 grid gap-3 md:grid-cols-3">
                        <MiniInfo label="Nome" value={category.name} />
                        <MiniInfo label="Slug" value={category.slug} />
                        <MiniInfo
                          label="Lotes ativos"
                          value={String(category.activeLots)}
                        />
                      </div>
                      <div className="mb-4">
                        <DeleteCategoryForm categoryId={category.id} />
                      </div>
                      <AdminCategoryForm category={category} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">
                    Nenhuma categoria cadastrada ainda.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="section-card rounded-[1.3rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Novo lote
              </p>
              <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Cadastro rápido
              </h2>
              <div className="mt-5">
                <AdminLotForm categories={categories} />
              </div>
            </section>

            <section className="space-y-5">
              {lots.map((lot: AdminLot) => (
                <div
                  key={lot.id}
                  className="section-card rounded-[1.3rem] p-6"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0f5d86]">
                        {lot.status}
                      </p>
                      <h2 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                        {lot.title}
                      </h2>
                      <p className="mt-2 text-sm text-neutral-500">
                        Slug: {lot.slug}
                      </p>
                    </div>
                    <CloseLotForm lotSlug={lot.slug} />
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <MiniInfo
                      label="Lance atual"
                      value={formatCurrency(lot.current_bid)}
                    />
                    <MiniInfo
                      label="Incremento mínimo"
                      value={formatCurrency(lot.min_increment)}
                    />
                    <MiniInfo
                      label="Compra imediata"
                      value={
                        lot.buy_now_price
                          ? formatCurrency(lot.buy_now_price)
                          : "Não definido"
                      }
                    />
                  </div>

                  <div className="mt-6">
                    <AdminLotForm categories={categories} lot={lot} />
                  </div>
                </div>
              ))}
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d5e0e8] bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold text-neutral-950">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}
