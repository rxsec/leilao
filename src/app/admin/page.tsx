import { AdminCategoryForm } from "@/components/admin-category-form";
import { AdminLotForm } from "@/components/admin-lot-form";
import { CloseLotForm } from "@/components/close-lot-form";
import { DeleteCategoryForm } from "@/components/delete-category-form";
import { ResetLotsForm } from "@/components/reset-lots-form";
import { ResolvePasswordResetForm } from "@/components/resolve-password-reset-form";
import {
  type AdminCustomer,
  getAdminPanelData,
  type AdminCategory,
  type AdminLot,
  type AdminOrder,
  type AdminPasswordResetRequest,
  type AdminRegistrationLink,
} from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

const CUSTOMERS_PAGE_SIZE = 6;
const CATEGORIES_PAGE_SIZE = 4;
const PRODUCTS_PAGE_SIZE = 4;
const REQUESTS_PAGE_SIZE = 5;
const ORDERS_PAGE_SIZE = 6;

type AdminPageSearchParams = Promise<{
  customersPage?: string;
  categoriesPage?: string;
  productsPage?: string;
  requestsPage?: string;
  ordersPage?: string;
}>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: AdminPageSearchParams;
}) {
  const adminUser = await requireAdmin();
  const params = await searchParams;
  const {
    categories,
    customers,
    lots,
    orders,
    passwordResetRequests,
    registrationLinks,
    hasDatabase,
  } = await getAdminPanelData(adminUser);
  const customersPage = readPageParam(params.customersPage);
  const categoriesPage = readPageParam(params.categoriesPage);
  const productsPage = readPageParam(params.productsPage);
  const requestsPage = readPageParam(params.requestsPage);
  const ordersPage = readPageParam(params.ordersPage);

  const customersSlice = paginate(customers, customersPage, CUSTOMERS_PAGE_SIZE);
  const categoriesSlice = paginate(categories, categoriesPage, CATEGORIES_PAGE_SIZE);
  const productsSlice = paginate(lots, productsPage, PRODUCTS_PAGE_SIZE);
  const requestsSlice = paginate(
    passwordResetRequests,
    requestsPage,
    REQUESTS_PAGE_SIZE,
  );
  const ordersSlice = paginate(orders, ordersPage, ORDERS_PAGE_SIZE);

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
            {adminUser.isPrimaryAdmin
              ? "Acompanhe todas as carteiras, distribua cadastros por link exclusivo e controle a operação central em um só lugar."
              : "Gerencie a sua carteira de clientes, acompanhe arremates vinculados ao seu link exclusivo e opere o painel com agilidade."}
          </p>
          {!hasDatabase ? (
            <p className="mt-4 text-sm text-[#d8edf8]">
              Configure o banco para persistir o painel administrativo.
            </p>
          ) : null}
        </div>

        <section className="section-card mt-6 rounded-[1.35rem] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Navegação rápida
              </p>
              <h2 className="mt-2 text-[1.55rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Operação organizada por área
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Acesse cada bloco do painel com atalhos diretos e visão resumida.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <AdminNavButton
                href="#links-exclusivos"
                label="Links"
                value={String(registrationLinks.length)}
              />
              <AdminNavButton
                href="#cadastros-realizados"
                label="Cadastros"
                value={String(customers.length)}
              />
              <AdminNavButton
                href="#arremates"
                label="Arremates"
                value={String(orders.length)}
              />
              <AdminNavButton
                href="#categorias"
                label="Categorias"
                value={String(categories.length)}
              />
              <AdminNavButton
                href="#produtos"
                label="Produtos"
                value={String(lots.length)}
              />
            </div>
          </div>
        </section>

        {adminUser.isPrimaryAdmin ? (
          <section className="section-card mt-6 rounded-[1.35rem] border border-[#dbe7ef] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                  Operação central
                </p>
                <h2 className="mt-2 text-[1.55rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                  Reset geral dos lotes
                </h2>
                <p className="mt-2 max-w-[42rem] text-sm text-neutral-600">
                  Use este comando apenas quando quiser reabrir todos os lotes, limpar os lances registrados e reiniciar a operação global.
                </p>
              </div>
              <ResetLotsForm />
            </div>
          </section>
        ) : null}

        <div className="mt-8 space-y-8">
          <section
            id="links-exclusivos"
            className="section-card scroll-mt-28 rounded-[1.3rem] p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Carteiras
            </p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                  Links exclusivos de cadastro
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {adminUser.isPrimaryAdmin
                    ? "Veja e distribua os links isolados de cadastro para cada administradora."
                    : "Use este link exclusivo para cadastrar clientes diretamente na sua carteira."}
                </p>
              </div>
              <SectionStat
                label="Carteiras ativas"
                value={String(registrationLinks.length)}
              />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {registrationLinks.map((link: AdminRegistrationLink) => (
                <div
                  key={link.id}
                  className="rounded-[1.2rem] border border-[#d5e0e8] bg-[#f9fbfd] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-extrabold text-neutral-950">
                        {link.name}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">{link.email}</p>
                    </div>
                    <span className="rounded-full bg-[#eef5fa] px-3 py-1 text-xs font-semibold uppercase text-[#0f5d86]">
                      {link.customer_count} clientes
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-[#dce6ee] bg-white px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                      Link de cadastro
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-[#0f5d86]">
                      {link.registration_slug
                        ? `/cadastro/${link.registration_slug}`
                        : "Link nao configurado"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="cadastros-realizados"
            className="section-card scroll-mt-28 rounded-[1.3rem] p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Clientes
            </p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                  Cadastros realizados
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Visualize os clientes em ordem de cadastro com navegação paginada.
                </p>
              </div>
              <SectionStat label="Total de clientes" value={String(customers.length)} />
            </div>
            <div className="mt-5 space-y-4">
              {customersSlice.items.length > 0 ? (
                customersSlice.items.map((customer: AdminCustomer) => (
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
                      <MiniInfo
                        label="Carteira"
                        value={customer.managed_by_admin_name ?? "Sem vinculo"}
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
            <SectionPagination
              basePath="/admin"
              anchor="cadastros-realizados"
              currentPage={customersSlice.currentPage}
              totalPages={customersSlice.totalPages}
              pageKey="customersPage"
              extraParams={{
                categoriesPage: String(categoriesPage),
                productsPage: String(productsPage),
                requestsPage: String(requestsPage),
                ordersPage: String(ordersPage),
              }}
            />
          </section>

          <section
            id="arremates"
            className="section-card scroll-mt-28 rounded-[1.3rem] p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Arremates
            </p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                  Arremates da carteira
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Pedidos gerados por clientes cadastrados nos links isolados deste painel.
                </p>
              </div>
              <SectionStat label="Total de arremates" value={String(orders.length)} />
            </div>
            <div className="mt-5 space-y-4">
              {ordersSlice.items.length > 0 ? (
                ordersSlice.items.map((order: AdminOrder) => (
                  <div
                    key={order.id}
                    className="rounded-[1.2rem] border border-[#d5e0e8] bg-[#f9fbfd] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-lg font-extrabold text-neutral-950">
                          {order.user_name}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">{order.user_email}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          order.status === "paid"
                            ? "bg-[#e0f2fb] text-[#0f5d86]"
                            : order.status === "cancelled"
                              ? "bg-[#f9e4e4] text-[#a53a3a]"
                              : "bg-[#fff3dd] text-[#9a4d00]"
                        }`}
                      >
                        {translateOrderStatus(order.status)}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MiniInfo label="Lote" value={order.lot_title} />
                      <MiniInfo label="Slug do lote" value={order.lot_slug} />
                      <MiniInfo label="Valor" value={formatCurrency(order.amount)} />
                      <MiniInfo
                        label="Arrematado em"
                        value={formatDateTime(order.created_at)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  Nenhum arremate vinculado a esta carteira até agora.
                </p>
              )}
            </div>
            <SectionPagination
              basePath="/admin"
              anchor="arremates"
              currentPage={ordersSlice.currentPage}
              totalPages={ordersSlice.totalPages}
              pageKey="ordersPage"
              extraParams={{
                customersPage: String(customersPage),
                categoriesPage: String(categoriesPage),
                productsPage: String(productsPage),
                requestsPage: String(requestsPage),
              }}
            />
          </section>

          <section id="solicitacoes" className="section-card scroll-mt-28 rounded-[1.3rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
              Recuperação de senha
            </p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                  Solicitações dos usuários
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Central de suporte para recuperação de acesso e atendimento rápido.
                </p>
              </div>
              <SectionStat
                label="Pendências"
                value={String(
                  passwordResetRequests.filter((request) => request.status === "pending")
                    .length,
                )}
              />
            </div>
            <div className="mt-5 space-y-4">
              {requestsSlice.items.length > 0 ? (
                requestsSlice.items.map(
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
            <SectionPagination
              basePath="/admin"
              anchor="solicitacoes"
              currentPage={requestsSlice.currentPage}
              totalPages={requestsSlice.totalPages}
              pageKey="requestsPage"
              extraParams={{
                customersPage: String(customersPage),
                categoriesPage: String(categoriesPage),
                productsPage: String(productsPage),
                ordersPage: String(ordersPage),
              }}
            />
          </section>

          <section id="categorias" className="grid scroll-mt-28 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
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
              <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                    Gerencie as categorias
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    Edite, revise e mantenha a base do catálogo padronizada.
                  </p>
                </div>
                <SectionStat label="Total" value={String(categories.length)} />
              </div>
              <div className="mt-5 space-y-4">
                {categoriesSlice.items.length > 0 ? (
                  categoriesSlice.items.map((category: AdminCategory) => (
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
              <SectionPagination
                basePath="/admin"
                anchor="categorias"
                currentPage={categoriesSlice.currentPage}
                totalPages={categoriesSlice.totalPages}
                pageKey="categoriesPage"
                extraParams={{
                  customersPage: String(customersPage),
                  productsPage: String(productsPage),
                  requestsPage: String(requestsPage),
                  ordersPage: String(ordersPage),
                }}
              />
            </div>
          </section>

          <section
            id="cadastro-rapido"
            className="grid scroll-mt-28 gap-6 xl:grid-cols-[0.95fr_1.05fr]"
          >
            <section className="section-card rounded-[1.3rem] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                Novo lote
              </p>
              <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                Cadastro rápido
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Preencha os dados essenciais do lote e publique com mais agilidade.
              </p>
              <div className="mt-5">
                <AdminLotForm categories={categories} />
              </div>
            </section>

            <section id="produtos" className="scroll-mt-28 space-y-5">
              <div className="section-card rounded-[1.3rem] p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0f5d86]">
                      Produtos
                    </p>
                    <h2 className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.04em] text-neutral-950">
                      Gestão de lotes cadastrados
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Acompanhe status, revise valores e encerre lotes antes do prazo quando necessário.
                    </p>
                  </div>
                  <SectionStat label="Total de lotes" value={String(lots.length)} />
                </div>
              </div>

              {productsSlice.items.map((lot: AdminLot) => (
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
              <SectionPagination
                basePath="/admin"
                anchor="produtos"
                currentPage={productsSlice.currentPage}
                totalPages={productsSlice.totalPages}
                pageKey="productsPage"
                extraParams={{
                  customersPage: String(customersPage),
                  categoriesPage: String(categoriesPage),
                  requestsPage: String(requestsPage),
                  ordersPage: String(ordersPage),
                }}
              />
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

function AdminNavButton({
  href,
  label,
  value,
}: {
  href: string;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      className="rounded-[1.15rem] border border-[#d8e6ef] bg-[linear-gradient(180deg,#ffffff,#f5f9fc)] px-4 py-3 shadow-[0_10px_25px_rgba(15,93,134,0.08)] transition hover:-translate-y-0.5 hover:border-[#9ecae0]"
    >
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#0f5d86]">
        {label}
      </p>
      <p className="mt-2 text-xl font-extrabold tracking-[-0.04em] text-neutral-950">
        {value}
      </p>
    </a>
  );
}

function SectionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex min-w-[10rem] flex-col rounded-2xl border border-[#d5e0e8] bg-[#f9fbfd] px-4 py-3">
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-neutral-400">
        {label}
      </span>
      <span className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-neutral-950">
        {value}
      </span>
    </div>
  );
}

function SectionPagination({
  basePath,
  anchor,
  currentPage,
  totalPages,
  pageKey,
  extraParams,
}: {
  basePath: string;
  anchor: string;
  currentPage: number;
  totalPages: number;
  pageKey:
    | "customersPage"
    | "categoriesPage"
    | "productsPage"
    | "requestsPage"
    | "ordersPage";
  extraParams: Record<string, string>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[#d5e0e8] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-500">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex flex-wrap gap-2">
        <PaginationLink
          basePath={basePath}
          anchor={anchor}
          pageKey={pageKey}
          page={Math.max(1, currentPage - 1)}
          disabled={currentPage === 1}
          extraParams={extraParams}
        >
          Anterior
        </PaginationLink>
        {buildVisiblePages(currentPage, totalPages).map((page) => (
          <PaginationLink
            key={page}
            basePath={basePath}
            anchor={anchor}
            pageKey={pageKey}
            page={page}
            active={page === currentPage}
            extraParams={extraParams}
          >
            {String(page)}
          </PaginationLink>
        ))}
        <PaginationLink
          basePath={basePath}
          anchor={anchor}
          pageKey={pageKey}
          page={Math.min(totalPages, currentPage + 1)}
          disabled={currentPage === totalPages}
          extraParams={extraParams}
        >
          Próxima
        </PaginationLink>
      </div>
    </div>
  );
}

function PaginationLink({
  basePath,
  anchor,
  pageKey,
  page,
  active = false,
  disabled = false,
  extraParams,
  children,
}: {
  basePath: string;
  anchor: string;
  pageKey:
    | "customersPage"
    | "categoriesPage"
    | "productsPage"
    | "requestsPage"
    | "ordersPage";
  page: number;
  active?: boolean;
  disabled?: boolean;
  extraParams: Record<string, string>;
  children: React.ReactNode;
}) {
  const params = new URLSearchParams(extraParams);
  params.set(pageKey, String(page));
  const href = `${basePath}?${params.toString()}#${anchor}`;
  const className = active
    ? "border-[#0f5d86] bg-[#0f5d86] text-white"
    : "border-[#d5e0e8] bg-white text-neutral-700 hover:border-[#0f5d86] hover:text-[#0f5d86]";

  if (disabled) {
    return (
      <span className="rounded-full border border-[#e4ebf0] px-4 py-2 text-sm font-semibold text-neutral-300">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${className}`}
    >
      {children}
    </a>
  );
}

function readPageParam(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
  };
}

function buildVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
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
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function translateOrderStatus(status: AdminOrder["status"]) {
  if (status === "paid") {
    return "Pago";
  }

  if (status === "cancelled") {
    return "Cancelado";
  }

  return "Pendente";
}
