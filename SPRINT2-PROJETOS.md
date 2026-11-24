# Sprint 2 — Projetos

Backend original fakeTrello, sem alterações. Frontend integrado aos endpoints existentes. Execute o backend na porta 8080 e, no frontend, `npm ci` e `npm run dev`. O proxy Vite existente encaminha /api para localhost:8080; não é necessário criar .env. Entre com uma conta real.

Arquivos alterados: src/pages/{Projects,ProjectDetails,Dashboard}.tsx, src/hooks/useProjects.ts, src/services/{projectService,api}.ts, src/types/project.ts, src/styles/projects.css, src/components/layout/{Header,Sidebar}.tsx.

API: GET/POST /api/v1/projects; GET/PUT /api/v1/projects/{id}; PATCH /{id}/archive e /{id}/restore; GET /archived; GET /{id}/members; GET /api/v1/boards/project/{id}. JWT continua sendo a autenticação; X-User-Id é enviado nas chamadas de projetos, sem substituir o JWT. Nome de 3 a 100 caracteres. Descrição não existe no contrato atual. A listagem de arquivados do backend é restrita ao proprietário. Quadros e membros são exibidos em leitura; não há edição de quadros nesta entrega.

Teste manual: login, criar projeto, editar nome, pesquisar, ordenar, abrir detalhes, arquivar, restaurar, recarregar a página e confirmar persistência. Teste também com backend desligado e usuário sem permissão de edição.

Validação: sintaxe TypeScript verificada por transpileModule. Build completo e integração não executados neste ambiente por indisponibilidade das dependências npm. Execute `npm run build` localmente.
