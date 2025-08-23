/**
 * psiq_genericos.bundle.js
 * Dataset de psicofármacos do SUS (RENAME 2024) + endpoints Express prontos.
 * Escopo: PSIQUIATRIA
 * Fontes oficiais:
 *  - RENAME 2024 (Ministério da Saúde) – componente (Básico / Especializado / Estratégico) e apresentações
 *  - Farmácia Popular: elenco de 21/01/2025 (não inclui psicotrópicos)
 *  - ANVISA – Genéricos: por regra, ≥35% mais baratos que o de referência
 *
 * Observações:
 *  - Este bundle não substitui prescrição médica. Uso exclusivo para informação/integração de sistemas.
 *  - Vários itens são de controle especial; a compra exige receita válida e, em geral, retenção.
 */

// ===========================
// Utilidades
// ===========================

const encode = (s) => encodeURIComponent(s || "").replace(/%20/g, "+");

/** Monta links de busca em e-commerces comuns (quando disponível). */
function buildCompraLinks(dcb, doseTexto = "") {
  const q = encode(`${dcb} ${doseTexto}`.trim());
  return {
    drogasil: `https://www.drogasil.com.br/busca?q=${q}`,
    drogarai: `https://www.drogaraia.com.br/busca?q=${q}`,
    dpsp: `https://www.drogariasaopaulo.com.br/busca?q=${q}`,
    pacheco: `https://www.drogariaspacheco.com.br/busca?q=${q}`,
    paguemenos: `https://www.paguemenos.com.br/busca?q=${q}`,
    panvel: `https://www.panvel.com/busca?conteudo=${q}`,
    ultrafarma: `https://www.ultrafarma.com.br/busca?q=${q}`,
  };
}

/** Texto curto de custo-benefício para genéricos no Brasil (ANVISA). */
function custoBeneficioTexto() {
  return "Genéricos no Brasil devem ser, por regra da ANVISA/Lei 9.787/99, no mínimo 35% mais baratos que o medicamento de referência (variação local possível).";
}

/** Ajuda a criar apresentações */
const F = (...formas) => formas;

// ===========================
// Dataset (seleção PSIQUIATRIA na RENAME 2024)
// Cada item: id, dcb, atc, componente, formas, controlado, rx_required, pfpb_elegivel, fontes, compra
// ===========================

