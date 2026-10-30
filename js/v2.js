/* Versão 2: componentes novos da home (colunas de produtos, categorias que se expandem, faixas de nichos, barra de progresso, paralaxe) */
(function () {
  var P = window.PRODUTOS || [], C = window.CATEGORIAS || [];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var prod = function (id) { return P.filter(function (p) { return p.id === id; })[0]; };
  var foto = function (id) { var p = prod(id); return p ? (p.fotos && p.fotos[0]) || p.foto || "" : ""; };
  var $ = function (s) { return document.querySelector(s); };

  /* ---- 1. colunas de produtos do banner (uma sobe, outra desce; conteúdo duplicado para o laço ser contínuo) ---- */
  var colA = ["ca9530", "ga7610", "xbz-03005", "mc276", "cj325", "kv0150"];
  var colB = ["bac008", "xbz-18678", "co9550", "xbz-09188", "kc0201", "bt211"];
  var forma = ["", "c", "", "", "c", ""];
  function coluna(ids, cls) {
    var itens = ids.map(function (id, i) {
      var f = foto(id); if (!f) return "";
      var forma2 = (cls === "up" ? forma[i] : forma[(i + 3) % 6]);
      return '<div class="mi ' + forma2 + '"><img src="' + esc(f) + '" alt="" loading="eager"></div>';
    }).join("");
    return '<div class="mcol ' + cls + '">' + itens + itens + "</div>";
  }
  var cols = $("#hero-cols");
  if (cols) cols.innerHTML = coluna(colA, "up") + coluna(colB, "down");

  var avs = $("#avs");
  if (avs) avs.innerHTML = ["ca9530", "mc276", "kv0150"].map(function (id) { return '<img src="' + esc(foto(id)) + '" alt="">'; }).join("") + "<i>100+</i>";

  /* ---- 4. categorias: carrossel lateral (foto do produto em uso) ---- */
var ordem = ["canecas", "squeezes", "kits", "bar", "mochilas", "sacolas", "cadernos", "escritorio", "casa", "acessorios"];
var temProd = function (id) { return P.some(function (p) { return p.categoria === id; }); };
var car = $("#car");
if (car) {
  car.innerHTML = ordem.map(function (id) { return C.filter(function (c) { return c.id === id; })[0]; }).filter(function (c) { return c && temProd(c.id); }).map(function (c) {
    var n = P.filter(function (p) { return p.categoria === c.id; }).length;
    return '<a class="cc" href="catalogo.html#' + c.id + '"><span class="cc-img"><img src="img/cat-' + c.id + '.jpg" alt="' + esc(c.nome) + '" loading="lazy" draggable="false"></span><span class="cc-tx"><span><b>' + esc(c.nome) + '</b><small>' + n + ' produtos</small></span></span></a>';
  }).join("");
  var passo = function () { var c = car.querySelector(".cc"); return c ? c.getBoundingClientRect().width + 18 : 300; };
  $("#car-prev").onclick = function () { car.scrollBy({ left: -passo() * 2, behavior: "smooth" }); };
  $("#car-next").onclick = function () { car.scrollBy({ left: passo() * 2, behavior: "smooth" }); };
  var fill = $("#car-fill");
  var ant = $("#car-prev"), prox = $("#car-next");
  var barra = function () { var max = car.scrollWidth - car.clientWidth; fill.style.width = (max > 0 ? Math.max(12, (car.scrollLeft / max) * 100) : 100) + "%"; ant.classList.toggle("off", car.scrollLeft <= 4); prox.classList.toggle("off", car.scrollLeft >= max - 4); };
  car.addEventListener("scroll", barra, { passive: true }); window.addEventListener("resize", barra); barra();
  // arrastar com o mouse (no toque, a rolagem nativa já funciona)
  var down = false, x0 = 0, s0 = 0, moveu = false;
  car.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moveu = false; x0 = e.clientX; s0 = car.scrollLeft; car.classList.add("arrasta"); });
  window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - x0; if (Math.abs(dx) > 4) moveu = true; car.scrollLeft = s0 - dx; });
  window.addEventListener("pointerup", function () { if (!down) return; down = false; car.classList.remove("arrasta"); });
  car.addEventListener("click", function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
}

/* ---- 5. nichos em duas faixas que correm ---- */
  var n1 = ["Empresas e indústrias", "Escritórios de advocacia e contabilidade", "RH e onboarding", "Academias e esportes", "Casamentos e Aniversários"];
  var n2 = ["Agências e eventos", "Saúde e clínicas", "Imobiliárias e construtoras", "Restaurantes, bares e vinícolas", "Presentes para clientes e parceiros"];
  function faixa(lista) {
    var set = lista.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    var metade = set + set; // cada metade precisa ser mais larga que a tela para o laço não mostrar vão
    return metade + metade;
  }
  if ($("#n1")) $("#n1").innerHTML = faixa(n1);
  if ($("#n2")) $("#n2").innerHTML = faixa(n2);

  /* ---- barra de progresso de rolagem + paralaxe suave na foto da apresentação ---- */
  var prog = $("#prog"), img = document.querySelector(".intro-img img"), ticking = false;
  function frame() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (prog && max > 0) prog.style.transform = "scaleX(" + Math.min(1, scrollY / max) + ")";
    if (img) { var r = img.parentNode.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) img.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) * -0.07).toFixed(1) + "px"); }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", frame);
  frame();
})();
