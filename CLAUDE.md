# mailings-assets — guía para agentes

Lee `README.md`: define la URL pública, la nomenclatura y las reglas. Resumen:

- Ruta: `mailings/<cliente>/<AAAAMMDD_evento>/<NN_AAAAMMDD_envio>/<archivo>` →
  `https://assets.studionomade.cl/mailings/...`
- Slugs en minúsculas, sin tildes, guiones. Fechas reales del evento y del envío.
- Antes de crear un evento nuevo, lista `mailings/<cliente>/` y reutiliza el evento si ya
  existe; el envío nuevo toma el siguiente `NN`.
- **Nunca** modificar, renombrar ni borrar archivos ya publicados → subir `-v2`.
- Solo `png|jpg|jpeg|gif|pdf|ics`; imágenes optimizadas (< 300 KB, ancho 1200 px).
- Nada de datos personales, BBDD ni HTML fuente en este repo.
- Commit directo a `main` con mensaje `mailings(<cliente>): <evento> / <envio>`, luego
  `git push origin main`.
- Cada push a `main` dispara el Action **Publicar assets** (`.github/workflows/publicar.yml`):
  valida, publica en Vercel y espera a que cada URL nueva responda `200`. Verifica que
  terminó en `success` (el entorno de Claude no alcanza el dominio, GitHub sí):
  `gh api "repos/Studio-Nomade/mailings-assets/actions/runs?head_sha=$(git rev-parse HEAD)" --jq '.workflow_runs[0] | .status + " " + (.conclusion // "")'`
  hasta `completed success` (~1–2 min; reintentar cada 20 s, máx. 6 min; si `gh` falla
  por token, usa `env -u GH_TOKEN gh api ...`). Si termina en `failure`, revisa el log
  (`gh run view --log-failed`) y avisa.
- Correr `node scripts/validar.mjs --staged` antes de cada commit.
