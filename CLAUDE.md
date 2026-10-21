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
- Verificar el deploy por GitHub (el entorno de Claude no alcanza el dominio):
  `gh api repos/Studio-Nomade/mailings-assets/commits/$(git rev-parse HEAD)/status --jq .state`
  hasta que diga `success` (~30–90 s; reintentar cada 20 s, máx. 5 min). Si hay
  navegador o WebFetch disponible, abrir además una de las URLs.
- Correr `node scripts/validar.mjs --staged` antes de cada commit.
