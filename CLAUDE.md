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
  `git push origin main` y verificar con `curl -sI` que cada URL responde `200`
  (esperar ~60 s el deploy de Vercel; reintentar hasta 3 min).
- Correr `node scripts/validar.mjs --staged` antes de cada commit.
