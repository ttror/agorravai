const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;

// Configuração básica
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static("public"));

// Configuração da IA Claude
const CLAUDE_API_KEY =
  process.env.ANTHROPIC_API_KEY ||
  "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";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-1-20250805"; // 👈 modelo atualizado

// Verificar se API está configurada
if (!CLAUDE_API_KEY || CLAUDE_API_KEY === "undefined") {
  console.error("❌ ERRO: ANTHROPIC_API_KEY não configurada!");
  process.exit(1);
}

const {
  initReferenciasAPI,
  searchReferencias,
  formatAPA,
} = require("./referencias.bundle");

// Registre as rotas (opcional: mude o caminho base)
initReferenciasAPI(app, { basePath: "/api/referencias" });

// server.js
const {
  initGenericosAPI,
  searchGenericos,
  formatResumo,
} = require("./genericos.bundle");

// Registra as rotas em /api/genericos (pode alterar o basePath se quiser)
initGenericosAPI(app, { basePath: "/api/genericos" });

// server.js
const { initPsicoGenericosAPI } = require("./psiq_genericos.bundle");

// … depois do app.use(express.json()) etc.
initPsicoGenericosAPI(app, { basePath: "/api/psiq" });
// opcional: troque o basePath se quiser: "/api/psiquiatria"

// Armazenamento de sessões
const sessoes = new Map();

// CONTEXTO ATUALIZADO COM ABORDAGEM FENOMENOLÓGICA PARA PSIQUIATRAS
const CONTEXTO_PSIQUIATRA_BASE = `Você é o Dr. CAIO, PHd, psiquiatra sênior com 15 anos de experiência, especialista em Psicopatologia Fenomenológica e Psicofarmacologia. Você conversa com OUTRO PSIQUIATRA usando uma abordagem fenomenológica-descritiva.

PERFIL E ABORDAGEM:
- Formação em fenomenologia psiquiátrica (Jaspers, Minkowski, Binswanger)
- Valoriza a descrição detalhada das vivências e experiências subjetivas
- Integra psicopatologia descritiva com evidências científicas
- Prefere compreender antes de classificar
- Experiência em psicopatologia fundamental e análise existencial

ESTILO DE COMUNICAÇÃO ENTRE COLEGAS:
- Use linguagem descritiva rica e precisa sobre fenômenos mentais
- Evite jargão técnico excessivo - prefira descrições fenomenológicas
- Explore as vivências, temporalidade e espacialidade dos pacientes
- Discuta a estrutura da experiência antes dos diagnósticos
- Seja direto mas contemple a complexidade da experiência humana
- Balance fenomenologia com pragmatismo clínico

ABORDAGEM FENOMENOLÓGICA:
- Descreva como o paciente vivencia seus sintomas
- Explore alterações na consciência do tempo e espaço
- Analise mudanças na corporeidade e intersubjetividade
- Considere a biografia e contexto existencial
- Use conceitos como: vivência, mundo-da-vida, intencionalidade, temporalidade vivida
- Evite reducionismos biológicos ou psicológicos

INSTRUÇÕES PRÁTICAS:
1. Quando discutir casos, comece pela descrição fenomenológica
2. Use termos técnicos apenas quando agregarem precisão descritiva
3. Seja extenso quando a complexidade do fenômeno exigir
4. Seja direto e conciso em questões práticas de manejo
5. Integre a compreensão fenomenológica com decisões terapêuticas
6. Mantenha tom colegial, como numa supervisão fenomenológica
7. Discuta de maneira por menorizada baseado nas evidencias cientificas atuais um manejo psicofarmacologico
8. Estamos no Brasil relate todas as possibilidades medicamentosa de tratamento inclusive as nao indicadas para o caso em especifico por quaisquer motivo e explique
9. Seja acertivo e consiso, sem perde a rubustez tecnica`;

