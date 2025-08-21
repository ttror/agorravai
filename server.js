const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração básica
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Configuração da IA Claude - OBRIGATÓRIA
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY || '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';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Verificar se API está configurada
if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'undefined') {
  console.error('❌ ERRO: ANTHROPIC_API_KEY não configurada!');
  process.exit(1);
}

// Armazenamento de sessões
const sessoes = new Map();

// Base de conhecimento médico psiquiátrico
const MEDICAMENTOS_PSIQUIATRICOS = {
  antidepressivos: {
    isrs: [
      { nome: "Fluoxetina", dosagem: "20-80mg/dia", indicacoes: ["Depressão", "TAG", "TOC", "Bulimia"], efeitos: "Ativação inicial, insônia, disfunção sexual" },
      { nome: "Sertralina", dosagem: "50-200mg/dia", indicacoes: ["Depressão", "TAG", "Pânico", "TEPT"], efeitos: "Náusea, diarreia, sonolência" },
      { nome: "Escitalopram", dosagem: "10-20mg/dia", indicacoes: ["Depressão", "TAG"], efeitos: "Sonolência, boca seca, sudorese" },
      { nome: "Paroxetina", dosagem: "20-60mg/dia", indicacoes: ["Depressão", "Pânico", "Fobia Social"], efeitos: "Sedação, ganho de peso, síndrome de descontinuação" }
    ],
    irsn: [
      { nome: "Venlafaxina", dosagem: "75-375mg/dia", indicacoes: ["Depressão", "TAG", "Fibromialgia"], efeitos: "Hipertensão, náusea, tontura" },
      { nome: "Duloxetina", dosagem: "60-120mg/dia", indicacoes: ["Depressão", "TAG", "Dor neuropática"], efeitos: "Náusea, boca seca, constipação" }
    ],
    outros: [
      { nome: "Bupropiona", dosagem: "150-450mg/dia", indicacoes: ["Depressão", "Cessação tabágica"], efeitos: "Ativação, insônia, boca seca, sem disfunção sexual" },
      { nome: "Mirtazapina", dosagem: "15-45mg/dia", indicacoes: ["Depressão", "Insônia", "Perda de apetite"], efeitos: "Sedação, ganho de peso, aumento do apetite" }
    ]
  },
  ansioliticos: [
    { nome: "Clonazepam", dosagem: "0,5-4mg/dia", indicacoes: ["Pânico", "TAG", "Convulsões"], duracao: "Uso de curto prazo", efeitos: "Sedação, dependência" },
    { nome: "Alprazolam", dosagem: "0,25-4mg/dia", indicacoes: ["Pânico", "TAG"], duracao: "Uso de curto prazo", efeitos: "Sedação, dependência, síndrome de abstinência" },
    { nome: "Lorazepam", dosagem: "1-6mg/dia", indicacoes: ["Ansiedade", "Insônia"], duracao: "Uso de curto prazo", efeitos: "Sedação, amnésia anterógrada" }
  ],
  antipsicoticos: [
    { nome: "Risperidona", dosagem: "2-8mg/dia", indicacoes: ["Esquizofrenia", "Transtorno Bipolar", "Irritabilidade no Autismo"], efeitos: "Sintomas extrapiramidais, hiperprolactinemia" },
    { nome: "Quetiapina", dosagem: "25-800mg/dia", indicacoes: ["Esquizofrenia", "Bipolar", "Depressão (adjuvante)"], efeitos: "Sedação, ganho de peso, síndrome metabólica" },
    { nome: "Aripiprazol", dosagem: "10-30mg/dia", indicacoes: ["Esquizofrenia", "Bipolar", "Depressão (adjuvante)"], efeitos: "Acatisia, náusea, insônia" }
  ],
  estabilizadores: [
    { nome: "Lítio", dosagem: "600-1200mg/dia", indicacoes: ["Transtorno Bipolar", "Prevenção de suicídio"], monitoramento: "Litemia, função renal e tireoidiana" },
    { nome: "Ácido Valproico", dosagem: "500-2000mg/dia", indicacoes: ["Bipolar", "Epilepsia"], monitoramento: "Função hepática, hemograma" },
    { nome: "Lamotrigina", dosagem: "25-400mg/dia", indicacoes: ["Bipolar (manutenção)", "Epilepsia"], efeitos: "Rash cutâneo (síndrome de Stevens-Johnson)" }
  ]
};

