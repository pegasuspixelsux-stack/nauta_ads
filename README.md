# Nauta

Marketplace y directorio náutico (embarcaciones nuevas y usadas, motores y repuestos, servicios, trámites y eventos). Next.js App Router · TypeScript · Tailwind CSS · Firebase (Auth, Firestore, Storage) · Vercel.

## Desarrollo

```bash
cp .env.example .env.local   # completá las claves de Firebase
npm run dev
```

## Flujo de publicación

1. Cualquier persona publica en `/publicar` **sin registrarse**. Las fotos se comprimen a WebP en el dispositivo antes de subir.
2. El aviso se crea con estado `pending_review` en `boats/{id}`; el contacto del anunciante va a `boats/{id}/private/owner` (solo lo lee el staff).
3. En `/dashboard/boats` el administrador revisa fotos, especificaciones y estado legal (bandera, documentación, HIN), carga el **link de pago** ($99 particulares / paquete para brokers) y pasa el aviso a `awaiting_payment`.
4. Con el **pago confirmado** el aviso pasa a `active` y aparece en el sitio público.

## Scripts

- `node scripts/seed-boats.mjs <service-account.json>`: carga datos de demostración.
- `node scripts/deploy-rules.mjs`: publica `firestore.rules` y `storage.rules`.
- `node scripts/make-admin.mjs`: crea el primer administrador.

> Las colecciones `cars`, `leads` antiguas y el documento `settings/dealership` de la versión previa ya no se usan; la configuración vive en `settings/site`.