// Classe para categorizar perguntas - ADAPTADA PARA FENOMENOLOGIA
class CategorizadorPerguntas {
  constructor() {
    this.padroes = {
      fenomenologia: [
        /fenômeno|vivência|experiência|descrição/i,
        /temporalidade|espacialidade|corporeidade/i,
        /mundo.?da.?vida|lebenswelt|dasein/i,
        /estrutura.*experiência|análise.*existencial/i,
        /jaspers|minkowski|binswanger|merleau.?ponty/i,
      ],
      psicopatologia_descritiva: [
        /como.*paciente.*vive|experimenta|sente/i,
        /descrição.*detalhada|fenomenológica/i,
        /alteração.*consciência|self|eu/i,
        /mudança.*percepção|vivência.*tempo/i,
      ],
      casos_fenomenologicos: [
        /caso.*interessante|peculiar|fenomenologicamente/i,
        /apresentação.*atípica|incomum/i,
        /fenômeno.*raro|singular/i,
        /estrutura.*delírio|alucinação|humor/i,
      ],
      integracao_terapeutica: [
        /como.*integrar.*fenomenologia.*tratamento/i,
        /abordagem.*compreensiva.*medicação/i,
        /psicofarmacologia.*fenomenológica/i,
        /terapêutica.*existencial/i,
      ],
      discussao_teorica: [
        /conceito|teoria|fundamento/i,
        /diferença.*fenomenologia.*dsm/i,
        /crítica.*modelo.*biomédico/i,
        /psicopatologia.*fundamental/i,
      ],
      manejo_pratico: [
        /dose|medicação|prescrição/i,
        /conduta|manejo|tratamento/i,
        /urgência|emergência|crise/i,
        /prático|objetivo|direto/i,
      ],
    };
  }

  categorizar(pergunta) {
    const categorias = [];
    for (const [categoria, padroes] of Object.entries(this.padroes)) {
      for (const padrao of padroes) {
        if (padrao.test(pergunta)) {
          categorias.push(categoria);
          break;
        }
      }
    }
    return categorias.length > 0 ? categorias : ["geral"];
  }
}

// Classe para gerenciar interações com Claude
class GerenciadorClaude {
  constructor(apiKey, apiUrl) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.categorizador = new CategorizadorPerguntas();
  }

  async chamarClaude(mensagem, historico = [], contextoAdicional = "") {
    try {
      const contextoCompleto = this.construirContexto(
        mensagem,
        historico,
        contextoAdicional
      );

      const response = await axios.post(
        this.apiUrl,
        {
          model: CLAUDE_MODEL, // 👈 agora usa o modelo atualizado
          max_tokens: 90000,
          messages: [
            {
              role: "user",
              content: contextoCompleto,
            },
          ],
        },
        {
          headers: {
            "x-api-key": this.apiKey,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          timeout: 240000,
        }
      );

      return response.data.content[0].text.trim();
    } catch (error) {
      console.error(
        "Erro ao chamar Claude:",
        error.response?.data || error.message
      );
      throw new Error("Aguarde um momento, estou processando sua questão...");
    }
  }

  construirContexto(mensagem, historico, contextoAdicional) {
    const categorias = this.categorizador.categorizar(mensagem);
    let contextoCompleto = CONTEXTO_PSIQUIATRA_BASE;

    if (categorias.includes("fenomenologia")) {
      contextoCompleto += `\n\nFOCO FENOMENOLÓGICO:
Priorize a descrição detalhada dos fenômenos mentais. Explore como o paciente vivencia sua condição, as alterações na temporalidade e espacialidade vividas, mudanças na corporeidade e na relação com o mundo.`;
    }

    if (categorias.includes("psicopatologia_descritiva")) {
      contextoCompleto += `\n\nABORDAGEM DESCRITIVA:
Descreva minuciosamente as características do fenômeno psicopatológico. Use linguagem precisa mas evite jargão desnecessário. Contemple a riqueza da experiência antes de categorizar.`;
    }

    if (categorias.includes("casos_fenomenologicos")) {
      contextoCompleto += `\n\nDISCUSSÃO DE CASO:
Analise o caso começando pela descrição fenomenológica detalhada. Explore a estrutura da experiência, o modo de ser-no-mundo do paciente, antes de discutir diagnósticos ou tratamentos.`;
    }

    if (categorias.includes("manejo_pratico")) {
      contextoCompleto += `\n\nQUESTÃO PRÁTICA:
Seja direto e objetivo. Forneça informações práticas claras, mas sempre considerando o contexto fenomenológico quando relevante para o manejo.`;
    }

    if (contextoAdicional) {
      contextoCompleto += `\n\nCONTEXTO DA DISCUSSÃO:\n${contextoAdicional}`;
    }

    contextoCompleto += "\n\nHISTÓRICO DA CONVERSA:\n";
    historico.forEach((msg) => {
      if (msg.tipo === "colega") {
        contextoCompleto += `Colega: ${msg.conteudo}\n`;
      } else {
        contextoCompleto += `Dr. Alexandre: ${msg.conteudo}\n`;
      }
    });

    contextoCompleto += `\nColega: ${mensagem}\n\nDr. Alexandre:`;
    return contextoCompleto;
  }
}