// Contexto médico psiquiátrico realista
const CONTEXTO_PSIQUIATRA = `Você é Dr. Alexandre Santos, psiquiatra com CRM-SP 123456, formado pela FMUSP, com 15 anos de experiência clínica e especialização em Psicofarmacologia pela ABP.

PERFIL PROFISSIONAL:
- Atendimento humanizado e baseado em evidências científicas
- Experiência em transtornos de humor, ansiedade, psicoses e dependências
- Abordagem integrativa: avaliação completa + farmacoterapia + psicoterapia
- Seguimento rigoroso de protocolos médicos e diretrizes da ABP/APA

ESTRUTURA DE CONSULTA REAL:
1. ACOLHIMENTO: Estabelecer rapport, explicar confidencialidade médica
2. ANAMNESE DETALHADA: História atual, antecedentes, história familiar, social
3. EXAME MENTAL: Aparência, humor, afeto, pensamento, percepção, cognição
4. DIAGNÓSTICO DIFERENCIAL: Baseado em critérios DSM-5-TR/CID-11
5. PLANO TERAPÊUTICO COMPLETO: Medicação + psicoterapia + seguimento

DIAGNÓSTICO E PRESCRIÇÃO:
- Sempre fornecer hipóteses diagnósticas baseadas nos sintomas apresentados
- Explicar o raciocínio clínico por trás do diagnóstico
- Quando indicar medicação: nome, dosagem, horário, duração
- Explicar mecanismo de ação, efeitos esperados e possíveis efeitos adversos
- Orientar sobre tempo de resposta (2-6 semanas para antidepressivos)
- Agendar retorno em 15-30 dias para reavaliação e ajustes
- Solicitar exames complementares quando necessário

COMUNICAÇÃO MÉDICA NATURAL:
- Use linguagem médica profissional mas acessível ao paciente
- Demonstre empatia genuína mantendo postura científica
- Faça perguntas direcionadas para diagnóstico diferencial
- Eduque o paciente sobre sua condição de forma clara
- NUNCA use asteriscos ou descrições de gestos/ações físicas
- Mantenha o foco na conversa verbal natural e fluida

PRESCRIÇÃO RESPONSÁVEL:
- Sempre avaliar indicação, contraindicações e interações
- Considerar perfil do paciente (idade, comorbidades, outros medicamentos)
- Orientar sobre adesão ao tratamento e importância do seguimento
- Em casos de risco: orientar busca imediata de emergência
- Documentar adequadamente todas as orientações

EXEMPLOS DE DIAGNÓSTICOS COMUNS:
- Episódio Depressivo Maior (F32.x)
- Transtorno de Ansiedade Generalizada (F41.1)
- Transtorno do Pânico (F41.0)
- Transtorno Bipolar (F31.x)
- Transtornos relacionados a trauma (F43.x)

Conduza a consulta exatamente como um psiquiatra experiente faria, incluindo diagnósticos e prescrições quando apropriado.`;

