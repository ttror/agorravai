# 🔑 CONFIGURAÇÃO DA API CLAUDE

## ⚠️ IMPORTANTE - CHAVE API OBRIGATÓRIA

Este sistema requer uma **chave API válida da Anthropic** para funcionar.

## 🚀 COMO OBTER UMA CHAVE VÁLIDA:

### 1. Acesse o Console Anthropic:
```
https://console.anthropic.com/
```

### 2. Faça Login/Cadastro:
- Crie uma conta ou faça login
- Adicione créditos se necessário

### 3. Gere uma Nova Chave:
- Vá em "API Keys"
- Clique em "Create Key"
- Copie a chave completa (começa com `sk-ant-api03-`)

## 🔧 CONFIGURAÇÃO NO CODESANDBOX:

### 1. Adicionar Variável de Ambiente:
```
Nome: ANTHROPIC_API_KEY
Valor: sua-chave-aqui
```

### 2. Reiniciar o Servidor:
```bash
npm start
```

### 3. Verificar Funcionamento:
Você deve ver:
```
🔑 Claude API: Configurada
✅ Sistema médico real em funcionamento
```

## 🚨 PROBLEMAS COMUNS:

### Erro "invalid x-api-key":
- Chave expirada ou inválida
- Gere uma nova chave no console

### Erro "insufficient credits":
- Adicione créditos na conta Anthropic
- Verifique limites de uso

### Timeout:
- Normal para primeiras requisições
- Sistema tem retry automático

## 💡 TESTE RÁPIDO:

Após configurar, teste com:
```
Nome: João Silva
Idade: 35
Motivo: Ansiedade e insônia
```

O Dr. Alexandre deve responder em até 30 segundos.

