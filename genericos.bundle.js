/**
 * genericos.bundle.js
 * Dataset de genéricos do SUS (elenco do Programa Farmácia Popular 2025) + utilidades de busca e ENDPOINTS Express.
 * Fontes oficiais:
 *  - Elenco Farmácia Popular (atualizado em 21/01/2025): https://www.gov.br/saude/.../elenco-de-medicamentos-e-insumos.pdf
 *  - Página do Programa Farmácia Popular (gratuidade desde 14/02/2025): https://www.gov.br/saude/.../farmacia-popular
 *  - ANVISA – Genéricos (bioequivalência e preço >= 35% mais barato): https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/genericos
 *  - CMED – Listas de Preços de Medicamentos (PMC/PF): https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos
 *
 * Uso:
 *   const { initGenericosAPI, searchGenericos, formatResumo, retailers } = require("./genericos.bundle");
 *   initGenericosAPI(app, { basePath: "/api/genericos" });
 *
 * Observação importante (segurança): muitos itens são de venda sob PRESCRIÇÃO. Sempre siga a orientação médica.
 */

"use strict";

const express = require("express");

/* ===========================
 * CONSTANTES E FONTES
 * =========================== */

const SOURCES = {
  pfpb_pdf: {
    name: "Elenco Farmácia Popular 2025 (21/01/2025)",
    url: "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular/arquivos/elenco-de-medicamentos-e-insumos.pdf",
    updated_at: "2025-01-21",
  },
  pfpb_program: {
    name: "Página do Programa Farmácia Popular (gratuidade desde 14/02/2025)",
    url: "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular",
    updated_at: "2025-02-14",
  },
  anvisa_generics: {
    name: "ANVISA – Medicamentos Genéricos (bioequivalência e preço)",
    url: "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/genericos",
  },
  cmed_prices: {
    name: "ANVISA/CMED – Listas de Preços de Medicamentos",
    url: "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos",
  },
};

/** Redes varejistas com busca por termo (para montar links de compra).
 *  Observação: preços/estoque variam por região; verifique prescrição quando exigida.
 */
const retailers = [
  { name: "Drogasil", base: "https://www.drogasil.com.br/search?w=" },
  { name: "Droga Raia", base: "https://www.drogaraia.com.br/search?w=" },
  {
    name: "Drogaria São Paulo (DPSP)",
    base: "https://www.drogariasaopaulo.com.br/search?ft=",
  },
  { name: "Pague Menos", base: "https://www.paguemenos.com.br/busca?q=" },
  { name: "Panvel", base: "https://www.panvel.com/panvel/busca?busca=" },
  { name: "Ultrafarma", base: "https://www.ultrafarma.com.br/busca?terms=" },
];

/* ===========================
 * HELPERS
 * =========================== */

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s:/.+-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildRetailerLinks(query) {
  const q = encodeURIComponent(query);
  return retailers.map((r) => ({ retailer: r.name, url: `${r.base}${q}` }));
}

function formatResumo(item) {
  const preco =
    "Genéricos custam pelo menos ~35% menos que o referência (ANVISA/Lei 9.787/99).";
  const pf = item.pfpb?.gratuito
    ? "Disponível gratuitamente no Programa Farmácia Popular."
    : "Elegível ao Programa Farmácia Popular.";
  const rx = item.rx_required
    ? "Venda sob prescrição."
    : "Pode ser isento de prescrição.";
  const formas = item.formas?.length
    ? `Formas: ${item.formas.join(", ")}.`
    : "";
  const doses = item.dosagens?.length
    ? `Dosagens contempladas: ${item.dosagens.join(", ")}.`
    : "";
  return `${
    item.dcb
  } — ${item.grupo.toUpperCase()}. ${pf} ${rx} ${formas} ${doses} ${preco}`
    .replace(/\s+/g, " ")
    .trim();
}

/* ===========================
 * DATASET: Elenco Farmácia Popular (PFPB 2025)
 * =========================== */