// Função para chamar Claude com contexto médico
async function chamarClaude(mensagem, historico = [], contextoAdicional = '') {
  try {
    let contextoCompleto = CONTEXTO_PSIQUIATRA;
    
    if (contextoAdicional) {
      contextoCompleto += `\n\nCONTEXTO ADICIONAL DA CONSULTA:\n${contextoAdicional}`;
    }
    
    contextoCompleto += "\n\nHISTÓRICO DA CONSULTA:\n";
    
    historico.forEach(msg => {
      if (msg.tipo === 'paciente') {
        contextoCompleto += `Paciente: ${msg.conteudo}\n`;
      } else {
        contextoCompleto += `Dr. Alexandre: ${msg.conteudo}\n`;
      }
    });
    
    contextoCompleto += `\nPaciente: ${mensagem}\n\nDr. Alexandre:`;

    const response = await axios.post(CLAUDE_API_URL, {
      model: 'claude-opus-4-1-20250805',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: contextoCompleto
      }]
    }, {
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      timeout: 60000
    });

    return response.data.content[0].text.trim();
  } catch (error) {
    console.error('Erro ao chamar Claude:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tempo limite excedido. O Dr. Alexandre está analisando cuidadosamente sua situação.');
    }
    throw new Error('Dr. Alexandre está processando sua consulta. Aguarde um momento.');
  }
}

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar consulta psiquiátrica
app.post('/api/consulta/iniciar', async (req, res) => {
  try {
    const { nome, idade, genero, motivoConsulta, historicoPsiquiatrico, medicamentosAtuais } = req.body;
    
    if (!nome || !idade) {
      return res.status(400).json({ error: 'Nome e idade são obrigatórios' });
    }

    const sessaoId = Date.now().toString();
    const sessao = {
      id: sessaoId,
      paciente: {
        nome,
        idade,
        genero: genero || 'não informado',
        motivoConsulta: motivoConsulta || '',
        historicoPsiquiatrico: historicoPsiquiatrico || 'negativo',
        medicamentosAtuais: medicamentosAtuais || 'nenhum'
      },
      fase: 'acolhimento',
      historico: [],
      dadosColetados: {},
      iniciada: new Date()
    };

    sessoes.set(sessaoId, sessao);

    // Contexto inicial da consulta
    const contextoInicial = `
DADOS INICIAIS DO PACIENTE:
- Nome: ${nome}
- Idade: ${idade} anos
- Gênero: ${genero || 'não informado'}
- Motivo da consulta: ${motivoConsulta || 'não especificado inicialmente'}
- Histórico psiquiátrico: ${historicoPsiquiatrico || 'a investigar'}
- Medicamentos atuais: ${medicamentosAtuais || 'nenhum'}

FASE: Acolhimento inicial - estabelecer rapport e começar anamnese detalhada.

ORIENTAÇÕES ESPECÍFICAS PARA ESTA CONSULTA:
- Conduza uma anamnese psiquiátrica completa e estruturada
- Investigue sintomas atuais, duração, intensidade e impacto funcional
- Explore fatores desencadeantes e história familiar
- Realize exame mental através da observação da conversa
- Ao final da consulta, forneça hipóteses diagnósticas baseadas em critérios DSM-5-TR
- Se indicado, prescreva medicação com orientações completas
- Sempre eduque o paciente sobre sua condição e tratamento
- Agende seguimento apropriado (15-30 dias)
- Mantenha linguagem natural, sem asteriscos ou descrições de gestos
`;

    const mensagemInicial = `Olá Dr. Alexandre, meu nome é ${nome}, tenho ${idade} anos. ${motivoConsulta ? `Estou aqui porque ${motivoConsulta}.` : 'Gostaria de conversar sobre algumas questões que têm me incomodado.'}`;
    
    const resposta = await chamarClaude(mensagemInicial, [], contextoInicial);

    // Adicionar ao histórico
    sessao.historico.push({
      tipo: 'paciente',
      conteudo: mensagemInicial,
      timestamp: new Date()
    });

    sessao.historico.push({
      tipo: 'medico',
      conteudo: resposta,
      timestamp: new Date()
    });

    sessoes.set(sessaoId, sessao);

    res.json({
      success: true,
      sessaoId,
      resposta: resposta,
      medico: 'Dr. Alexandre Santos',
      crm: 'CRM-SP 123456',
      fase: 'acolhimento'
    });

  } catch (error) {
    console.error('Erro ao iniciar consulta:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Erro ao conectar com Dr. Alexandre. Verifique sua conexão.' 
    });
  }
});

// Rota para conversar durante a consulta
app.post('/api/consulta/conversar', async (req, res) => {
  try {
    const { mensagem, fase, dadosPaciente } = req.body;
    
    if (!mensagem) {
      return res.status(400).json({ 
        success: false,
        message: 'Mensagem é obrigatória' 
      });
    }

    // Contexto baseado na fase atual
    let contextoFase = `
DADOS DO PACIENTE:
- Nome: ${dadosPaciente.nome}
- Idade: ${dadosPaciente.idade} anos
- Gênero: ${dadosPaciente.genero || 'não informado'}
- Motivo da consulta: ${dadosPaciente.motivo || 'não especificado'}
- Medicamentos atuais: ${dadosPaciente.medicamentos || 'nenhum'}

FASE ATUAL: ${fase}

ORIENTAÇÕES ESPECÍFICAS:
- Conduza uma consulta psiquiátrica profissional e empática
- Faça perguntas relevantes para a fase atual
- NUNCA use asteriscos ou descrições de gestos
- Mantenha linguagem médica natural e acolhedora
- Ao final da consulta, forneça diagnóstico e prescrição se indicado
`;

    const resposta = await chamarClaude(mensagem, [], contextoFase);

    res.json({
      success: true,
      resposta: resposta,
      fase: fase,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Erro ao processar conversa:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Dr. Alexandre está temporariamente indisponível. Tente novamente.' 
    });
  }
});

