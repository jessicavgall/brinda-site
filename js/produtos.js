/*
  CATÁLOGO DA BRINDA
  ------------------
  Para cadastrar um produto, copie um bloco da lista PRODUTOS e preencha:
    id         identificador único (sem espaços)
    nome       nome do produto
    categoria  um dos "id" da lista CATEGORIAS abaixo
    descricao  texto curto
    foto       caminho da imagem, ex.: "img/caneca-ceramica.jpg" (deixe "" para usar o ícone da categoria)
    personalizacao  formas de personalização disponíveis
    destaque   true para aparecer na página inicial
  Não existe preço: o cliente apenas solicita orçamento.
*/
/* "foto" de cada categoria: imagem usada nos atalhos da home (pode trocar pelo caminho de outra foto) */
window.CATEGORIAS = [
  { id: "canecas",     nome: "Canecas e Copos",         icone: "☕" , foto: "img/ca9530-1.jpg" },
  { id: "squeezes",    nome: "Squeezes e Garrafas",     icone: "🧴" , foto: "img/ga7610-1.jpg" },
  { id: "escritorio",  nome: "Canetas e Escritório",    icone: "🖊️" , foto: "img/xbz-08170-1.jpg" },
  { id: "cadernos",    nome: "Cadernos e Blocos",       icone: "📓" , foto: "img/xbz-03005-1.jpg" },
  { id: "sustentaveis",nome: "Sustentáveis",            icone: "🌱" },
  { id: "tecnologicos",nome: "Tecnológicos",            icone: "🔌" },
  { id: "vestuario",   nome: "Vestuário e Bonés",       icone: "👕" },
  { id: "sacolas",     nome: "Sacolas e Bolsas Térmicas", icone: "🛍️" , foto: "img/bac008-1.jpg" },
  { id: "mochilas",    nome: "Mochilas e Acessórios",   icone: "🎒" , foto: "img/mc276-1.jpg" },
  { id: "bar",         nome: "Bar, Vinho e Churrasco",  icone: "🍷" , foto: "img/kv0150-1.jpg" },
  { id: "casa",        nome: "Casa e Cozinha",          icone: "🍽️" , foto: "img/xbz-18947-1.jpg" },
  { id: "acessorios", nome: "Acessórios e Diversos",   icone: "🧰" , foto: "img/xbz-06085-1.jpg" },
  { id: "kits",        nome: "Kits Corporativos",       icone: "🎁" , foto: "img/cj325-1.jpg" }
];

window.PRODUTOS = [
  {"id":"cj325","codigo":"CJ325","nome":"Kit Escritório Caderno, Caneca e Caneta Metálica","categoria":"kits","descricao":"Caderno A5 em RPET com detalhe em bambu (80 folhas pautadas), porta-copos em bambu, caneca de cerâmica 550 ml com alça em bambu e caneta metálica com detalhe em bambu. Acompanha caixa presenteável.","personalizacao":["Sob consulta"],"destaque":true,"cores":[{"nome":"Preto","hex":"#000"}],"fotos":["img/cj325-1.jpg","img/cj325-2.jpg","img/cj325-3.jpg","img/cj325-4.jpg"]},
  {"id":"cj410","codigo":"CJ410","nome":"Kit Escritório Caderno, Caneca e Caneta Metálica","categoria":"kits","descricao":"Caderno A5 capa dura (80 folhas pautadas, marcador de página e elástico), caneta esferográfica metálica e caneca de cerâmica 350 ml. Acompanha caixa presenteável.","personalizacao":["Sob consulta"],"destaque":true,"cores":[{"nome":"Preto","hex":"#000"}],"fotos":["img/cj410-1.jpg","img/cj410-2.jpg","img/cj410-3.jpg","img/cj410-4.jpg"]}
];
