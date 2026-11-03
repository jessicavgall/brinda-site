/* Gera uma página por produto em p/<nome-do-produto>.html (sem código nem fornecedor) (link próprio com nome e foto no WhatsApp).
   Rode sempre que adicionar ou alterar produtos:  node tools/gerar-paginas.js */
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
global.window = { PRODUTOS: [], CATEGORIAS: [] };
["produtos", "produtos-asia", "produtos-xbz"].forEach(f => eval(fs.readFileSync(path.join(raiz, "js", f + ".js"), "utf8")));
const DOM = "https://personalizadosbrinda.com";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
fs.mkdirSync(path.join(raiz, "p"), { recursive: true });
fs.readdirSync(path.join(raiz, "p")).filter(f => f.endsWith(".html")).forEach(f => fs.unlinkSync(path.join(raiz, "p", f)));
const slugar = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const usados = {};
let n = 0;
window.PRODUTOS.forEach(p => {
  let b = slugar(String(p.nome).replace(new RegExp("(^|[^a-z0-9])" + String(p.codigo || "x").replace(/[^A-Za-z0-9]/g, "") + "($|[^a-z0-9])", "ig"), " ")) || "produto", s = b, k = 1;
  while (usados[s]) s = b + "-" + (++k);
  usados[s] = 1;
  const desc = (p.descricao || "").replace(/\s+/g, " ").slice(0, 150).trim();
  const alvo = "../catalogo.html?p=" + encodeURIComponent(s);
  const img = p.fotos && p.fotos[0] ? DOM + "/" + p.fotos[0] : DOM + "/img/og-image.jpg";
  fs.writeFileSync(path.join(raiz, "p", s + ".html"),
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
<meta property="og:url" content="${DOM}/p/${s}.html">
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
