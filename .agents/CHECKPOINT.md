# CHECKPOINT — perfil-github
> Atualizado: 13/11/2026. PERFIL-001 executada na branch `feat/reposicionamento-readme`.
## Estado
- `main` permanece intocada.
- README PT/EN, `projects.json`, `content.json`, geradores próprios e workflow foram atualizados.
- A branch está pronta para revisão do Gate 2; não houve merge nem publicação.
## Provas locais
- `npm run readme` e `npm run readme:check`: verdes.
- `npm run visuals`: seis SVGs próprios gerados, cada um abaixo de 40 KB.
- `npm run generate` sem token: falha com exit 1 sem criar card parcial.
- `xmllint` e grep final ainda devem ser executados no Gate 2 com a geração autenticada.
## Pendências
- Rodar o gerador com `CARDS_TOKEN` fine-grained no ambiente do workflow.
- Validar os READMEs renderizados em desktop/mobile, claro/escuro.
- Conferir actions e secrets no Gate 2; Gate 3 e merge são do Claude.
## Pós-merge
- Atualizar descrição, tópicos e homepage do perfil; remover qualquer artefato solto remanescente.
