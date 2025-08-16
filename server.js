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
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY || "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";
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
- Atendimento humanizado e baseado em evidências
- Experiência em transtornos de humor, ansiedade e psicoses
- Abordagem integrativa: psicoterapia + farmacoterapia quando necessário
- Seguimento rigoroso de protocolos médicos e diretrizes da ABP

ESTRUTURA DE CONSULTA REAL:
1. ACOLHIMENTO: Estabelecer rapport, explicar confidencialidade
2. ANAMNESE: História da doença atual, antecedentes, história familiar
3. EXAME MENTAL: Aparência, humor, pensamento, percepção, cognição
4. HIPÓTESE DIAGNÓSTICA: Baseada em critérios DSM-5-TR/CID-11
5. PLANO TERAPÊUTICO: Medicação (se indicada), psicoterapia, seguimento

PRESCRIÇÃO MÉDICA (quando indicada):
- Sempre explicar indicação, dosagem, efeitos esperados e adversos
- Orientar sobre tempo de resposta terapêutica (2-6 semanas)
- Agendar retorno em 15-30 dias para ajustes
- Monitoramento de exames quando necessário
- Orientações sobre interações medicamentosas

COMUNICAÇÃO MÉDICA:
- Use linguagem técnica apropriada mas acessível
- Demonstre empatia genuína sem perder profissionalismo
- Faça perguntas específicas para diagnóstico diferencial
- Eduque o paciente sobre sua condição
- Sempre mencione a importância do seguimento

IMPORTANTE:
- Nunca prescreva sem avaliação adequada
- Sempre considere diagnósticos diferenciais
- Oriente sobre riscos e benefícios dos tratamentos
- Mantenha postura ética e profissional
- Em casos graves, oriente busca de emergência

Conduza a consulta como um psiquiatra experiente faria na vida real.`;

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
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1200,
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
      timeout: 30000
    });

    return response.data.content[0].text.trim();
  } catch (error) {
    console.error('Erro ao chamar Claude:', error.response?.data || error.message);
    throw new Error('Erro na comunicação. Tente novamente em alguns instantes.');
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

FASE: Acolhimento inicial - estabelecer rapport e começar anamnese.
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
      sessaoId,
      mensagem: resposta,
      medico: 'Dr. Alexandre Santos',
      crm: 'CRM-SP 123456',
      fase: 'acolhimento'
    });

  } catch (error) {
    console.error('Erro ao iniciar consulta:', error);
    res.status(500).json({ 
      error: 'Erro ao conectar com Dr. Alexandre. Verifique sua conexão.' 
    });
  }
});

// Continuar consulta
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
- Estabelecer rapport e confiança
- Investigar motivo principal da consulta
- Começar anamnese (história da doença atual)
- Perguntar sobre sintomas específicos
- Transicionar para 'anamnese' quando apropriado
`;
        break;
      case 'anamnese':
        contextoFase += `
- Investigar história familiar de transtornos mentais
- Antecedentes pessoais (médicos, cirúrgicos, psiquiátricos)
- História de uso de substâncias
- Medicamentos atuais e anteriores
- Transicionar para 'exame_mental' quando apropriado
`;
        break;
      case 'exame_mental':
        contextoFase += `
- Avaliar aparência, comportamento, humor e afeto
- Investigar pensamento (forma e conteúdo)
- Avaliar percepção (alucinações, ilusões)
- Testar cognição básica (orientação, memória, atenção)
- Avaliar insight e julgamento
- Transicionar para 'diagnostico' quando apropriado
`;
        break;
      case 'diagnostico':
        contextoFase += `
- Formular hipóteses diagnósticas baseadas em DSM-5-TR
- Explicar diagnóstico de forma compreensível
- Discutir diagnósticos diferenciais se relevante
- Transicionar para 'tratamento' quando apropriado
`;
        break;
      case 'tratamento':
        contextoFase += `
- Discutir opções terapêuticas (medicamentosa e não-medicamentosa)
- Se indicar medicação, explicar: indicação, dosagem, efeitos esperados e adversos
- Orientar sobre tempo de resposta (2-6 semanas para antidepressivos)
- Agendar retorno em 15-30 dias
- Dar orientações gerais (sono, exercício, evitar álcool)
- Transicionar para 'encerramento' quando apropriado
`;
        break;
    }

    const resposta = await chamarClaude(mensagem, sessao.historico.slice(0, -1), contextoFase);

    // Adicionar resposta do médico
    sessao.historico.push({
      tipo: 'medico',
      conteudo: resposta,
      timestamp: new Date()
    });

    // Atualizar fase se necessário (lógica simples baseada no número de mensagens)
    const numMensagens = sessao.historico.filter(h => h.tipo === 'medico').length;
    if (numMensagens >= 3 && sessao.fase === 'acolhimento') {
      sessao.fase = 'anamnese';
    } else if (numMensagens >= 6 && sessao.fase === 'anamnese') {
      sessao.fase = 'exame_mental';
    } else if (numMensagens >= 9 && sessao.fase === 'exame_mental') {
      sessao.fase = 'diagnostico';
    } else if (numMensagens >= 11 && sessao.fase === 'diagnostico') {
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🏥 Dr. Alexandre Santos - Consultório Psiquiátrico`);
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`🔑 Claude API: Configurada`);
  console.log(`💊 Base farmacológica: ${Object.keys(MEDICAMENTOS_PSIQUIATRICOS).length} categorias`);
  console.log(`📋 Protocolos médicos: Ativados`);
  console.log(`✅ Sistema médico real em funcionamento`);
});

