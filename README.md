# Sistema de Avaliação - Controle Interno

Sistema completo para gerenciamento de avaliações e acompanhamento de usuários em período de experiência.

## 🎯 Funcionalidades

### 📝 Cadastros
- **Pessoas**: Cadastro completo de usuários
- **Empresas**: Gerenciamento de empresas parceiras  
- **Funções**: Definição de cargos e funções
- **Avaliação**: Configurações de avaliação

### 📋 Formulários
1. **Controle Interno**: Avaliação de usuários em período de experiência (tabela principal)
2. **Avaliação Experiência 1**: Formulário detalhado com 46 questões para primeira avaliação
3. **Avaliação Experiência 2**: Formulário detalhado com 46 questões para segunda avaliação
4. **Ficha de Acompanhamento**: Acompanhamento no mercado de trabalho
5. **Lista de Usuários Encaminhados**: Controle de usuários encaminhados ao trabalho

## 🔧 Funcionalidades Admin

### Avaliações de Experiência
- ➕ **Adicionar questões** personalizadas
- ❌ **Remover questões** personalizadas (questões originais protegidas)
- 📊 **46 questões padrão** baseadas nos documentos oficiais
- 📝 **Campos de observações** e situações específicas

### Lista de Usuários
- ➕ **Adicionar usuários** à lista
- ❌ **Remover usuários** da lista
- 📅 **Ano editável** (padrão: 2025)
- 📊 **Estatísticas em tempo real**
- 📄 **Exportar para PDF** (funcionalidade futura)

## 🛠️ Tecnologias

- **React 18** - Framework principal
- **HTML5** - Estrutura semântica
- **CSS3 Puro** - Estilização sem frameworks externos
- **JavaScript ES6+** - Lógica da aplicação
- **Vite** - Build tool e servidor de desenvolvimento

## 🎨 Design

- **Layout Responsivo** - Adaptável para desktop, tablet e mobile
- **CSS Puro** - Sem dependência de Tailwind ou Bootstrap
- **Paleta de Cores Profissional** - Tons de azul e cinza
- **Interface Intuitiva** - Navegação clara com ícones
- **Componentes Reutilizáveis** - Estrutura modular

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação
```bash
# Instalar dependências
npm install
# ou
pnpm install
```

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
pnpm run dev

# Acesse: http://localhost:5174
```

### Build para Produção
```bash
# Gerar build otimizado
npm run build
# ou
pnpm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Login.jsx              # Tela de autenticação
│   ├── Navigation.jsx         # Navegação principal
│   ├── Cadastro.jsx          # Sistema de cadastros
│   ├── FormularioAvaliacao.jsx # Formulário baseado no anexo
│   ├── Relatorios.jsx        # Tela de relatórios
│   └── Configuracoes.jsx     # Configurações do sistema
├── App.jsx                   # Componente principal
├── App.css                   # Estilos CSS puros
└── main.jsx                  # Ponto de entrada
```

## 🔑 Credenciais de Teste

Para acessar o sistema:
- **E-mail**: qualquer e-mail válido
- **Senha**: qualquer senha

*Nota: O sistema simula autenticação para fins de demonstração*

## 📊 Funcionalidades Baseadas no Anexo

O formulário principal foi desenvolvido seguindo exatamente a estrutura do documento anexado:
- **Título**: "CONTROLE INTERNO - AVALIAÇÃO USUÁRIOS PERÍODO EXPERIÊNCIA - 2025"
- **Colunas da Tabela**: Todas as colunas do documento original
- **Funcionalidades**: Adição dinâmica de linhas, validações e estatísticas

## 🔧 Flexibilidade para Expansão

O sistema foi projetado para fácil expansão:
- **Arquitetura Modular** - Novos componentes podem ser facilmente adicionados
- **Navegação Dinâmica** - Menu preparado para novos módulos
- **CSS Organizados** - Estilos reutilizáveis e bem estruturados
- **Estado Centralizado** - Gerenciamento de dados preparado para crescimento

## 📝 Próximos Passos

Após aprovação do cliente:
1. **Integração com Backend** - Conectar com APIs reais
2. **Autenticação Real** - Implementar sistema de login seguro
3. **Banco de Dados** - Persistência real dos dados
4. **Novos Formulários** - Adicionar formulários específicos conforme necessidade
5. **Relatórios Avançados** - Implementar geração real de relatórios
6. **Notificações** - Sistema de alertas e lembretes

## 🎯 Observações

- **Foco na Apresentação**: Sistema desenvolvido para demonstração visual
- **Dados Simulados**: Todas as operações são simuladas para fins de amostragem
- **Responsivo**: Testado em diferentes resoluções
- **Acessível**: Contraste adequado e navegação por teclado

---

**Desenvolvido para amostragem ao cliente** 🎨  
**Sistema de Avaliação - Controle Interno © 2025**

