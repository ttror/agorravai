# 🧠 Dr. Alexandre Santos - Sistema Psiquiátrico Realista

Sistema de atendimento psiquiátrico baseado em protocolos médicos reais, desenvolvido para proporcionar uma experiência autêntica de consulta médica.

## ⚡ **Características Principais**

### 🏥 **Experiência Médica Autêntica**
- **Dr. Alexandre Santos** - CRM-SP 123456
- **Especialização** em Psicofarmacologia pela ABP
- **15 anos** de experiência clínica
- **Protocolos reais** baseados em DSM-5-TR e CID-11

### 📋 **Consulta Estruturada**
1. **Acolhimento** - Estabelecimento de rapport
2. **Anamnese** - História detalhada da doença atual
3. **Exame Mental** - Avaliação psicopatológica
4. **Diagnóstico** - Hipóteses baseadas em critérios
5. **Tratamento** - Plano terapêutico completo

### 💊 **Base Farmacológica Completa**
- **Antidepressivos:** ISRS, IRSN, outros (dosagens reais)
- **Ansiolíticos:** Benzodiazepínicos (uso controlado)
- **Antipsicóticos:** Típicos e atípicos
- **Estabilizadores:** Lítio, anticonvulsivantes

## 🚀 **Instalação e Uso**

### **1. Pré-requisitos**
```bash
Node.js >= 18.0.0
Chave API Claude válida
```

### **2. Configuração**
```bash
# Clonar/baixar o projeto
cd psiquiatra-real

# Instalar dependências
npm install

# Configurar API Claude
export ANTHROPIC_API_KEY="sua-chave-claude-aqui"

# Iniciar servidor
npm start
```

### **3. Acesso**
```
http://localhost:3001
```

## 🔧 **Configuração da API**

### **Claude API (Obrigatória)**
```bash
# Variável de ambiente
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Ou no CodeSandbox
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### **Verificação**
Se configurado corretamente:
```
🔑 Claude API: Configurada
✅ Sistema médico real em funcionamento
```

## 📊 **Funcionalidades Médicas**

### **Ficha de Identificação**
- Nome completo e idade (obrigatórios)
- Gênero com opções inclusivas
- Histórico psiquiátrico estruturado
- Motivo detalhado da consulta
- Medicamentos atuais

### **Avaliação Clínica**
- Anamnese psiquiátrica completa
- Exame do estado mental
- Avaliação de risco suicida
- Diagnóstico diferencial
- Prescrição quando indicada

### **Prescrições Médicas**
- Indicação baseada em evidências
- Dosagens padronizadas
- Efeitos adversos explicados
- Tempo de resposta terapêutica
- Monitoramento necessário

## 🎯 **Diferenciais do Sistema**

### **1. Realismo Médico**
- Linguagem técnica apropriada
- Protocolos de atendimento autênticos
- Prescrições baseadas em guidelines
- Paciente não percebe que é IA

### **2. Base Científica**
- Medicamentos com dosagens reais
- Efeitos adversos documentados
- Interações medicamentosas
- Monitoramento laboratorial

### **3. Ética Médica**
- Disclaimers apropriados
- Orientações de emergência
- Confidencialidade médica
- Limites do atendimento virtual

## 📁 **Estrutura do Projeto**

```
psiquiatra-real/
├── server.js              # Backend com Claude API
├── package.json           # Dependências (3 apenas)
├── public/
│   └── index.html         # Interface médica completa
├── README.md              # Esta documentação
└── .gitignore            # Configuração Git
```

## 🔒 **Segurança e Privacidade**

### **Dados do Paciente**
- ✅ Sessões temporárias (2 horas)
- ✅ Dados não persistidos
- ✅ Comunicação criptografada
- ✅ Sem armazenamento local

### **API e Conexões**
- ✅ Timeout de 30s
- ✅ Tratamento de erros robusto
- ✅ Validação de entrada
- ✅ Rate limiting configurável

## ⚠️ **Avisos Importantes**

### **Uso Educacional**
- Sistema para fins educacionais e demonstração
- **NÃO substitui** consulta médica real
- Em emergências: procurar ajuda (192)
- Sempre consultar profissional habilitado

### **Responsabilidade**
- Desenvolvido com base em protocolos reais
- Informações para fins educativos
- Usuário responsável pelo uso adequado
- Não há responsabilidade médica

## 🛠️ **Deploy**

### **CodeSandbox**
1. Import do GitHub
2. Configurar `ANTHROPIC_API_KEY`
3. Sistema inicia automaticamente

### **Heroku/Vercel**
1. Deploy direto do repositório
2. Configurar variável de ambiente
3. Funciona imediatamente

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
CMD ["npm", "start"]
```

## 📞 **Suporte**

### **Problemas Comuns**
- **Erro 500:** Verificar chave Claude
- **Não carrega:** Verificar porta 3001
- **Timeout:** Verificar conexão internet

### **Logs do Sistema**
```bash
# Verificar status
curl http://localhost:3001/health

# Logs detalhados
npm start
```

## 📈 **Roadmap**

### **Próximas Versões**
- [ ] Integração com prontuário eletrônico
- [ ] Relatórios médicos em PDF
- [ ] Agendamento de retornos
- [ ] Histórico de consultas
- [ ] Integração com laboratórios

---

**Sistema desenvolvido com foco em realismo médico e experiência autêntica de consulta psiquiátrica.**

*Dr. Alexandre Santos - CRM-SP 123456*  
*Especialista em Psicofarmacologia*

