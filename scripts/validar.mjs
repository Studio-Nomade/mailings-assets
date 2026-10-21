#!/usr/bin/env node
// Valida la nomenclatura de mailings/ y que no se sobrescriban ni borren assets ya publicados.
// Uso: node scripts/validar.mjs            (revisa todo mailings/ + cambios en stage)
//      node scripts/validar.mjs --staged   (revisa solo lo que está en stage)
//      node scripts/validar.mjs --range <base>..<head>  (CI: revisa los commits del push)
import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const MAX_BYTES = 1024 * 1024; // 1 MB por archivo (recomendado < 300 KB para imágenes)
const SLUG = "[a-z0-9]+(?:-[a-z0-9]+)*";
const RE = new RegExp(
  `^mailings/(${SLUG})/(\\d{8})_(${SLUG})/(\\d{2})_(\\d{8})_(${SLUG})/(${SLUG}(?:-v\\d+)?)\\.(png|jpe?g|gif|pdf|ics)$`
);
const IGNORADOS = new Set(["mailings/.gitkeep", "mailings/_healthcheck.txt"]);

const git = (cmd) =>
  execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const errores = [];
const avisos = [];

function validarFecha(s) {
  const y = +s.slice(0, 4), m = +s.slice(4, 6), d = +s.slice(6, 8);
  const f = new Date(Date.UTC(y, m - 1, d));
  return f.getUTCFullYear() === y && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

function validarRuta(ruta, bytes) {
  if (IGNORADOS.has(ruta)) return;
  const m = ruta.match(RE);
  if (!m) {
    errores.push(`Nomenclatura inválida: ${ruta}`);
    return;
  }
  const [, , fEvento, , , fEnvio] = m;
  if (!validarFecha(fEvento)) errores.push(`Fecha de evento inválida (${fEvento}): ${ruta}`);
  if (!validarFecha(fEnvio)) errores.push(`Fecha de envío inválida (${fEnvio}): ${ruta}`);
  if (bytes > MAX_BYTES) errores.push(`Archivo > 1 MB (${(bytes / 1024).toFixed(0)} KB): ${ruta}`);
  else if (bytes > 300 * 1024 && /\.(png|jpe?g|gif)$/.test(ruta))
    avisos.push(`Imagen pesada (${(bytes / 1024).toFixed(0)} KB), conviene optimizar: ${ruta}`);
}

function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) recorrer(p);
    else validarRuta(relative(ROOT, p).split("\\").join("/"), st.size);
  }
}

const soloStaged = process.argv.includes("--staged");
const iRange = process.argv.indexOf("--range");
const rango = iRange > -1 ? process.argv[iRange + 1] : null;
const hayHead = (() => { try { git("rev-parse --verify HEAD"); return true; } catch { return false; } })();

if (rango) {
  const lista = (filtro) =>
    git(`diff --name-only --diff-filter=${filtro} ${rango} -- mailings/`).split("\n").filter(Boolean);
  for (const r of lista("MDR").filter((r) => !IGNORADOS.has(r)))
    errores.push(`Prohibido modificar/borrar/renombrar un asset publicado: ${r} (sube una versión nueva -v2)`);
  for (const r of lista("A")) validarRuta(r, statSync(join(ROOT, r)).size);
} else if (hayHead) {
  // Nunca modificar ni borrar un asset publicado: los correos enviados apuntan a esas URLs.
  const cambiados = git("diff --cached --name-only --diff-filter=MDR -- mailings/")
    .split("\n").filter(Boolean).filter((r) => !IGNORADOS.has(r));
  for (const r of cambiados) errores.push(`Prohibido modificar/borrar/renombrar un asset publicado: ${r} (sube una versión nueva -v2)`);
}

if (rango) {
  // ya revisado arriba
} else if (soloStaged) {
  const nuevos = git("diff --cached --name-only --diff-filter=A -- mailings/").split("\n").filter(Boolean);
  for (const r of nuevos) validarRuta(r, statSync(join(ROOT, r)).size);
} else {
  recorrer(join(ROOT, "mailings"));
}

for (const a of avisos) console.warn(`⚠️  ${a}`);
if (errores.length) {
  for (const e of errores) console.error(`✖ ${e}`);
  process.exit(1);
}
console.log("✔ mailings/ válido");