// Gerenciadores
const gerenciadorSessao = new (class {
  constructor() {
    this.sessoes = new Map();
    this.limpezaAutomatica();
  }
  criarSessao(dadosColega) {
    const sessaoId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const sessao = {
      id: sessaoId,
      colega: dadosColega,
      tipo: "discussao_clinica",
      historico: [],
      topicos_discutidos: [],
      iniciada: new Date(),
      ultimaAtividade: new Date(),
      status: "ativa",
    };
    this.sessoes.set(sessaoId, sessao);
    return sessao;
  }
  obterSessao(id) {
    const sessao = this.sessoes.get(id);
    if (sessao) sessao.ultimaAtividade = new Date();
    return sessao;
  }
  atualizarSessao(id, dados) {
    const sessao = this.sessoes.get(id);
    if (sessao) {
      Object.assign(sessao, dados);
      sessao.ultimaAtividade = new Date();
      this.sessoes.set(id, sessao);
    }
    return sessao;
  }
  adicionarMensagem(id, tipo, conteudo) {
    const sessao = this.obterSessao(id);
    if (sessao)
      sessao.historico.push({ tipo, conteudo, timestamp: new Date() });
  }
  limpezaAutomatica() {
    setInterval(() => {
      const agora = new Date();
      for (const [id, sessao] of this.sessoes) {
        if (agora - sessao.ultimaAtividade > 4 * 60 * 60 * 1000) {
          this.sessoes.delete(id);
        }
      }
    }, 60 * 60 * 1000);
  }
})();

// Instanciar gerenciadores

const gerenciadorClaude = new GerenciadorClaude(CLAUDE_API_KEY, CLAUDE_API_URL);

