/* Renomeia as fotos dos produtos para <nome-do-produto>-N.jpg (sem código nem fornecedor). Uso único. */
const fs = require("fs"), path = require("path"), cp = require("child_process");
const raiz = path.join(__dirname, "..");
global.window = { PRODUTOS: [], CATEGORIAS: [] };
const arqs = ["produtos", "produtos-asia", "produtos-xbz"];
arqs.forEach(f => eval(fs.readFileSync(path.join(raiz, "js", f + ".js"), "utf8")));
const slugar = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const usados = {}, mapa = {};
window.PRODUTOS.forEach(p => {
  let b = slugar(String(p.nome).replace(new RegExp("(^|[^a-z0-9])" + String(p.codigo || "x").replace(/[^A-Za-z0-9]/g, "") + "($|[^a-z0-9])", "ig"), " ")) || "produto", s = b, k = 1;
  while (usados[s]) s = b + "-" + (++k);
  usados[s] = 1;
  (p.fotos || []).forEach((f, i) => { mapa[f] = "img/" + s + "-" + (i + 1) + path.extname(f); });
});
const novos = Object.values(mapa);
if (new Set(novos).size !== novos.length) throw new Error("nomes repetidos");
// copia primeiro (evita colisão), depois troca as referências, depois apaga os antigos
Object.entries(mapa).forEach(([a, b]) => fs.copyFileSync(path.join(raiz, a), path.join(raiz, b + ".tmp")));
arqs.forEach(f => {
  const fp = path.join(raiz, "js", f + ".js"); let s = fs.readFileSync(fp, "utf8");
  Object.entries(mapa).forEach(([a, b]) => { s = s.split('"' + a + '"').join('"' + b + '"'); });
  fs.writeFileSync(fp, s);
});
Object.keys(mapa).forEach(a => { try { fs.unlinkSync(path.join(raiz, a)); } catch (e) {} });
Object.values(mapa).forEach(b => fs.renameSync(path.join(raiz, b + ".tmp"), path.join(raiz, b)));
console.log(Object.keys(mapa).length + " fotos renomeadas");
