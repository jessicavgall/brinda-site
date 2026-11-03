/* Gera uma página por produto em p/<id>.html (link próprio com nome e foto no WhatsApp).
   Rode sempre que adicionar ou alterar produtos:  node tools/gerar-paginas.js */
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
global.window = { PRODUTOS: [], CATEGORIAS: [] };
["produtos", "produtos-asia", "produtos-xbz"].forEach(f => eval(fs.readFileSync(path.join(raiz, "js", f + ".js"), "utf8")));
const DOM = "https://personalizadosbrinda.com";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
fs.mkdirSync(path.join(raiz, "p"), { recursive: true });
fs.readdirSync(path.join(raiz, "p")).filter(f => f.endsWith(".html")).forEach(f => fs.unlinkSync(path.join(raiz, "p", f)));
let n = 0;
window.PRODUTOS.forEach(p => {
  const desc = (p.descricao || "").replace(/\s+/g, " ").slice(0, 150).trim();
  const alvo = "../catalogo.html?p=" + encodeURIComponent(p.id);
  const img = p.fotos && p.fotos[0] ? DOM + "/" + p.fotos[0] : DOM + "/img/og-image.jpg";
  fs.writeFileSync(path.join(raiz, "p", p.id + ".html"),
`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.nome)} | Brinda Personalizados</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Brinda Personalizados">
<meta property="og:title" content="${esc(p.nome)}">
<meta property="og:description" content="Solicite seu orçamento na Brinda Personalizados.">
<meta property="og:image" content="${esc(img)}">
<meta property="og:url" content="${DOM}/p/${esc(p.id)}.html">
<link rel="icon" type="image/png" sizes="32x32" href="../img/favicon-32.png?v=3">
<meta http-equiv="refresh" content="0;url=${alvo}">
<script>location.replace(${JSON.stringify(alvo)});</script>
</head>
<body><p><a href="${alvo}">Ver ${esc(p.nome)}</a></p></body>
</html>
`);
  n++;
});
console.log(n + " páginas geradas em p/");
