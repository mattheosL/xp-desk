# Xp Desk — Sprint 1

Frontend inicial do **Gerenciador de Projetos Kanban**, desenvolvido com React, TypeScript e Vite. A interface usa **XP.css** para trazer referências visuais do Windows XP, sem recriar a área de trabalho, o menu Iniciar, a barra de tarefas ou outros elementos estruturais do sistema operacional.

## 1. Escopo entregue

Esta versão contempla somente a Sprint 1 descrita no documento do projeto:

- projeto Vite + React + TypeScript;
- navegação com React Router;
- layout base com cabeçalho e navegação lateral/responsiva;
- tela de login;
- tela de cadastro com validações básicas;
- autenticação simulada no navegador;
- proteção das rotas internas;
- painel inicial demonstrativo e páginas indicativas para funcionalidades de sprints futuras.

As telas de Projetos e Quadros Kanban são apenas espaços reservados. Não implementam operações de CRUD, colunas, cards, subtarefas ou integração com o backend.

## 2. Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Componentes e interface |
| TypeScript | Tipagem do frontend |
| Vite | Servidor e build de desenvolvimento |
| React Router DOM 6 | Rotas e navegação |
| XP.css 0.2.6 | Aparência inspirada no Windows XP |
| CSS tradicional | Responsividade, composição das telas e ajustes visuais |

O XP.css é importado em `src/main.tsx`:

```ts
import 'xp.css/dist/XP.css';
```

Os estilos próprios ficam em `src/styles/global.css` e complementam a biblioteca. A biblioteca não controla autenticação, navegação ou comportamento dos formulários.

## 3. Como executar

Requisitos: Node.js 18 ou superior e npm.

```bash
# 1. Entre na pasta do projeto
cd kanban-sprint1

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Abra o endereço indicado pelo Vite (por padrão, `http://localhost:5173`).

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## 4. Como testar os fluxos

### Acesso demonstrativo

1. Abra `/login`.
2. Clique em **Entrar em modo demonstração**.
3. Você será direcionado para `/app`.
4. Use **Sair** no cabeçalho para encerrar a sessão local.

### Cadastro e login simulado

1. Em `/login`, abra **Criar conta**.
2. Informe nome de usuário, e-mail, senha e confirmação.
3. As validações atuais exigem nome de usuário de 3 a 10 caracteres, e senha de 4 a 8 caracteres. Esses limites acompanham os dados documentados para o endpoint de criação de usuário da API fornecida.
4. Após cadastrar, a aplicação abre a área interna. Para testar o login novamente, saia e entre com o mesmo e-mail e senha.

### Proteção de rotas

Tente abrir `/app` sem uma sessão. A aplicação redirecionará para `/login`. Depois do acesso, as rotas de `/app` ficam disponíveis.

## 5. Persistência e segurança — importante

Esta Sprint 1 usa armazenamento local do navegador:

- os usuários criados nesta demonstração ficam em `localStorage`;
- a sessão atual fica em `sessionStorage`;
- a senha não é gravada em texto puro no armazenamento de demonstração: é gerado um hash SHA-256 no navegador.

**Isso não é autenticação segura.** O hash local não substitui autenticação no servidor, gerenciamento seguro de sessão, HTTPS ou políticas de senha adequadas. Não reutilize senhas pessoais nesta demonstração.

A documentação da API fornecida informa que o backend ainda não implementa login/JWT e utiliza o header `X-User-Id` com UUID para identificar o usuário em operações que dependem do contexto. Por esse motivo, esta entrega não envia credenciais para a API e não simula um login real no backend. A integração deverá ser planejada e validada em uma sprint posterior.

## 6. Tipografia e linguagem visual

A interface prioriza fontes disponíveis no sistema, sem depender de downloads externos:

```css
font-family: Tahoma, "Segoe UI", Arial, sans-serif;
```

- **Tahoma** é a primeira opção para aproximar a leitura da interface clássica do Windows.
- **Segoe UI** e **Arial** são alternativas caso Tahoma não esteja instalada.
- A tipografia é mantida em tamanhos compactos nos formulários, navegação e metadados, com títulos maiores para hierarquia visual.
- O XP.css fornece a base visual de controles e janelas; o CSS do projeto adapta cores, espaçamentos, layout e responsividade.

## 7. Estrutura de pastas

```text
src/
├── components/
│   ├── AppShell.tsx
│   ├── AuthFrame.tsx
│   ├── Brand.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── ComingSoonPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── RegisterPage.tsx
├── routes/
│   └── AppRoutes.tsx
├── styles/
│   └── global.css
├── utils/
│   └── storage.ts
├── main.tsx
└── types.ts
```

## 8. Fontes e documentação de referência

### Materiais do projeto

- `Projeto_Kanban_ReactJS_corrigido_v2_removed.pdf` — escopo, entregas, cronograma e funcionalidades previstas para cada sprint.
- `api-documentation.html` — documentação fornecida da API, usada apenas para respeitar os limites de validação e registrar a situação atual da autenticação.

### Fontes técnicas

- XP.css — documentação e exemplos: <https://botoxparty.github.io/XP.css/>
- XP.css — repositório: <https://github.com/botoxparty/XP.css>
- XP.css — pacote npm: <https://www.npmjs.com/package/xp.css>
- React Router — rotas declarativas: <https://reactrouter.com/start/declarative/routing>
- Vite — guia: <https://vite.dev/guide/>
- React — documentação: <https://react.dev/learn>
- TypeScript — documentação: <https://www.typescriptlang.org/docs/>

## 9. Próximos passos fora desta entrega

As próximas sprints poderão substituir as telas reservadas por funcionalidades reais, conforme o cronograma do documento:

- Sprint 2: dashboard com projetos, perfil e integração dos endpoints disponíveis;
- Sprint 3: quadro, colunas e cards de exemplo;
- Sprints seguintes: operações dos cards, colaboração, subtarefas, integração e testes.

Não foram implementadas nesta Sprint 1 funcionalidades das etapas posteriores.