// Continuar consulta (rota antiga)
app.post('/api/consulta/mensagem', async (req, res) => {
  try {
    const { sessaoId, mensagem } = req.body;
    
    if (!sessaoId || !mensagem) {
      return res.status(400).json({ error: 'Sessão e mensagem são obrigatórios' });
    }

    const sessao = sessoes.get(sessaoId);
    if (!sessao) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    // Adicionar mensagem do paciente
    sessao.historico.push({
      tipo: 'paciente',
      conteudo: mensagem,
      timestamp: new Date()
    });

    // Determinar contexto baseado na fase da consulta
    let contextoFase = `
DADOS DO PACIENTE:
- Nome: ${sessao.paciente.nome}
- Idade: ${sessao.paciente.idade} anos
- Gênero: ${sessao.paciente.genero}
- Fase atual: ${sessao.fase}

ORIENTAÇÕES PARA ESTA FASE:
`;

    switch (sessao.fase) {
      case 'acolhimento':
        contextoFase += `
- Estabelecer rapport e confiança terapêutica
- Investigar motivo principal da consulta em detalhes
- Começar anamnese (história da doença atual)
- Perguntar sobre sintomas específicos, duração e intensidade
- Investigar impacto funcional (trabalho, relacionamentos, sono)
- Transicionar para 'anamnese' quando tiver informações suficientes sobre o quadro atual
- NUNCA use asteriscos ou descrições de gestos
`;
        break;
      case 'anamnese':
        contextoFase += `
- Investigar história familiar de transtornos mentais
- Antecedentes pessoais (médicos, cirúrgicos, psiquiátricos)
- História de uso de substâncias (álcool, drogas, tabaco)
- Medicamentos atuais e anteriores (eficácia, efeitos adversos)
- Fatores psicossociais e estressores
- Transicionar para 'exame_mental' quando tiver histórico completo
- NUNCA use asteriscos ou descrições de gestos
`;
        break;
      case 'exame_mental':
        contextoFase += `
- Avaliar aparência, comportamento e atitude
- Investigar humor, afeto e pensamento através da conversa
- Avaliar percepção (alucinações, ilusões)
- Testar cognição básica se necessário
- Avaliar insight e julgamento
- Transicionar para 'diagnostico' quando exame estiver completo
- NUNCA use asteriscos ou descrições de gestos
`;
        break;
      case 'diagnostico':
        contextoFase += `
- Formular hipóteses diagnósticas baseadas em critérios DSM-5-TR
- Explicar o raciocínio clínico ao paciente
- Discutir diagnóstico diferencial se relevante
- Educar sobre a condição identificada
- Transicionar para 'tratamento' para discutir opções terapêuticas
- NUNCA use asteriscos ou descrições de gestos
`;
        break;
      case 'tratamento':
        contextoFase += `
- Discutir opções de tratamento (farmacológico e não-farmacológico)
- Se indicar medicação: nome, dosagem, horário, duração
- Explicar mecanismo de ação e efeitos esperados
- Orientar sobre possíveis efeitos adversos
- Discutir importância da adesão ao tratamento
- Agendar retorno em 15-30 dias
- Fornecer orientações de seguimento
- NUNCA use asteriscos ou descrições de gestos
`;
        break;
      default:
        contextoFase += `
- Continue a consulta de forma natural e profissional
- Mantenha foco nos objetivos terapêuticos
- NUNCA use asteriscos ou descrições de gestos
`;
    }

    const resposta = await chamarClaude(mensagem, sessao.historico.slice(0, -1), contextoFase);

    // Adicionar resposta do médico
    sessao.historico.push({
      tipo: 'medico',
      conteudo: resposta,
      timestamp: new Date()
    });

    // Atualizar fase se necessário (lógica baseada no progresso da consulta)
    const numMensagens = sessao.historico.filter(h => h.tipo === 'medico').length;
    if (numMensagens >= 3 && sessao.fase === 'acolhimento') {
      sessao.fase = 'anamnese';
    } else if (numMensagens >= 6 && sessao.fase === 'anamnese') {
      sessao.fase = 'exame_mental';
    } else if (numMensagens >= 8 && sessao.fase === 'exame_mental') {
      sessao.fase = 'diagnostico';
    } else if (numMensagens >= 10 && sessao.fase === 'diagnostico') {
      sessao.fase = 'tratamento';
    }

    sessoes.set(sessaoId, sessao);

    res.json({
      mensagem: resposta,
      medico: 'Dr. Alexandre Santos',
      fase: sessao.fase,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    res.status(500).json({ 
      error: 'Dr. Alexandre está temporariamente indisponível. Tente novamente.' 
    });
  }
});

// Obter informações sobre medicamentos
app.get('/api/medicamentos/:categoria?', (req, res) => {
  try {
    const { categoria } = req.params;
    
    if (categoria && MEDICAMENTOS_PSIQUIATRICOS[categoria]) {
      res.json({
        categoria,
        medicamentos: MEDICAMENTOS_PSIQUIATRICOS[categoria]
      });
    } else {
      res.json({
        categorias: Object.keys(MEDICAMENTOS_PSIQUIATRICOS),
        medicamentos: MEDICAMENTOS_PSIQUIATRICOS
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter informações sobre medicamentos' });
  }
});

// Finalizar consulta
app.post('/api/consulta/finalizar', async (req, res) => {
  try {
    const { sessaoId } = req.body;
    const sessao = sessoes.get(sessaoId);
    
    if (!sessao) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    const contextoFinal = `
FINALIZANDO CONSULTA:
- Resumir principais pontos discutidos
- Reforçar plano terapêutico se estabelecido
- Agendar retorno (15-30 dias se medicação, 1-2 semanas se caso agudo)
- Dar orientações de emergência (quando procurar ajuda imediata)
- Despedida profissional e acolhedora
- Lembrar que pode entrar em contato se necessário
`;

    const mensagemFinal = await chamarClaude(
      "Doutor, acredito que por hoje é isso. Muito obrigado pela consulta.", 
      sessao.historico, 
      contextoFinal
    );

    sessao.historico.push({
      tipo: 'medico',
      conteudo: mensagemFinal,
      timestamp: new Date()
    });

    // Remover sessão após 2 horas
    setTimeout(() => {
      sessoes.delete(sessaoId);
    }, 7200000);

    res.json({
      mensagem: mensagemFinal,
      finalizada: true,
      proximoRetorno: "15-30 dias",
      orientacoes: "Em caso de emergência, procure o pronto-socorro mais próximo ou ligue 192."
    });

  } catch (error) {
    console.error('Erro ao finalizar consulta:', error);
    res.status(500).json({ error: 'Erro ao finalizar consulta' });
  }
});

// Obter relatório da consulta
app.get('/api/consulta/relatorio/:sessaoId', (req, res) => {
  try {
    const { sessaoId } = req.params;
    const sessao = sessoes.get(sessaoId);
    
    if (!sessao) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    const relatorio = {
      paciente: sessao.paciente,
      dataConsulta: sessao.iniciada,
      duracaoConsulta: Math.round((new Date() - sessao.iniciada) / 60000) + ' minutos',
      faseAtual: sessao.fase,
      numeroInteracoes: sessao.historico.length,
      historico: sessao.historico
    };

    res.json(relatorio);

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    consultasAtivas: sessoes.size,
    claudeAPI: 'Configurada',
    medicamentos: Object.keys(MEDICAMENTOS_PSIQUIATRICOS).length + ' categorias'
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno. Entre em contato com a recepção.' 
  });
});

// Função para encontrar porta disponível
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🏥 Dr. Alexandre Santos - Consultório Psiquiátrico`);
    console.log(`🌐 Servidor rodando na porta ${port}`);
    console.log(`🔑 Claude API: Configurada`);
    console.log(`💊 Base farmacológica: ${Object.keys(MEDICAMENTOS_PSIQUIATRICOS).length} categorias`);
    console.log(`📋 Protocolos médicos: Ativados`);
    console.log(`✅ Sistema médico real em funcionamento`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Porta ${port} ocupada, tentando ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Erro ao iniciar servidor:', err);
      process.exit(1);
    }
  });
}

// Iniciar servidor com detecção automática de porta
startServer(PORT);