const genericos = [
  // ---------- ASMA ----------
  {
    id: "ipratrópio-0-02mg",
    dcb: "Brometo de ipratrópio 0,02 mg",
    grupo: "asma",
    dosagens: ["0,02 mg"],
    formas: ["inalador/pulmão (solução/MDI)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    equivalencia: { bioequivalente: true, fonte: SOURCES.anvisa_generics.url },
    economia_esperada: {
      minimo_pct: 35,
      tipico_pct: "35–70",
      fonte: SOURCES.anvisa_generics.url,
    },
    compra: buildRetailerLinks("ipratrópio 0,02 mg"),
    fontes: [
      SOURCES.pfpb_pdf.url,
      SOURCES.pfpb_program.url,
      SOURCES.anvisa_generics.url,
      SOURCES.cmed_prices.url,
    ],
  },
  {
    id: "ipratrópio-0-25mg",
    dcb: "Brometo de ipratrópio 0,25 mg",
    grupo: "asma",
    dosagens: ["0,25 mg"],
    formas: ["nebulização (solução)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    equivalencia: { bioequivalente: true, fonte: SOURCES.anvisa_generics.url },
    economia_esperada: {
      minimo_pct: 35,
      tipico_pct: "35–70",
      fonte: SOURCES.anvisa_generics.url,
    },
    compra: buildRetailerLinks("ipratrópio 0,25 mg"),
    fontes: [SOURCES.pfpb_pdf.url, SOURCES.pfpb_program.url],
  },
  {
    id: "beclometasona-200mcg",
    dcb: "Dipropionato de beclometasona 200 mcg",
    grupo: "asma",
    dosagens: ["200 mcg"],
    formas: ["inalador (MDI)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    equivalencia: { bioequivalente: true, fonte: SOURCES.anvisa_generics.url },
    economia_esperada: { minimo_pct: 35, tipico_pct: "35–70" },
    compra: buildRetailerLinks("beclometasona 200 mcg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "beclometasona-250mcg",
    dcb: "Dipropionato de beclometasona 250 mcg",
    grupo: "asma",
    dosagens: ["250 mcg"],
    formas: ["inalador (MDI)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    equivalencia: { bioequivalente: true, fonte: SOURCES.anvisa_generics.url },
    economia_esperada: { minimo_pct: 35, tipico_pct: "35–70" },
    compra: buildRetailerLinks("beclometasona 250 mcg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "beclometasona-50mcg-asma",
    dcb: "Dipropionato de beclometasona 50 mcg",
    grupo: "asma",
    dosagens: ["50 mcg"],
    formas: ["inalador (MDI)"],
    observacao:
      "Há também apresentação nasal 50 mcg/dose para rinite (ver grupo RINITE).",
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("beclometasona 50 mcg inalador"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "salbutamol-100mcg",
    dcb: "Sulfato de salbutamol 100 mcg",
    grupo: "asma",
    dosagens: ["100 mcg"],
    formas: ["inalador (MDI)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("salbutamol 100 mcg inalador"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "salbutamol-5mg",
    dcb: "Sulfato de salbutamol 5 mg",
    grupo: "asma",
    dosagens: ["5 mg"],
    formas: ["nebulização (solução)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("salbutamol 5 mg solução nebulização"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- DIABETES ----------
  {
    id: "metformina-500mg",
    dcb: "Cloridrato de metformina 500 mg",
    grupo: "diabetes",
    dosagens: ["500 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("metformina 500 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "metformina-500mg-xr",
    dcb: "Cloridrato de metformina 500 mg (ação prolongada)",
    grupo: "diabetes",
    dosagens: ["500 mg XR"],
    formas: ["comprimido de liberação prolongada"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("metformina 500 mg liberação prolongada"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "metformina-850mg",
    dcb: "Cloridrato de metformina 850 mg",
    grupo: "diabetes",
    dosagens: ["850 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("metformina 850 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "glibenclamida-5mg",
    dcb: "Glibenclamida 5 mg",
    grupo: "diabetes",
    dosagens: ["5 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("glibenclamida 5 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "insulina-regular-100ui",
    dcb: "Insulina humana regular 100 UI/mL",
    grupo: "diabetes",
    dosagens: ["100 UI/mL"],
    formas: ["frasco/seringa", "refil/caneta (varia por fabricante)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    observacao:
      "Transporte/armazenamento em cadeia de frio; conferir requisitos de entrega.",
    rx_required: true,
    compra: buildRetailerLinks("insulina regular 100 UI/mL"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "insulina-nph-100ui",
    dcb: "Insulina humana 100 UI/mL (NPH)",
    grupo: "diabetes",
    dosagens: ["100 UI/mL"],
    formas: ["frasco/seringa", "refil/caneta (varia por fabricante)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    observacao:
      "O elenco cita 'insulina humana 100 UI/mL' sem subtipo; para uso ambulatorial, usualmente NPH.",
    rx_required: true,
    compra: buildRetailerLinks("insulina NPH 100 UI/mL"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- HIPERTENSÃO ----------
  {
    id: "atenolol-25mg",
    dcb: "Atenolol 25 mg",
    grupo: "hipertensao",
    dosagens: ["25 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("atenolol 25 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "anlodipino-5mg",
    dcb: "Besilato de anlodipino 5 mg",
    grupo: "hipertensao",
    dosagens: ["5 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("anlodipino 5 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "captopril-25mg",
    dcb: "Captopril 25 mg",
    grupo: "hipertensao",
    dosagens: ["25 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("captopril 25 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "propranolol-40mg",
    dcb: "Cloridrato de propranolol 40 mg",
    grupo: "hipertensao",
    dosagens: ["40 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("propranolol 40 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "hidroclorotiazida-25mg",
    dcb: "Hidroclorotiazida 25 mg",
    grupo: "hipertensao",
    dosagens: ["25 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("hidroclorotiazida 25 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "losartana-50mg",
    dcb: "Losartana potássica 50 mg",
    grupo: "hipertensao",
    dosagens: ["50 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    economia_esperada: {
      minimo_pct: 35,
      tipico_pct: "35–70",
      fonte: SOURCES.anvisa_generics.url,
    },
    compra: buildRetailerLinks("losartana potássica 50 mg"),
    fontes: [
      SOURCES.pfpb_pdf.url,
      SOURCES.anvisa_generics.url,
      SOURCES.cmed_prices.url,
    ],
  },
  {
    id: "enalapril-10mg",
    dcb: "Maleato de enalapril 10 mg",
    grupo: "hipertensao",
    dosagens: ["10 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("enalapril 10 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "espironolactona-25mg",
    dcb: "Espironolactona 25 mg",
    grupo: "hipertensao",
    dosagens: ["25 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("espironolactona 25 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "furosemida-40mg",
    dcb: "Furosemida 40 mg",
    grupo: "hipertensao",
    dosagens: ["40 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("furosemida 40 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "metoprolol-succ-25mg",
    dcb: "Succinato de metoprolol 25 mg",
    grupo: "hipertensao",
    dosagens: ["25 mg"],
    formas: ["comprimido (liberação controlada)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("metoprolol succinato 25 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- ANTICONCEPÇÃO ----------
  {
    id: "medroxiprogesterona-150mg",
    dcb: "Acetato de medroxiprogesterona 150 mg",
    grupo: "anticoncepcao",
    dosagens: ["150 mg"],
    formas: ["injeção intramuscular (trimestral)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    observacao: "Administração em serviços de saúde recomendada.",
    compra: buildRetailerLinks("medroxiprogesterona 150 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "ee-levonorgestrel",
    dcb: "Etinilestradiol 0,03 mg + Levonorgestrel 0,15 mg",
    grupo: "anticoncepcao",
    dosagens: ["0,03 mg + 0,15 mg"],
    formas: ["comprimido combinado"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks(
      "etinilestradiol 0,03 mg levonorgestrel 0,15 mg"
    ),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "noretisterona-0-35mg",
    dcb: "Noretisterona 0,35 mg",
    grupo: "anticoncepcao",
    dosagens: ["0,35 mg"],
    formas: ["comprimido (progestagênio isolado)"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("noretisterona 0,35 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "valerato-estradiol-enantato-noretisterona",
    dcb: "Valerato de estradiol 5 mg + Enantato de noretisterona 50 mg",
    grupo: "anticoncepcao",
    dosagens: ["5 mg + 50 mg"],
    formas: ["injeção mensal"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    observacao: "Administração em serviços de saúde recomendada.",
    compra: buildRetailerLinks(
      "valerato de estradiol enantato de noretisterona"
    ),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- OSTEOPOROSE ----------
  {
    id: "alendronato-70mg",
    dcb: "Alendronato de sódio 70 mg",
    grupo: "osteoporose",
    dosagens: ["70 mg (semanal)"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    observacao:
      "Tomar em jejum com água e permanecer ereto por 30 min (ver bula).",
    compra: buildRetailerLinks("alendronato 70 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- DISLIPIDEMIA ----------
  {
    id: "sinvastatina-10mg",
    dcb: "Sinvastatina 10 mg",
    grupo: "dislipidemia",
    dosagens: ["10 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("sinvastatina 10 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "sinvastatina-20mg",
    dcb: "Sinvastatina 20 mg",
    grupo: "dislipidemia",
    dosagens: ["20 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("sinvastatina 20 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "sinvastatina-40mg",
    dcb: "Sinvastatina 40 mg",
    grupo: "dislipidemia",
    dosagens: ["40 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("sinvastatina 40 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- DOENÇA DE PARKINSON ----------
  {
    id: "carbidopa-levodopa-25-250",
    dcb: "Carbidopa 25 mg + Levodopa 250 mg",
    grupo: "parkinson",
    dosagens: ["25 mg + 250 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    observacao: "Ajuste de dose individual; avaliar fracionamento e EA.",
    compra: buildRetailerLinks("carbidopa 25 mg levodopa 250 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "benserazida-levodopa-25-100",
    dcb: "Cloridrato de benserazida 25 mg + Levodopa 100 mg",
    grupo: "parkinson",
    dosagens: ["25 mg + 100 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("benserazida 25 mg levodopa 100 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- GLAUCOMA ----------
  {
    id: "timolol-2-5mg",
    dcb: "Maleato de timolol 2,5 mg (colírio ~0,25%)",
    grupo: "glaucoma",
    dosagens: ["2,5 mg (~0,25%)"],
    formas: ["colírio"],
    observacao: "Concentrações comerciais usuais 0,25% e 0,5%.",
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("timolol 0,25% colírio"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "timolol-5mg",
    dcb: "Maleato de timolol 5 mg (colírio ~0,5%)",
    grupo: "glaucoma",
    dosagens: ["5 mg (~0,5%)"],
    formas: ["colírio"],
    observacao: "Concentrações comerciais usuais 0,25% e 0,5%.",
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true,
    compra: buildRetailerLinks("timolol 0,5% colírio"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- RINITE ----------
  {
    id: "budesonida-32mcg-nasal",
    dcb: "Budesonida 32 mcg (spray nasal)",
    grupo: "rinite",
    dosagens: ["32 mcg/dose"],
    formas: ["spray nasal"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true, // alguns locais podem vender sem receita; cautela
    compra: buildRetailerLinks("budesonida 32 mcg spray nasal"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "budesonida-50mcg-nasal",
    dcb: "Budesonida 50 mcg (spray nasal)",
    grupo: "rinite",
    dosagens: ["50 mcg/dose"],
    formas: ["spray nasal"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true, // alguns locais podem vender sem receita; cautela
    compra: buildRetailerLinks("budesonida 50 mcg spray nasal"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
  {
    id: "beclometasona-50mcg-nasal",
    dcb: "Dipropionato de beclometasona 50 mcg/dose (spray nasal)",
    grupo: "rinite",
    dosagens: ["50 mcg/dose"],
    formas: ["spray nasal"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    rx_required: true, // alguns locais podem vender sem receita; cautela
    compra: buildRetailerLinks("beclometasona 50 mcg spray nasal"),
    fontes: [SOURCES.pfpb_pdf.url],
  },

  // ---------- DM + DOENÇA CARDIOVASCULAR ----------
  {
    id: "dapagliflozina-10mg",
    dcb: "Dapagliflozina 10 mg",
    grupo: "diabetes+cv",
    dosagens: ["10 mg"],
    formas: ["comprimido"],
    pfpb: { gratuito: true, fonte: SOURCES.pfpb_pdf.url },
    observacao:
      "Indicada para DM2 e benefícios cardiovasculares/renais conforme diretrizes.",
    rx_required: true,
    compra: buildRetailerLinks("dapagliflozina 10 mg"),
    fontes: [SOURCES.pfpb_pdf.url],
  },
];

/* Pré-cálculo para busca/ordenação */
const genericos_flat = genericos
  .map((g) => ({
    ...g,
    sort_key: normalize(g.dcb),
  }))
  .sort((a, b) => (a.sort_key > b.sort_key ? 1 : -1));

function scoreHit(entry, qTokens) {
  const fields = [
    entry.dcb,
    entry.grupo,
    (entry.formas || []).join(" "),
    (entry.dosagens || []).join(" "),
    entry.observacao || "",
  ].map(normalize);
  let s = 0;
  for (const tok of qTokens) {
    for (const f of fields) {
      if (f.includes(tok)) s += 1;
    }
  }
  return s;
}

function searchGenericos({
  query = "",
  grupo = null,
  gratuito = null,
  limit = 100,
} = {}) {
  const qTokens = normalize(query).split(" ").filter(Boolean);
  let pool = genericos_flat;
  if (grupo) pool = pool.filter((g) => g.grupo === normalize(grupo));
  if (gratuito !== null)
    pool = pool.filter((g) => Boolean(g.pfpb?.gratuito) === Boolean(gratuito));
  let results = pool;
  if (qTokens.length) {
    results = pool
      .map((g) => ({ ...g, _score: scoreHit(g, qTokens) }))
      .filter((g) => g._score > 0)
      .sort(
        (a, b) => b._score - a._score || (a.sort_key > b.sort_key ? 1 : -1)
      );
  }
  return (results || [])
    .slice(0, Math.min(limit, 300))
    .map(({ _score, ...rest }) => rest);
}

/* ===========================
 * ENDPOINTS EXPRESS
 * =========================== */

function initGenericosAPI(app, { basePath = "/api/genericos" } = {}) {
  const router = express.Router();

  // Saída padrão / resumo
  router.get("/", (req, res) => {
    const grupos = [...new Set(genericos_flat.map((g) => g.grupo))].sort();
    res.json({
      total: genericos_flat.length,
      grupos,
      gratuito:
        "Todos os itens do elenco PFPB estão gratuitos desde 14/02/2025 (fonte oficial).",
      fontes: SOURCES,
    });
  });

  // Grupos
  router.get("/grupos", (req, res) => {
    const grupos = [...new Set(genericos_flat.map((g) => g.grupo))].sort();
    const mapa = Object.fromEntries(
      grupos.map((gr) => [
        gr,
        genericos_flat.filter((g) => g.grupo === gr).length,
      ])
    );
    res.json(mapa);
  });

  // Busca
  router.get("/search", (req, res) => {
    try {
      const { q = "", grupo = null, gratuito = null, limit = 100 } = req.query;
      const results = searchGenericos({
        query: q,
        grupo: grupo ? normalize(grupo) : null,
        gratuito:
          gratuito !== null ? String(gratuito).toLowerCase() === "true" : null,
        limit: limit ? Number(limit) : 100,
      });
      res.json({ count: results.length, results });
    } catch (e) {
      console.error("Erro /api/genericos/search:", e);
      res.status(500).json({ erro: "Falha na busca" });
    }
  });

  // Item por ID
  router.get("/:id", (req, res) => {
    const id = String(req.params.id);
    const item = genericos_flat.find((g) => g.id === id);
    if (!item) return res.status(404).json({ erro: "Genérico não encontrado" });
    res.json(item);
  });

  // Links de compra (busca pré-preenchida)
  router.get("/:id/links", (req, res) => {
    const id = String(req.params.id);
    const item = genericos_flat.find((g) => g.id === id);
    if (!item) return res.status(404).json({ erro: "Genérico não encontrado" });
    res.json({
      id,
      dcb: item.dcb,
      compra: item.compra,
      aviso:
        "Links para busca em e-commerces de farmácias licenciadas. Preços/estoque variam por região. Itens podem exigir prescrição (Rx).",
    });
  });

  // Resumo (string curta) para injetar no chat/IA
  router.get("/:id/resumo", (req, res) => {
    const id = String(req.params.id);
    const item = genericos_flat.find((g) => g.id === id);
    if (!item) return res.status(404).json({ erro: "Genérico não encontrado" });
    res.json({ id, resumo: formatResumo(item) });
  });

  // Fontes
  router.get("/sources", (req, res) => {
    res.json(SOURCES);
  });

  app.use(basePath, router);
}

/* ===========================
 * EXPORTS
 * =========================== */
module.exports = {
  initGenericosAPI,
  searchGenericos,
  formatResumo,
  genericos,
  genericos_flat,
  retailers,
  SOURCES,
};
