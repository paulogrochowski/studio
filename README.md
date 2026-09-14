# SeViu 3D — Master Project

Repositório principal do projeto SeViu 3D, unificando a base Next.js/Firebase e a experiência de visualização 3D.

## Objetivo atual

Construir a ferramenta do lojista para transformar fotos de produtos em ativos 3D prontos para visualização web e, depois, AR.

Fluxo alvo:

1. O lojista envia uma ou várias fotos do produto.
2. O sistema cria um job de geração 3D.
3. Um provider de geração processa as imagens.
4. O ativo gerado (preferencialmente GLB) é armazenado no Firebase Storage.
5. Metadados e status ficam no Firestore.
6. O resultado é visualizado em React Three Fiber.

## Stack

- Next.js 14 + TypeScript + React 18
- Tailwind CSS
- Three.js / React Three Fiber / drei
- Firebase Auth, Firestore e Storage
- Firebase App Hosting
- Genkit / Google AI onde aplicável

## Desenvolvimento local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Preencha `.env.local` com a configuração Web do seu projeto Firebase. Nunca envie credenciais privadas, service-account JSON ou chaves de servidor para o GitHub.

## Firebase

A inicialização cliente fica em `src/lib/firebase.ts`.

Variáveis esperadas:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (opcional)

O repositório já contém `apphosting.yaml` para Firebase App Hosting. A vinculação final do backend ao projeto Firebase é feita no Firebase Console, selecionando este repositório e a branch `github`.

## Codex Cloud

Ao abrir este repositório no Codex, use a branch `github`. As instruções permanentes do projeto estão em `AGENTS.md`.

Primeiro alvo recomendado para o Codex: implementar `/studio/3d` com upload/câmera, múltiplos ângulos, dimensões reais opcionais, job de geração, status e preview interativo.

## Verificação automática

O GitHub Actions executa `npm ci`, `npm run typecheck` e `npm run build` em pushes e pull requests para `github`.
