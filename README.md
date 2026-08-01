Plataforma de leilao online em `Next.js` com `Prisma`, `PostgreSQL` e autenticacao por `JWT`.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- JWT

## Ambiente

Use o [.env.example](/home/paulo-pereira/Área%20de%20trabalho/leilao/.env.example:1) como base:

```bash
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
```

## Rodando localmente

```bash
npm install
npm run prisma:generate
npm run dev
```

## Banco

Aplicar schema:

```bash
npm run prisma:push
```

Popular dados iniciais:

```bash
npm run prisma:seed
```

## Fluxos prontos

- cadastro e login com `JWT`
- area `meus-lances`
- painel `/admin` para criar, editar e encerrar lotes
- upload local de imagens para `public/uploads`
- regras de incremento minimo, compra imediata e checkout pos-arremate

## Publicacao

1. Configure `DATABASE_URL`, `DIRECT_URL` e `JWT_SECRET`.
2. Rode `npm run prisma:push`.
3. Rode `npm run prisma:seed`.
4. Suba para o GitHub.
5. Faça o deploy na plataforma de sua escolha.
