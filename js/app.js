(function () {
  document.documentElement.classList.add("js");
  var B = window.BRINDA, CATS = window.CATEGORIAS, PRODS = window.PRODUTOS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var catDe = function (id) { return CATS.filter(function (c) { return c.id === id; })[0] || {}; };
  /* link do produto: só o nome (sem código nem fornecedor); nomes repetidos ganham -2, -3... */
  var slugar = function (t) { return String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); };
  (function () { var usados = {}; PRODS.forEach(function (p) { var b = slugar(String(p.nome).replace(new RegExp("(^|[^a-z0-9])" + String(p.codigo || "x").replace(/[^A-Za-z0-9]/g, "") + "($|[^a-z0-9])", "ig"), " ")) || "produto", s = b, n = 1; while (usados[s]) s = b + "-" + (++n); usados[s] = 1; p.slug = s; }); })();
  var porSlug = function (s) { return PRODS.filter(function (p) { return p.slug === s; })[0]; };
  var porId = function (id) { return PRODS.filter(function (p) { return p.id === id; })[0]; };

  /* ---------- orçamento (guardado no navegador) ---------- */
  var orc = [];
  try { orc = JSON.parse(localStorage.getItem("brinda_orc") || "[]"); } catch (e) {}
  orc = orc.filter(function (i) { return porId(i.id); });
  function salvar() { try { localStorage.setItem("brinda_orc", JSON.stringify(orc)); } catch (e) {} atualizar(); }

  function adicionar(id) {
    var it = orc.filter(function (i) { return i.id === id; })[0];
    if (it) it.qtd += 0; else orc.push({ id: id, qtd: 100 });
    salvar(); aviso("Adicionado ao orçamento");
  }
  function aviso(t) {
    var a = $("#aviso"); a.textContent = t; a.classList.add("on");
    clearTimeout(aviso.t); aviso.t = setTimeout(function () { a.classList.remove("on"); }, 1800);
  }

  /* ---------- estrutura comum ---------- */
  var pagina = document.body.getAttribute("data-pagina");
  var pref = pagina === "home" ? "" : "index.html";
  $("#topo").innerHTML =
    '<header class="site"><div class="wrap"><a href="index.html" class="logo"><img src="img/logo-claro.png" alt="Brinda Personalizados"></a>' +
    '<nav id="nav"><a href="index.html#sobre">Quem somos</a><a href="index.html#fazemos">O que fazemos</a><a href="index.html#clientes">Quem atendemos</a>' +
    '<a href="catalogo.html"' + (pagina === "catalogo" ? ' class="ativo"' : '') + '>Catálogo</a><a href="index.html#contato">Contato</a></nav>' +
    '<button class="btn btn-vinho btn-orc" id="abrir-orc"><span class="t">Meu orçamento</span> <span class="n" id="cont">0</span></button>' +
    '<button class="menu-btn" id="menu" aria-label="Menu">☰</button></div></header>';

  $("#rodape").innerHTML =
    '<footer><div class="wrap"><div><div class="logo"><img src="img/logo-claro.png" alt="Brinda Personalizados"></div><p style="margin-top:10px;max-width:320px">Brindes que fazem a sua marca ser lembrada.</p></div>' +
    '<div><h4>Navegue</h4><a href="index.html#sobre">Quem somos</a><a href="index.html#fazemos">O que fazemos</a><a href="index.html#clientes">Quem atendemos</a><a href="catalogo.html">Catálogo online</a></div>' +
    '<div><h4>Contato</h4><a href="https://wa.me/' + B.whatsapp + '">' + esc(B.whatsappExibicao) + ' (WhatsApp)</a><a href="mailto:' + B.email + '">' + esc(B.email) + '</a><a href="' + B.instagram + '" target="_blank" rel="noopener">Instagram</a><span>' + esc(B.endereco) + '</span></div>' +
    '<div class="copy">© ' + new Date().getFullYear() + ' ' + esc(B.nome) + '. Todos os direitos reservados.</div></div></footer>' +
    '<a class="wpp" href="https://wa.me/' + B.whatsapp + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200c0 1.300.9 2.500 1 2.700.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.5-.3z"/></svg></a>' +
    '<div class="overlay" id="ov"></div><div class="aviso" id="aviso"></div>' +
    '<aside class="gaveta" id="gaveta"><header><h3>Meu orçamento</h3><button class="x" id="fechar-orc" aria-label="Fechar">✕</button></header>' +
    '<div class="corpo" id="orc-corpo"></div>' +
    '<footer id="orc-rod"><button class="btn btn-vinho" id="enviar-orc">Solicitar Orçamento</button><button class="btn btn-sec btn-wa" id="contato-wpp"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200c0 1.300.9 2.500 1 2.700.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.5-.3z"/></svg> Entrar em contato</button></footer></aside>' +
    '<div class="modal" id="modal"></div>';

  /* ---------- gaveta ---------- */
  function abrirOrc() { renderOrc(); $("#gaveta").classList.add("on"); $("#ov").classList.add("on"); }
  function fechar() {
    $("#gaveta").classList.remove("on"); $("#modal").classList.remove("on"); $("#ov").classList.remove("on");
    try { var u = new URL(location.href); if (u.searchParams.has("p")) { u.searchParams.delete("p"); history.replaceState(null, "", u.pathname + u.search + u.hash); } } catch (e) {}
  }
  $("#abrir-orc").onclick = abrirOrc; $("#fechar-orc").onclick = fechar; $("#ov").onclick = fechar;
  $("#menu").onclick = function () { $("#nav").classList.toggle("on"); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });

  PRODS.forEach(function (p) { if (!p.fotos) p.fotos = p.foto ? [p.foto] : []; });
  // categorias sem produto ficam escondidas; aparecem sozinhas quando receberem o primeiro produto
  CATS = CATS.filter(function (c) { return PRODS.some(function (p) { return p.categoria === c.id; }); });
  function mini(p) { return p.fotos.length ? '<img src="' + esc(p.fotos[0]) + '" alt="' + esc(p.nome) + '" loading="lazy">' : catDe(p.categoria).icone || "🎁"; }

  function renderOrc() {
    var c = $("#orc-corpo"), rod = $("#orc-rod");
    if (!orc.length) {
      c.innerHTML = '<div class="vazio-orc">Seu orçamento está vazio.<br>Escolha produtos no catálogo e clique em “Solicitar orçamento”.<br><br><a class="btn btn-pet btn-sm" href="catalogo.html">Ver catálogo</a></div>';
      rod.style.display = "none"; return;
    }
    rod.style.display = "grid";
    var h = orc.map(function (i) {
      var p = porId(i.id);
      return '<div class="item-orc"><div class="mini">' + mini(p) + '</div><div><b>' + esc(p.nome) + '</b><div class="qtd">Qtd.: <input type="number" min="1" value="' + i.qtd + '" data-q="' + i.id + '"></div></div><button class="rem" data-r="' + i.id + '" aria-label="Remover">✕</button></div>';
    }).join("");
    h += '<div class="dados"><h4>Seus dados</h4>' +
      '<div class="campo"><label>Nome *</label><input id="f-nome" autocomplete="name"></div>' +
      '<div class="campo"><label>Empresa</label><input id="f-emp" autocomplete="organization"></div>' +
      '<div class="duas"><div class="campo"><label>WhatsApp / telefone *</label><input id="f-tel" autocomplete="tel"></div><div class="campo"><label>E-mail</label><input id="f-mail" type="email" autocomplete="email"></div></div>' +
      '<div class="campo"><label>Observações (prazo, cores, logo…)</label><textarea id="f-obs"></textarea></div>' +
      '<div class="isca" aria-hidden="true"><label>Não preencha</label><input id="f-site" tabindex="-1" autocomplete="off"></div></div>';
    c.innerHTML = h;
    c.querySelectorAll("[data-q]").forEach(function (el) {
      el.onchange = function () { var it = orc.filter(function (i) { return i.id === el.dataset.q; })[0]; it.qtd = Math.max(1, parseInt(el.value, 10) || 1); salvar(); };
    });
    c.querySelectorAll("[data-r]").forEach(function (el) {
      el.onclick = function () { orc = orc.filter(function (i) { return i.id !== el.dataset.r; }); salvar(); renderOrc(); };
    });
  }

  function dados() {
    var v = function (id) { return ($(id) && $(id).value || "").trim(); };
    var d = { nome: v("#f-nome"), empresa: v("#f-emp"), telefone: v("#f-tel"), email: v("#f-mail"), obs: v("#f-obs"), website: v("#f-site") };
    var dig = d.telefone.replace(/\D/g, "");
    if (d.nome.length < 2) { aviso("Informe seu nome"); return null; }
    if (dig.length < 10 || dig.length > 13) { aviso("Informe o telefone com DDD"); return null; }
    return d;
  }
  function mensagem(d, numero) {
    var l = [numero ? "Olá! Acabei de solicitar o orçamento nº " + numero + " pelo site e gostaria de dar continuidade." : "Olá! Gostaria de solicitar um orçamento:", ""];
    orc.forEach(function (i) { l.push("• " + porId(i.id).nome + " — " + i.qtd + " un"); });
    l.push("", "Nome: " + d.nome);
    if (d.empresa) l.push("Empresa: " + d.empresa);
    l.push("Telefone: " + d.telefone);
    if (d.email) l.push("E-mail: " + d.email);
    if (d.obs) l.push("Obs.: " + d.obs);
    return l.join("\n");
  }
  // registra o orçamento no sistema da Brinda (card automático). Se falhar, o envio por WhatsApp/e-mail continua funcionando.
  function registrar(d) {
    if (!B.api) return Promise.resolve({ ok: false, semApi: true });
    var corpo = {
      nome: d.nome, telefone: d.telefone, empresa: d.empresa || undefined, email: d.email || undefined, observacoes: d.obs || undefined, website: d.website,
      itens: orc.map(function (i) {
        var p = porId(i.id);
        return { codigo: p.codigo || p.id, nome: p.nome, quantidade: i.qtd, categoria: catDe(p.categoria).nome, fornecedor: /^xbz-/.test(p.id) ? "XBZ" : "Asia Import" };
      })
    };
    var ctl = window.AbortController ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
    return fetch(B.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j.status = r.status; return j; }); })
      .catch(function () { return { ok: false, rede: true }; })
      .then(function (j) { if (t) clearTimeout(t); return j; });
  }
  var enviando = false;
  var listaTexto = function () { return orc.map(function (i) { return "• " + porId(i.id).nome + " — " + i.qtd + " un"; }).join("\n"); };

  // Botão "Entrar em contato": abre o WhatsApp já com a lista de itens, sem exigir cadastro.
  function contatoWpp() {
    var v = function (id) { return ($(id) && $(id).value || "").trim(); };
    var l = ["Olá! Gostaria de solicitar orçamento para os itens:", "", listaTexto()];
    if (v("#f-nome")) l.push("", "Nome: " + v("#f-nome") + (v("#f-emp") ? " (" + v("#f-emp") + ")" : ""));
    if (v("#f-obs")) l.push("Obs.: " + v("#f-obs"));
    window.open("https://wa.me/" + B.whatsapp + "?text=" + encodeURIComponent(l.join("\n")), "_blank");
  }

  // Botão "Solicitar Orçamento": cria o card no sistema (que também envia o e-mail de aviso).
  // Se o sistema estiver fora do ar, abre o e-mail do cliente já preenchido para não perder o pedido.
  function solicitar() {
    if (enviando) return;
    var d = dados(); if (!d) return;
    var btn = $("#enviar-orc"), rot = btn.textContent;
    enviando = true; btn.disabled = true; btn.textContent = "Enviando…";
    registrar(d).then(function (r) {
      enviando = false; btn.disabled = false; btn.textContent = rot;
      if (!r.ok && (r.status === 400 || r.status === 429)) { aviso(r.erro || "Não foi possível enviar. Tente novamente."); return; }
      if (r.ok && r.numero) {
        var n = r.numero, txt = "Olá! Acabei de solicitar o orçamento nº " + n + " pelo site.";
        orc = []; salvar();
        $("#orc-corpo").innerHTML = '<div class="vazio-orc"><b style="font-size:18px;color:var(--vinho)">Orçamento nº ' + esc(n) + ' enviado!</b><br><br>Recebemos o seu pedido e vamos retornar em breve com os valores e prazos.<br><br>' +
          '<a class="btn btn-wpp btn-sm" href="' + esc("https://wa.me/" + B.whatsapp + "?text=" + encodeURIComponent(txt)) + '" target="_blank" rel="noopener">Falar agora pelo WhatsApp</a> ' +
          '<a class="btn btn-pet btn-sm" href="catalogo.html">Voltar ao catálogo</a></div>';
        $("#orc-rod").style.display = "none";
        return;
      }
      aviso("Não conseguimos registrar agora. Abrimos o seu e-mail para você enviar o pedido.");
      var corpo = ["Olá! Gostaria de solicitar orçamento para os itens:", "", listaTexto(), "", "Nome: " + d.nome, d.empresa ? "Empresa: " + d.empresa : "", "Telefone: " + d.telefone, d.email ? "E-mail: " + d.email : "", d.obs ? "Obs.: " + d.obs : ""].filter(function (x, k, a) { return x !== "" || a[k - 1] !== ""; }).join("\n");
      location.href = "mailto:" + B.email + "?subject=" + encodeURIComponent("Solicitação de orçamento") + "&body=" + encodeURIComponent(corpo);
    });
  }
  $("#enviar-orc").onclick = solicitar;
  $("#contato-wpp").onclick = contatoWpp;


  function atualizar() { $("#cont").textContent = orc.length; }
  atualizar();

  /* ---------- produtos ---------- */
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); };
  function bolinhas(p, max, nomes) {
    var c = p.cores || []; if (!c.length) return "";
    var h = c.slice(0, max || 99).map(function (x) {
      var i = '<i class="cor" style="background:' + esc(x.hex) + '" title="' + esc(cap(x.nome)) + '"></i>';
      return nomes ? '<span class="c">' + i + esc(cap(x.nome)) + "</span>" : i;
    }).join("");
    if (max && c.length > max) h += '<em>+' + (c.length - max) + "</em>";
    return '<div class="cores' + (nomes ? " nomes" : "") + '">' + h + "</div>";
  }
  function cardProd(p) {
    return '<article class="prod rv"><div class="foto" data-ver="' + p.id + '">' + mini(p) + '</div><div class="info"><span class="cat-nome">' + esc(catDe(p.categoria).nome || "") + '</span><h3 data-ver="' + p.id + '">' + esc(p.nome) + '</h3>' + bolinhas(p, 8) + '<button class="btn btn-vinho btn-sm" data-add="' + p.id + '">Solicitar orçamento</button></div></article>';
  }
  /* ---------- animações de entrada ao rolar ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  function revelar(raiz) {
    raiz.querySelectorAll(".rv:not(.in)").forEach(function (el, i) {
      if (!el.style.getPropertyValue("--d") && /\b(prod|cat)\b/.test(el.className)) el.style.setProperty("--d", (i % 4) * 0.06 + "s");
      if (io) io.observe(el); else el.classList.add("in");
    });
  }
  function ligar(raiz) {
    revelar(raiz);
    raiz.querySelectorAll("[data-add]").forEach(function (b) { b.onclick = function () { adicionar(b.dataset.add); }; });
    raiz.querySelectorAll("[data-ver]").forEach(function (b) { b.onclick = function () { detalhe(b.dataset.ver); }; });
  }
  function detalhe(id) {
    var p = porId(id), m = $("#modal");
    var thumbs = p.fotos.length > 1 ? '<div class="thumbs">' + p.fotos.map(function (f, i) { return '<img src="' + esc(f) + '" alt="" data-t="' + i + '" class="' + (i ? "" : "ativo") + '">'; }).join("") + "</div>" : "";
    m.innerHTML = '<div class="galeria"><div class="foto">' + mini(p) + "</div>" + thumbs + '</div><div class="txt"><button class="x" id="fm">✕</button><span class="cat-nome" style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ter)">' + esc(catDe(p.categoria).nome) + '</span><h3>' + esc(p.nome) + '</h3><p>' + esc(p.descricao || "") + '</p>' + (p.cores && p.cores.length ? '<div><p style="font-size:12px;margin-bottom:6px">Cores disponíveis:</p>' + bolinhas(p, 0, false) + "</div>" : "") +
      (p.personalizacao && p.personalizacao.length ? '<div><p style="font-size:12px;margin-bottom:6px">Personalização:</p><div class="pills">' + p.personalizacao.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div></div>" : "") +
      '<div class="modal-acoes"><button class="btn btn-vinho" id="ma">Solicitar orçamento</button><button class="btn btn-link" id="mlink" type="button">Copiar link do produto</button></div></div>';
    m.classList.add("on"); $("#ov").classList.add("on");
    m.querySelectorAll("[data-t]").forEach(function (t) {
      t.onclick = function () {
        m.querySelector(".foto img").src = p.fotos[t.dataset.t];
        m.querySelectorAll("[data-t]").forEach(function (o) { o.classList.toggle("ativo", o === t); });
      };
    });
    $("#fm").onclick = fechar; $("#ma").onclick = function () { adicionar(id); fechar(); };
    var url = location.origin + location.pathname.replace(/[^/]*$/, "") + "p/" + p.slug + ".html";
    $("#mlink").onclick = function () {
      var b = this, ok = function () { b.textContent = "Link copiado!"; setTimeout(function () { b.textContent = "Copiar link do produto"; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { window.prompt("Copie o link:", url); });
      else window.prompt("Copie o link:", url);
    };
    try { var u = new URL(location.href); u.searchParams.set("p", p.slug); history.replaceState(null, "", u.pathname + u.search + u.hash); } catch (e) {}
  }

  /* ---------- home ---------- */
  var ch = $("#cats-home");
  if (ch) {
    ch.innerHTML = CATS.map(function (c) { return '<a class="cat rv" href="catalogo.html#' + c.id + '">' + (c.foto ? '<img src="' + esc(c.foto) + '" alt="" loading="lazy">' : '<span>' + c.icone + '</span>') + '<b>' + esc(c.nome) + '</b></a>'; }).join("");
    revelar(ch);
  }
  var fx = $("#faixa");
  if (fx) {
    var tx = CATS.map(function (c) { return esc(c.nome); }).join(" <i>✦</i> ") + " <i>✦</i> ";
    fx.innerHTML = "<span>" + tx + "</span><span>" + tx + "</span>";
  }
  document.querySelectorAll("[data-conta]").forEach(function (el) {
    var alvo = el.dataset.alvo ? +el.dataset.alvo : (el.dataset.conta === "produtos" ? PRODS.length : CATS.length), suf = el.dataset.suf || "";
    var rodar = function () {
      var t0 = null;
      (function passo(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3))) + (k < 1 ? "" : suf); if (k < 1) requestAnimationFrame(passo); })(performance.now());
    };
    if (!("IntersectionObserver" in window)) { el.textContent = alvo + suf; return; }
    var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { rodar(); o.disconnect(); } }, { threshold: 0.5 });
    o.observe(el);
  });
  var cab = $("header.site");
  var rolar = function () { cab.classList.toggle("rolou", window.scrollY > 8); };
  window.addEventListener("scroll", rolar, { passive: true }); rolar();
  revelar(document);
  var dh = $("#destaques");
  if (dh) {
    dh.innerHTML = PRODS.filter(function (p) { return p.destaque; }).slice(0, 8).map(cardProd).join("");
    ligar(dh);
  }
  var fc = $("#form-contato");
  if (fc) fc.onsubmit = function (e) {
    e.preventDefault();
    var f = new FormData(fc);
    var m = "Olá! Sou " + f.get("nome") + (f.get("empresa") ? " (" + f.get("empresa") + ")" : "") + ".\n" + f.get("msg") + "\nContato: " + f.get("tel") + (f.get("mail") ? " / " + f.get("mail") : "");
    window.open("https://wa.me/" + B.whatsapp + "?text=" + encodeURIComponent(m), "_blank");
  };

  /* ---------- catálogo ---------- */
  var lista = $("#lista");
  if (lista) {
    var atual = location.hash.slice(1) || new URLSearchParams(location.search).get("cat") || "todos", busca = "";
    if (!catDe(atual).id) atual = "todos";
    var contar = function (id) { return PRODS.filter(function (p) { return id === "todos" || p.categoria === id; }).length; };
    var itens = [{ id: "todos", nome: "Todos os produtos" }].concat(CATS);
    function render() {
      var btns = itens.map(function (c) { return '<button data-c="' + c.id + '" class="' + (c.id === atual ? "ativo" : "") + '">' + esc(c.nome) + "<small>" + contar(c.id) + "</small></button>"; }).join("");
      $("#lateral").innerHTML = "<h4>Categorias</h4>" + btns;
      $("#chips").innerHTML = itens.map(function (c) { return '<button data-c="' + c.id + '" class="' + (c.id === atual ? "ativo" : "") + '">' + esc(c.nome) + "</button>"; }).join("");
      document.querySelectorAll("[data-c]").forEach(function (b) { b.onclick = function () { atual = b.dataset.c; history.replaceState(null, "", "#" + atual); render(); }; });
      var q = busca.toLowerCase();
      var r = PRODS.filter(function (p) { return (atual === "todos" || p.categoria === atual) && (!q || (p.nome + " " + (p.descricao || "")).toLowerCase().indexOf(q) > -1); });
      $("#total").textContent = r.length + (r.length === 1 ? " produto" : " produtos");
      lista.innerHTML = r.length ? r.map(cardProd).join("") : '<div class="vazio">Nenhum produto encontrado. Não achou o que procura? <a href="index.html#contato" style="color:var(--vinho)">Fale com a gente</a>.</div>';
      ligar(lista);
      var ct = catDe(atual); $("#titulo-cat").textContent = ct.nome || "Todos os produtos";
    }
    $("#busca").oninput = function () { busca = this.value; render(); };
    render();
    var pedido = new URLSearchParams(location.search).get("p");
    var pp = pedido && (porSlug(pedido) || porId(pedido)); if (pp) detalhe(pp.id);
  }
})();
