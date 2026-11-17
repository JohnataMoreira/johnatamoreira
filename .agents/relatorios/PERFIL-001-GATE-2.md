# Relatório de execução — PERFIL-001 e Gate 2

**Repositório:** `JohnataMoreira/johnatamoreira`  
**Branch de trabalho:** `feat/reposicionamento-readme`  
**PR:** [#1](https://github.com/JohnataMoreira/johnatamoreira/pull/1)  
**Data:** 13/11/2026  
**Executor:** Manus

## 1. Objetivo

Executar a tarefa `PERFIL-001 — Reposicionar README do perfil`, preservando a `main` e preparando a entrega para revisão humana. O escopo da tarefa era reposicionar o perfil como **Full-stack / Product Engineer**, declarar o desenvolvimento assistido por IA, destacar Mishyo, manter o Painel J&JL como segundo projeto, remover conteúdo desatualizado e substituir serviços externos de cards por geradores próprios.

A `main` não foi alterada e nenhum merge foi executado.

## 2. Descoberta e preparação

A tarefa foi localizada no próprio repositório, nos arquivos:

- `.agents/BACKLOG.md`;
- `.agents/CHECKPOINT.md`;
- `.agents/propostas/G1_PERFIL-001.md`.

A branch remota indicada pela spec era `feat/reposicionamento-readme`, inicialmente no commit `15e679c41feed0cf5bbc250fd24d02f6770b9860`. O checkout local foi materializado a partir dessa branch dentro do workspace de trabalho. A implementação foi feita sem usar a `main` como destino de escrita.

## 3. Alterações realizadas

### 3.1 Conteúdo do perfil

- Criado `README.md` em português.
- Criado `README.en.md` em inglês.
- Incluído posicionamento como **Full-stack / Product Engineer**.
- Incluída a declaração de desenvolvimento assistido por IA com gates, prova e auditoria.
- Mantidos apenas os dois projetos aprovados:
  - Mishyo;
  - Painel J&JL.
- Removidos projetos e tecnologias antigas que não pertenciam mais ao posicionamento.
- Removidas contagens antigas e alegações não sustentadas.
- Mantido o link correto de WhatsApp: `https://wa.me/5531975693311`.
- Incluídas as seções sobre Mishyo, Painel J&JL, processo de trabalho, Instituto Jesus Lindão, atividade e contato.
- Incluídos os visuais próprios no README em português e inglês.
- Incluído o rodapé com o asset `assets/makakoloko.webp`.

### 3.2 Fonte única de projetos

Criado `projects.json` com os campos previstos pela spec:

- `id`;
- `nome`;
- `status`;
- `url`;
- `resumo_pt`;
- `resumo_en`;
- `stack`;
- `destaque`.

O README agora é gerado a partir dessa fonte. O arquivo `content.json` também foi criado como lista vazia, deixando a seção de artigos oculta até que existam itens aprovados.

### 3.3 Geração e validação de README

Criado `scripts/render-readme.mjs`, com:

- geração dos dois READMEs;
- validação da estrutura de `projects.json`;
- validação das URLs permitidas em `content.json`;
- limite de cinco itens recentes na futura seção de artigos;
- fingerprint do `projects.json` embutido nos READMEs;
- falha de `npm run readme:check` quando o arquivo de projetos muda sem regeneração.

Comandos adicionados ao `package.json`:

```text
npm run readme
npm run readme:check
npm run generate
npm run visuals
```

Também foi definido `"private": true` no `package.json`.

### 3.4 Cards próprios

O gerador antigo foi substituído por `scripts/generate-cards.mjs`.

O novo gerador:

- exige `GH_TOKEN` ou `GITHUB_TOKEN`;
- encerra com exit 1 se não houver token;
- calcula os commits dos dois projetos em foco usando a paginação da API;
- gera quatro SVGs próprios:
  - `central-comando.svg`;
  - `instituto.svg`;
  - `ranking.svg`;
  - `sequencia.svg`;
- grava `cards/data.json` para alimentar os visuais;
- não publica SVG parcial quando a autenticação falha.

Os SVGs antigos rastreados em `cards/` foram removidos da branch principal, e o `.gitignore` passou a excluir os artefatos gerados.

### 3.5 Visuais próprios

Criado `scripts/visuals/index.mjs`, responsável por gerar:

- `header.svg` e `header.en.svg`;
- `gates.svg` e `gates.en.svg`;
- `tijolos.svg` e `tijolos.en.svg`.

Os visuais usam SVG próprio, CSS interno, tema claro/escuro, animação nativa e nenhum script ou referência externa. O visual de tijolos lê `totalCommits` de `cards/data.json` e usa a regra de um tijolo para cada 40 commits.

### 3.6 Limpeza

Foram removidos:

- `PROTOTIPO.md`;
- `assets/prototipos/gates.svg`;
- `assets/prototipos/header.svg`;
- `assets/prototipos/tijolos.svg`;
- SVGs antigos em `cards/`;
- `makakoloko.webp` da raiz.

O asset foi movido para `assets/makakoloko.webp`.

### 3.7 Workflow

O workflow `.github/workflows/perfil.yml` foi atualizado para:

1. executar em agenda, dispatch manual e alterações relevantes;
2. usar `actions/checkout` fixada no SHA `11bd71901bbe5b1630ceea73d27597364c9af683`;
3. usar `actions/setup-node` fixada no SHA `49933ea5288caeca8642d1e84afbd3f7d6820020`;
4. gerar README, cards e visuais;
5. publicar os artefatos na branch `output`;
6. usar o secret `CARDS_TOKEN` sem alterar seu nome.

## 4. Validações locais

Foram executadas as seguintes validações:

- `npm run readme`: aprovado;
- `npm run readme:check`: aprovado;
- mudança artificial em `projects.json` sem regenerar: `readme:check` falhou como esperado;
- grep de termos proibidos nos READMEs, projetos, scripts e workflow: zero ocorrências;
- link de WhatsApp conferido;
- todas as linhas `uses:` do workflow conferidas com SHA de 40 caracteres;
- `xmllint --noout` executado nos SVGs;
- SVGs conferidos sem `<script>`, `href`, `xlink:href` ou referências externas indevidas;
- tamanhos dos SVGs abaixo de 40 KB;
- execução de `npm run generate` sem token: exit 1, sem SVG parcial;
- `git diff --check`: aprovado.

O teste do visual de tijolos foi executado com dois valores de `totalCommits`, verificando que o SVG é regenerado a partir do dado de entrada e que não contém porcentagem.

## 5. Commits e PR

### Commit principal da implementação

[`b54bec5aff7537f49b9f5c3aad32fe8093a7e0da`](https://github.com/JohnataMoreira/johnatamoreira/commit/b54bec5aff7537f49b9f5c3aad32fe8093a7e0da)

Mensagem:

```text
feat(perfil): executar PERFIL-001 e preparar Gate 2
```

### Commit de registro do Gate 2

[`c8eb7a9c10416ab66b51cca6838ff65a98715058`](https://github.com/JohnataMoreira/johnatamoreira/commit/c8eb7a9c10416ab66b51cca6838ff65a98715058)

Mensagem:

```text
docs(perfil): registrar Gate 2 aprovado
```

### Pull Request

A PR foi aberta em modo rascunho para impedir merge prematuro:

[PR #1 — feat(perfil): executar PERFIL-001 e preparar Gate 2](https://github.com/JohnataMoreira/johnatamoreira/pull/1)

## 6. Gate 2 autenticado

O `CARDS_TOKEN` não estava disponível como variável local neste Mac. Para não expor, copiar ou inventar credencial, o Gate 2 autenticado foi executado por `workflow_dispatch` no GitHub Actions, usando o secret já configurado no repositório.

Run executado:

[GitHub Actions run 43485358251](https://github.com/JohnataMoreira/johnatamoreira/actions/runs/43485358251)

Resultado:

- `status`: `completed`;
- `conclusion`: `success`;
- branch: `feat/reposicionamento-readme`;
- commit testado: `b54bec5aff7537f49b9f5c3aad32fe8093a7e0da`;
- job `gerar`: `success`;
- etapa de geração autenticada: `success`;
- etapa de publicação na branch `output`: `success`.

A branch `output` recebeu os cards e visuais gerados pelo workflow.

## 7. Estado final

- `main`: intocada, permanecendo no commit `7ebd39bfe286ff1c5630bee21b2f21a2377b0cb5` durante a execução;
- branch de trabalho: implementada e com Gate 2 aprovado;
- PR: aberta em rascunho;
- branch `output`: atualizada pelo workflow autenticado;
- backlog e checkpoint: atualizados;
- merge: não executado.

## 8. Pendência restante — Gate 3

O próximo passo é exclusivamente o Gate 3:

1. revisar o README em desktop;
2. revisar em celular;
3. conferir tema claro;
4. conferir tema escuro;
5. validar visualmente Mishyo, Painel J&JL, gates, tijolos e rodapé;
6. somente depois decidir sobre deixar a PR pronta e fazer o merge.

A `PERFIL-002` continua bloqueada até a conclusão do Gate 3 e do merge da `PERFIL-001`.