const PSI_GENERICOS = [
  // ANTIDEPRESSIVOS
  {
    id: "fluoxetina-20mg",
    dcb: "cloridrato de fluoxetina",
    atc: "N06AB03",
    componente: "Básico",
    formas: F("cápsula 20 mg", "comprimido 20 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("fluoxetina", "20 mg"),
    fontes: [
      "RENAME 2024 – N: Sistema nervoso, p. 94",
      "ANVISA – Genéricos",
      "Elenco PFPB 21/01/2025 (não inclui psicotrópicos)",
    ],
  },
  {
    id: "amitriptilina-25-75mg",
    dcb: "cloridrato de amitriptilina",
    atc: "N06AA09",
    componente: "Básico",
    formas: F("comprimido 25 mg", "comprimido 75 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("amitriptilina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 93", "ANVISA – Genéricos"],
  },
  {
    id: "nortriptilina-10-25-50-75mg",
    dcb: "cloridrato de nortriptilina",
    atc: "N06AA10",
    componente: "Básico",
    formas: F(
      "cápsula 10 mg",
      "cápsula 25 mg",
      "cápsula 50 mg",
      "cápsula 75 mg"
    ),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("nortriptilina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 96", "ANVISA – Genéricos"],
  },
  {
    id: "clomipramina-10-25mg",
    dcb: "cloridrato de clomipramina",
    atc: "N06AA04",
    componente: "Básico",
    formas: F("comprimido 10 mg", "comprimido 25 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("clomipramina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 94", "ANVISA – Genéricos"],
  },
  {
    id: "bupropiona-150mg-xl",
    dcb: "cloridrato de bupropiona",
    atc: "N06AX12",
    componente: "Estratégico",
    formas: F("comprimido de liberação prolongada 150 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("bupropiona", "150 mg"),
    fontes: [
      "RENAME 2024 – N: Sistema nervoso, p. 94 (Estratégico)",
      "ANVISA – Genéricos",
    ],
  },

  // ANSIOLÍTICOS / SEDATIVOS
  {
    id: "diazepam-5-10mg",
    dcb: "diazepam",
    atc: "N05BA01",
    componente: "Básico",
    formas: F(
      "comprimido 5 mg",
      "comprimido 10 mg",
      "solução injetável 5 mg/mL"
    ),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("diazepam"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 97", "ANVISA – Genéricos"],
  },
  {
    id: "clonazepam-solucao-2-5mgml",
    dcb: "clonazepam",
    atc: "N03AE01",
    componente: "Básico",
    formas: F("solução oral 2,5 mg/mL"),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("clonazepam", "solução 2,5 mg/mL"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 93", "ANVISA – Genéricos"],
  },
  {
    id: "midazolam-inj-2mgml",
    dcb: "midazolam",
    atc: "N05CD08",
    componente: "Básico",
    formas: F("solução injetável 2 mg/mL"),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("midazolam"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 100"],
  },

  // ESTABILIZADORES DO HUMOR / ANTICONVULSIVANTES DE USO PSIQUIÁTRICO
  {
    id: "litiocarbonato-300mg",
    dcb: "carbonato de lítio",
    atc: "N05AN01",
    componente: "Básico",
    formas: F("comprimido 300 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("carbonato de lítio", "300 mg"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 93", "ANVISA – Genéricos"],
  },
  {
    id: "acido-valproico-250-300-500mg-50mgml",
    dcb: "ácido valproico",
    atc: "N03AG01",
    componente: "Básico",
    formas: F(
      "comprimido 250 mg",
      "comprimido 300 mg",
      "comprimido 500 mg",
      "solução oral 50 mg/mL",
      "xarope 50 mg/mL"
    ),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("ácido valproico"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 92", "ANVISA – Genéricos"],
  },
  {
    id: "carbamazepina-200-400mg-20mgml",
    dcb: "carbamazepina",
    atc: "N03AF01",
    componente: "Básico",
    formas: F(
      "comprimido 200 mg",
      "comprimido 400 mg",
      "suspensão oral 20 mg/mL"
    ),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("carbamazepina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 93", "ANVISA – Genéricos"],
  },
  {
    id: "lamotrigina-25-50-100mg",
    dcb: "lamotrigina",
    atc: "N03AX09",
    componente: "Especializado",
    formas: F("comprimido 25 mg", "comprimido 50 mg", "comprimido 100 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("lamotrigina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 99"],
  },

  // ANTIPSICÓTICOS
  {
    id: "haloperidol-1-5mg-solucao",
    dcb: "haloperidol",
    atc: "N05AD01",
    componente: "Básico",
    formas: F(
      "comprimido 1 mg",
      "comprimido 5 mg",
      "solução oral 2 mg/mL",
      "solução injetável 50 mg/mL"
    ),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("haloperidol"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 98"],
  },
  {
    id: "clorpromazina-25-100mg-solucao",
    dcb: "cloridrato de clorpromazina",
    atc: "N05AA01",
    componente: "Básico",
    formas: F(
      "comprimido 25 mg",
      "comprimido 100 mg",
      "solução oral 40 mg/mL",
      "solução injetável 5 mg/mL"
    ),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("clorpromazina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 94-95"],
  },
  {
    id: "risperidona-1-2-3mg-solucao",
    dcb: "risperidona",
    atc: "N05AX08",
    componente: "Especializado",
    formas: F(
      "comprimido 1 mg",
      "comprimido 2 mg",
      "comprimido 3 mg",
      "solução oral 1 mg/mL"
    ),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("risperidona"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 101"],
  },
  {
    id: "olanzapina-5-10mg",
    dcb: "olanzapina",
    atc: "N05AH03",
    componente: "Especializado",
    formas: F("comprimido 5 mg", "comprimido 10 mg"),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("olanzapina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 100"],
  },
  {
    id: "quetiapina-25-100-200-300mg",
    dcb: "hemifumarato de quetiapina",
    atc: "N05AH04",
    componente: "Especializado",
    formas: F(
      "comprimido 25 mg",
      "comprimido 100 mg",
      "comprimido 200 mg",
      "comprimido 300 mg"
    ),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("quetiapina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 98"],
  },
  {
    id: "clozapina-25-100mg",
    dcb: "clozapina",
    atc: "N05AH02",
    componente: "Especializado",
    formas: F("comprimido 25 mg", "comprimido 100 mg"),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("clozapina"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 96"],
  },
  {
    id: "ziprasidona-40-80mg",
    dcb: "cloridrato de ziprasidona",
    atc: "N05AE04",
    componente: "Especializado",
    formas: F("cápsula 40 mg", "cápsula 80 mg"),
    controlado: true,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("ziprasidona"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 96"],
  },

  // ANTICOLINÉRGICO (manejo de efeitos extrapiramidais)
  {
    id: "biperideno-2-4mg",
    dcb: "cloridrato de biperideno",
    atc: "N04AA02",
    componente: "Básico",
    formas: F("comprimido 2 mg", "comprimido de liberação prolongada 4 mg"),
    controlado: false,
    rx_required: true,
    pfpb_elegivel: false,
    compra: buildCompraLinks("biperideno"),
    fontes: ["RENAME 2024 – N: Sistema nervoso, p. 93"],
  },
];

// ===========================
// Busca
// ===========================

function searchGenericosPsi({ query = "", componente, limit = 25 } = {}) {
  const q = (query || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  let lista = PSI_GENERICOS.slice();

  if (q) {
    lista = lista.filter((it) => {
      const haystack = [
        it.id,
        it.dcb,
        it.atc,
        it.componente,
        ...(it.formas || []),
      ]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      return haystack.includes(q);
    });
  }
  if (componente) {
    lista = lista.filter(
      (it) => it.componente.toLowerCase() === String(componente).toLowerCase()
    );
  }
  return lista.slice(0, limit);
}

function formatResumoPsi(it) {
  return `${it.dcb} (${it.atc}) • ${
    it.componente
  } • apresentações: ${it.formas.join(", ")} • ${custoBeneficioTexto()}`;
}

// ===========================
// API (Express)
// ===========================

/**
 * Registra rotas em app (Express).
 * options.basePath default: "/api/psiquiatria"
 */
function initPsicoGenericosAPI(app, options = {}) {
  const basePath = options.basePath || "/api/psiquiatria";

  app.get(`${basePath}/`, (req, res) => {
    const totais = {
      total: PSI_GENERICOS.length,
      porComponente: PSI_GENERICOS.reduce((acc, it) => {
        acc[it.componente] = (acc[it.componente] || 0) + 1;
        return acc;
      }, {}),
    };
    res.json({
      escopo:
        "Psiquiatria – genéricos/psicofármacos padronizados no SUS (RENAME 2024)",
      totais,
      observacoes: [
        "Farmácia Popular (PFPB) não contempla psicofármacos – vide elenco oficial 21/01/2025.",
        custoBeneficioTexto(),
        "Diversos itens exigem receita de controle especial (ex.: benzodiazepínicos e antipsicóticos).",
      ],
      fontes: {
        rename_2024_pdf:
          "https://bvsms.saude.gov.br/bvs/publicacoes/relacao_nacional_medicamentos_2024.pdf",
        pfpb_elenco_2025_pdf:
          "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular/arquivos/elenco-de-medicamentos-e-insumos.pdf",
        anvisa_genericos:
          "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/genericos",
      },
    });
  });

  app.get(`${basePath}/grupos`, (req, res) => {
    const grupos = PSI_GENERICOS.reduce((acc, it) => {
      acc[it.componente] = acc[it.componente] || [];
      acc[it.componente].push(it.id);
      return acc;
    }, {});
    res.json({ grupos });
  });

  app.get(`${basePath}/search`, (req, res) => {
    const { q, componente, limit } = req.query;
    const data = searchGenericosPsi({
      query: q,
      componente,
      limit: limit ? Number(limit) : 25,
    });
    res.json({ total: data.length, items: data });
  });

  app.get(`${basePath}/:id`, (req, res) => {
    const it = PSI_GENERICOS.find((x) => x.id === req.params.id);
    if (!it) return res.status(404).json({ erro: "não encontrado" });
    res.json(it);
  });

  app.get(`${basePath}/:id/links`, (req, res) => {
    const it = PSI_GENERICOS.find((x) => x.id === req.params.id);
    if (!it) return res.status(404).json({ erro: "não encontrado" });
    const dose = (it.formas[0] || "").replace(
      /^(cápsula|comprimido|solução oral|solução injetável|suspensão|xarope)\s*/i,
      ""
    );
    res.json({
      id: it.id,
      dcb: it.dcb,
      links: buildCompraLinks(it.dcb.replace(/^cloridrato de\s+/i, ""), dose),
    });
  });

  app.get(`${basePath}/:id/resumo`, (req, res) => {
    const it = PSI_GENERICOS.find((x) => x.id === req.params.id);
    if (!it) return res.status(404).json({ erro: "não encontrado" });
    res.send(formatResumoPsi(it));
  });

  app.get(`${basePath}/sources`, (req, res) => {
    res.json({
      fontes: [
        {
          nome: "RENAME 2024 – Ministério da Saúde",
          url: "https://bvsms.saude.gov.br/bvs/publicacoes/relacao_nacional_medicamentos_2024.pdf",
        },
        {
          nome: "PFPB – Elenco 21/01/2025",
          url: "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular/arquivos/elenco-de-medicamentos-e-insumos.pdf",
        },
        {
          nome: "ANVISA – Medicamentos Genéricos",
          url: "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/genericos",
        },
      ],
    });
  });
}

// ===========================
// Exports
// ===========================

module.exports = {
  PSI_GENERICOS,
  searchGenericosPsi,
  formatResumoPsi,
  initPsicoGenericosAPI,
};
