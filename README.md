# Pontos de Venda - APAE

Sistema de gerenciamento e visualização de pontos de venda para a APAE.

## Descrição

Este aplicativo permite que os usuários visualizem os pontos de venda disponíveis, pesquisem por localização e acessem um painel administrativo para gerenciar esses pontos.

## Tecnologias Utilizadas

- **React** com **TypeScript**
- **Vite**
- **Firebase** (Firestore)
- **Tailwind CSS**
- **Framer Motion** (Motion)
- **Lucide React** (Ícones)

## Como Executar Localmente

### Pré-requisitos

- Node.js instalado

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` baseado no `.env.example`
   - Adicione suas chaves do Firebase e da Gemini API
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

- `src/components`: Componentes da interface do usuário
- `src/firebase.ts`: Configuração do Firebase
- `src/types.ts`: Definições de tipos TypeScript
- `firestore.rules`: Regras de segurança do Firestore
