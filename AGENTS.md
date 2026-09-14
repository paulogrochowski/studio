# Codex instructions — SeViu 3D / Photo-to-3D

## Mission
Treat this repository as the master codebase for the SeViu 3D product workflow.
The priority feature is the merchant tool that receives product photos and produces/attaches a usable 3D asset for web and AR visualization.

## Stack
- Next.js 14 App Router
- TypeScript
- React 18
- Tailwind CSS
- React Three Fiber / Three.js / drei
- Firebase Web SDK
- Firebase App Hosting
- Genkit / Google AI where already used

## Product priorities
1. Photo upload/capture flow for a merchant.
2. Photo-to-3D generation pipeline behind a provider abstraction so the model/provider can be replaced.
3. Job status: queued, processing, completed, failed.
4. Persist product/job metadata in Firestore.
5. Store input images and generated GLB/GLTF assets in Firebase Storage.
6. Preview generated assets with React Three Fiber.
7. Preserve real-world dimensions/scale when known.
8. Prepare assets for later AR placement, plane detection, shadows and occlusion.
9. Mobile-first UI with dark/light theme; dark mode should remain first-class.

## Firebase
Use `src/lib/firebase.ts` for Firebase client services.
Never commit secrets, service-account JSON, private keys, `.env.local`, tokens, or credentials.
Public Firebase Web SDK config is supplied through `NEXT_PUBLIC_FIREBASE_*` variables documented in `.env.example`.
For server-side privileged Firebase access, use environment secrets and Firebase Admin only when a task explicitly requires it.

## Development
Run:
- `npm ci`
- `npm run typecheck`
- `npm run build`

Before finishing a task, fix TypeScript/build errors caused by your change.

## Architecture rules
- Prefer small reusable components.
- Keep external 3D-generation providers behind interfaces/adapters.
- Do not hard-code provider API keys.
- Do not silently fake successful 3D generation. If no provider is configured, expose a clear development/demo state.
- Preserve existing functionality unless the task explicitly replaces it.
- Generated 3D assets should use GLB when practical for web delivery.

## First implementation target
Build a `/studio/3d` merchant workspace with:
- drag/drop or camera photo input;
- multiple-angle photo support;
- product name and optional real dimensions;
- Generate 3D action;
- progress/status UI;
- resulting interactive 3D preview;
- save asset metadata to the product record.

If the actual generation provider is not yet configured, implement the provider boundary and UI/data flow without inventing credentials.
