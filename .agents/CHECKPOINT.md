# CHECKPOINT — perfil-github
> Atualizado: 13/11/2026. PERFIL-001 executada e Gate 2 aprovado na branch `feat/reposicionamento-readme`.
## Estado
- `main` permanece intocada.
- README PT/EN, `projects.json`, `content.json`, geradores próprios e workflow foram atualizados.
- Gate 2 aprovado no GitHub Actions; não houve merge na `main`.
## Provas locais
- `npm run readme` e `npm run readme:check`: verdes.
- `npm run visuals`: seis SVGs próprios gerados, cada um abaixo de 40 KB.
- `npm run generate` sem token: falha com exit 1 sem criar card parcial.
- Run autenticado `43485358251` (commit `b54bec5`) concluiu com `success`; job `gerar` e todas as etapas ficaram verdes.
## Pendências
- Gate 3: validar os READMEs renderizados em desktop/mobile, claro/escuro.
- Gate 3 e merge são do Claude; `main` permanece intocada.
## Pós-merge
- Atualizar descrição, tópicos e homepage do perfil; remover qualquer artefato solto remanescente.
