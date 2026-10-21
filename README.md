# mailings-assets

Assets públicos (imágenes, PDF, .ics) de los mailings HTML de Studio Nomade,
servidos en **https://assets.studionomade.cl** (proyecto Vercel `mailings-assets`,
team `studio-nomade`). Cada push a `main` publica vía el GitHub Action
`Publicar assets`, que usa el secreto `VERCEL_DEPLOY_HOOK`.

## URL y estructura

```
https://assets.studionomade.cl/mailings/<cliente>/<AAAAMMDD_evento>/<NN_AAAAMMDD_envio>/<archivo>
```

| Nivel | Formato | Ejemplo |
|---|---|---|
| Cliente | slug | `capital-ya`, `equifax`, `mora-control`, `red-interactiva`, `studio-nomade` |
| Evento / campaña | `AAAAMMDD_slug` (fecha de inicio del evento, igual que la carpeta local) | `20260720_reconexion-de-cuenta` |
| Envío | `NN_AAAAMMDD_slug` (correlativo + fecha de envío) | `01_20261001_invitacion`, `02_20261006_recordatorio` |
| Archivo | `slug.ext`, versiones con `-v2`, `-v3` | `hero.jpg`, `cta-inscribete-v2.png` |

Ejemplo completo:
`https://assets.studionomade.cl/mailings/capital-ya/20260720_reconexion-de-cuenta/01_20260720_aviso/hero.jpg`

### Correspondencia con la carpeta local `20260216_MAILINGS 2026`

La carpeta local `20260720_Capital Ya Reconexión de Cuenta` → cliente `capital-ya`,
evento `20260720_reconexion-de-cuenta`. El cliente sale del nombre o de la carpeta del
cliente; si no es evidente, se confirma antes de publicar. Las fechas se mantienen; el nombre se
convierte a slug (minúsculas, sin tildes ni ñ, espacios y símbolos → `-`).

## Reglas

1. **Nunca sobrescribir, renombrar ni borrar** un archivo publicado: hay correos
   enviados apuntando a esa URL y la caché es `immutable` (1 año). Si cambia, se sube
   `-v2` y se actualiza el HTML.
2. Formatos: `png`, `jpg`/`jpeg`, `gif`, `pdf`, `ics`. Nada de SVG ni WebP (Outlook y
   Gmail no los soportan de forma confiable).
3. Peso: imágenes < 300 KB (ideal < 150 KB), máximo duro 1 MB. Ancho recomendado
   1200 px para un layout de 600 px (2x retina).
4. Sin datos personales de destinatarios, bases de datos ni HTML con datos de clientes:
   este repo es solo de assets públicos. Las BBDD y los HTML fuente viven en Drive /
   `noma-ops`.
5. Antes de cada commit: `node scripts/validar.mjs --staged`.

## Publicar

```bash
git add mailings/<cliente>/<evento>/<envio>/
node scripts/validar.mjs --staged
git commit -m "mailings(<cliente>): <evento> / <envio>"
git push origin main
# El Action "Publicar assets" valida, publica en Vercel (deploy hook) y espera a que
# cada URL nueva responda 200. Verificar que terminó en success:
gh api "repos/Studio-Nomade/mailings-assets/actions/runs?head_sha=$(git rev-parse HEAD)" \
  --jq '.workflow_runs[0] | .status + " " + (.conclusion // "")'   # completed success
```

## Futuro (Noma)

El módulo de mailings de Noma subirá a un bucket público de Supabase Storage con la
misma nomenclatura; este proyecto Vercel servirá primero lo que esté en el repo y, si
no existe, hará fallback al bucket (rewrite en `vercel.json`). La URL pública no cambia.
