# Prompt para chats: correo HTML + subida automática de assets

Pega este bloque al inicio de una conversación en la que desarrolles un correo HTML.
Completa solo lo que está entre `[ ]`; lo demás Claude lo deduce o lo pregunta una vez.

---

Vamos a desarrollar un correo HTML de Studio Nomade y a publicar sus assets en
`https://assets.studionomade.cl`.

**Datos del envío**
- Cliente: [ej. Capital Ya]
- Evento / campaña: [ej. Desayuno Expo Real Estate] — fecha del evento: [AAAAMMDD]
- Envío: [ej. Invitación] — fecha de envío: [AAAAMMDD]
- Carpeta local: `20260216_MAILINGS 2026/[AAAAMMDD_Nombre del evento]` (o adjunto los archivos)
- Plataforma de envío: [Mailchimp / Brevo / Gmail / otra]

**Qué hacer con los assets (sin pedirme autorización en cada paso)**
1. Conecta el repo `Studio-Nomade/mailings-assets` con acceso de escritura (herramienta
   `add_repo`, owner `Studio-Nomade`, repo `mailings-assets`, access `push`; yo apruebo la
   tarjeta), clónalo y sigue su `CLAUDE.md` y `README.md`. Si esta conversación no tiene
   herramientas de GitHub, deja los assets en `assets/` dentro de la carpeta local del
   envío, con el HTML ya apuntando a las URLs finales, y avísame para publicarlos desde
   una sesión con acceso.
2. Arma la ruta `mailings/<cliente>/<AAAAMMDD_evento>/<NN_AAAAMMDD_envio>/`:
   slugs en minúsculas, sin tildes ni ñ, con guiones. Si el cliente o el evento ya
   existen en el repo, reutiliza esas carpetas y usa el siguiente `NN` para el envío.
   Pregúntame solo si el cliente no es evidente.
3. Toma las imágenes desde la carpeta local (si el chat está conectado a mi computador) o
   desde los adjuntos. Optimízalas: 1200 px de ancho para un layout de 600 px, JPG
   calidad ~80 para fotos, PNG para piezas con texto o transparencia, GIF solo si es
   animado; sin metadatos; < 300 KB cada una. Renómbralas con slugs descriptivos
   (`hero.jpg`, `logo-cliente.png`, `cta-inscribete.png`).
4. Nunca sobrescribas un archivo ya publicado: si cambia, súbelo como `-v2`.
5. Valida (`node scripts/validar.mjs --staged`), haz commit a `main`
   (`mailings(<cliente>): <evento> / <envio>`) y push.
6. Confirma que quedó publicado: el Action "Publicar assets" del commit debe terminar en
   `success` (ver sección de verificación del `CLAUDE.md`).
7. Reemplaza en el HTML todos los `src` y `background` por las URLs absolutas
   `https://assets.studionomade.cl/mailings/...`, con `alt`, `width` y `height`.
8. Entrégame: el HTML final como archivo, la tabla de URLs publicadas y, si el chat
   está conectado a mi computador, guarda el HTML final en la carpeta local del envío
   como `AAAAMMDD_<evento>_<envio>.html`.

**Reglas del HTML**: tablas y estilos inline, ancho 600 px, compatible con Outlook y
Gmail (sin SVG, sin WebP, sin JS), texto real y no imágenes para el contenido clave,
preheader, link de desuscripción según la plataforma. Las bases de datos y datos
personales nunca van al repo de assets.

---