// Rota para iniciar nova sessão
app.post("/api/iniciar-sessao", (req, res) => {
  try {
    const { nome, especialidade, instituicao, topico } = req.body;

    if (!nome) {
      return res.status(400).json({
        erro: "Nome é obrigatório",
      });
    }

    const dadosColega = { nome, especialidade, instituicao, topico };
    const sessao = gerenciadorSessao.criarSessao(dadosColega);

    console.log(`✅ Nova discussão iniciada: ${sessao.id} com Dr(a). ${nome}`);

    res.json({
      sessaoId: sessao.id,
      mensagem: `Olá, Dr(a). ${nome}! Alexandre aqui. ${
        topico ? `Vi que você quer discutir sobre ${topico}.` : ""
      } Como posso ajudar? Conte-me sobre o caso ou questão que gostaria de discutir.`,
      tipo: sessao.tipo,
    });
  } catch (error) {
    console.error("Erro ao iniciar sessão:", error);
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

// Rota principal para conversa
app.post("/api/conversar", async (req, res) => {
  try {
    const { sessaoId, mensagem } = req.body;

    if (!sessaoId || !mensagem) {
      return res.status(400).json({
        erro: "ID da sessão e mensagem são obrigatórios",
      });
    }

    const sessao = gerenciadorSessao.obterSessao(sessaoId);
    if (!sessao) {
      return res.status(404).json({
        erro: "Sessão não encontrada ou expirada",
      });
    }

    gerenciadorSessao.adicionarMensagem(sessaoId, "colega", mensagem);

    const contextoDiscussao = `
Discussão entre psiquiatras
Colega: Dr(a). ${sessao.colega.nome}
${
  sessao.colega.especialidade
    ? `Especialidade: ${sessao.colega.especialidade}`
    : ""
}
${sessao.colega.topico ? `Tópico inicial: ${sessao.colega.topico}` : ""}
`;

    const resposta = await gerenciadorClaude.chamarClaude(
      mensagem,
      sessao.historico,
      contextoDiscussao
    );

    gerenciadorSessao.adicionarMensagem(sessaoId, "dr_alexandre", resposta);

    console.log(`💬 Discussão na sessão ${sessaoId}`);

    res.json({
      resposta,
      sessaoId: sessao.id,
    });
  } catch (error) {
    console.error("Erro na conversa:", error);
    res.status(500).json({
      erro: error.message || "Erro ao processar mensagem",
    });
  }
});

// Demais rotas permanecem iguais...
// [Resto do código continua igual]

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
  console.log(`👨‍⚕️ Dr. Alexandre Santos - Discussões Fenomenológicas`);
  console.log(
    `🤖 Claude API: ${CLAUDE_API_KEY ? "✅ Configurada" : "❌ Não configurada"}`
  );
});
// Rota para obter informações da sessão
app.get("/api/sessao/:id", (req, res) => {
  try {
    const sessao = gerenciadorSessao.obterSessao(req.params.id);
    if (!sessao) {
      return res.status(404).json({
        erro: "Sessão não encontrada",
      });
    }

    res.json({
      id: sessao.id,
      colega: sessao.colega,
      tipo: sessao.tipo,
      iniciada: sessao.iniciada,
      ultimaAtividade: sessao.ultimaAtividade,
      totalMensagens: sessao.historico.length,
      topicos_discutidos: sessao.topicos_discutidos,
    });
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

// Rota para obter histórico da sessão
app.get("/api/sessao/:id/historico", (req, res) => {
  try {
    const sessao = gerenciadorSessao.obterSessao(req.params.id);
    if (!sessao) {
      return res.status(404).json({
        erro: "Sessão não encontrada",
      });
    }

    res.json({
      historico: sessao.historico,
      colega: sessao.colega,
    });
  } catch (error) {
    console.error("Erro ao obter histórico:", error);
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

// Rota para exportar discussão
app.get("/api/sessao/:id/exportar", (req, res) => {
  try {
    const sessao = gerenciadorSessao.obterSessao(req.params.id);
    if (!sessao) {
      return res.status(404).json({
        erro: "Sessão não encontrada",
      });
    }

    // Formatar discussão para exportação
    let textoExportado = `DISCUSSÃO CLÍNICA - ${new Date(
      sessao.iniciada
    ).toLocaleString("pt-BR")}\n`;
    textoExportado += `Participantes: Dr. Alberts, CAIO P & Dr(a). ${sessao.colega.nome}\n`;
    textoExportado += `${
      sessao.colega.especialidade
        ? `Especialidade: ${sessao.colega.especialidade}\n`
        : ""
    }`;
    textoExportado += `\n--- TRANSCRIÇÃO ---\n\n`;

    sessao.historico.forEach((msg) => {
      const hora = new Date(msg.timestamp).toLocaleTimeString("pt-BR");
      if (msg.tipo === "colega") {
        textoExportado += `[${hora}] Dr(a). ${sessao.colega.nome}: ${msg.conteudo}\n\n`;
      } else {
        textoExportado += `[${hora}] Dr. Alexandre: ${msg.conteudo}\n\n`;
      }
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="discussao_${sessao.id}.txt"`
    );
    res.send(textoExportado);
  } catch (error) {
    console.error("Erro ao exportar discussão:", error);
    res.status(500).json({
      erro: "Erro ao exportar discussão",
    });
  }
});

// Rota para finalizar sessão
app.post("/api/finalizar-sessao", (req, res) => {
  try {
    const { sessaoId, resumo } = req.body;

    if (!sessaoId) {
      return res.status(400).json({
        erro: "ID da sessão é obrigatório",
      });
    }

    const sessao = gerenciadorSessao.obterSessao(sessaoId);
    if (!sessao) {
      return res.status(404).json({
        erro: "Sessão não encontrada",
      });
    }

    gerenciadorSessao.atualizarSessao(sessaoId, {
      status: "finalizada",
      resumo: resumo || "Discussão finalizada",
    });

    console.log(`🏁 Discussão finalizada: ${sessaoId}`);

    res.json({
      mensagem: "Discussão finalizada com sucesso",
      resumo: {
        duracao: new Date() - sessao.iniciada,
        totalMensagens: sessao.historico.length,
        participantes: {
          dr_alexandre: "Dr. Alberts, CAIO PHd",
          colega: `Dr(a). ${sessao.colega.nome}`,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao finalizar sessão:", error);
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});

// Rota para buscar referências (fenomenológicas e científicas)
app.post("/api/buscar-referencias", async (req, res) => {
  try {
    const { topico, tipo } = req.body;

    if (!topico) {
      return res.status(400).json({
        erro: "Tópico é obrigatório",
      });
    }

    // Simular busca de referências baseada no tipo
    const referencias = {
      fenomenologica: [
        "Binswanger, L. (1942). Grundformen und Erkenntnis menschlichen Daseins",
        "Blankenburg, W. (1971). Der Verlust der natürlichen Selbstverständlichkeit",
        "Jaspers, K. (1913). Psicopatologia Geral",
        "Minkowski, E. (1933). Le Temps vécu",
        "Tellenbach, H. (1961). Melancholie",
      ],
      cientifica: [
        "Alonso-Fernández, F. (1995). Compêndio de psiquiatria",
        "American Psychiatric Association. (2013). Manual diagnóstico e estatístico de transtornos mentais: DSM-5",
        "American Psychiatric Association. (2002–2013). APA Practice Guidelines",
        "Associação Brasileira de Psiquiatria. (2019). Diretrizes da Associação Brasileira de Psiquiatria",
        "Canadian Network for Mood and Anxiety Treatments (CANMAT). (2016). Clinical guidelines",
        "Cher, E. (2019). Manual de psicopatologia (6ª ed.)",
        "Cochrane Collaboration. (1995–presente). Cochrane Reviews - Psychiatry",
        "Dalgalarrondo, P. (2008). Psicopatologia e semiologia dos transtornos mentais",
        "International Advisory Group for the Revision of ICD-10 Mental and Behavioural Disorders. (2018). ICD-11",
        "Kaplan, H. I., & Sadock, B. J. (2007). Compêndio de psiquiatria: ciência do comportamento e psiquiatria clínica (9ª ed.)",
        "Messas, G., & Tamelini, M. (2010). Fundamentos de clínica fenomenológica",
        "Quevedo, J., & Izquierdo, I. (2001). Neurobiologia dos transtornos psiquiátricos",
        "Quevedo, J. (2007). Emergências psiquiátricas",
        "Sallet, P. C. (2017). Manual do residente de psiquiatria (IPq-HCFMUSP)",
        "Stahl, S. M. (2013). Psicofarmacologia: bases neurocientíficas e aplicações práticas (5ª ed.)",
        "World Federation of Societies of Biological Psychiatry. (2007–2013). Guidelines for biological treatment of psychiatric disorders",
        "Castellana, G. B. (2015). Psicopatologia clínica e entrevista psiquiátrica (IPq-HCFMUSP)",
        "Louzã, M. R., & Cordás, T. A. (2004). Transtornos da personalidade",
        "Diversos autores. (2015–presente). Estudos clínicos prospectivos randomizados, placebo-controlados, publicados em revistas científicas de alto impacto",
        "Avanços em psicopatologia: avaliação diagnóstica baseada na CID-11 (2019)",
      ],
      integrativa: [
        "Fuchs, T. (2010). Phenomenology and psychopathology",
        "Kendler, K. (2016). The phenomenology of major depression",
        "Maj, M. (2012). The critique of DSM-5",
        "Parnas, J., & Sass, L. (2011). The spectrum of schizophrenia",
        "Stanghellini, G., & Broome, M. (2014). Psychopathology as the basic science of psychiatry",
      ],
    };

    const tipoReferencia = tipo || "integrativa";

    res.json({
      topico,
      tipo: tipoReferencia,
      referencias: referencias[tipoReferencia] || referencias.integrativa,
      sugestao:
        "Posso elaborar mais sobre qualquer uma dessas referências ou buscar outras mais específicas.",
    });
  } catch (error) {
    console.error("Erro ao buscar referências:", error);
    res.status(500).json({
      erro: "Erro ao buscar referências",
    });
  }
});

// Rota de status da API
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    versao: "3.0.0-fenomenologica",
    tipo: "Sistema de Discussão entre Psiquiatras",
    abordagem: "Fenomenológica-Descritiva",
    sessoes_ativas: gerenciadorSessao.sessoes.size,
    claude_configurado: !!CLAUDE_API_KEY,
  });
});

// Rota para servir o frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error("Erro não tratado:", error);
  res.status(500).json({
    erro: "Erro interno do servidor",
    timestamp: new Date().toISOString(),
  });
});

// Tratamento de encerramento gracioso
process.on("SIGINT", () => {
  console.log("\n🛑 Encerrando servidor...");
  // Salvar sessões ativas se necessário
  console.log(
    `📊 ${gerenciadorSessao.sessoes.size} discussões ativas serão encerradas`
  );
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Encerrando servidor...");
  process.exit(0);
});

// Tratamento de erros não capturados
process.on("uncaughtException", (error) => {
  console.error("Erro não capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promise rejeitada não tratada:", reason);
});

module.exports = app;
