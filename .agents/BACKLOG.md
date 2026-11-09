# BACKLOG — perfil-github
> NORMA: só tarefas ABERTAS, teto ~400. Toda tarefa com **Status:**. Concluída (Gate 3) -> .agents/historico/. Claude adiciona; executor só muda Status e Relatório.

---


---

## PERFIL-001 — Reposicionar README do perfil (PT+EN), projects.json e cards proprios

**Status:** PENDENTE
**Max iterações:** 3
**Adicionada:** 2026-11-09 (via qg-comando)

### Contexto
Despacho completo em .agents/propostas/G1_PERFIL-001.md (worktree ../perfil-github-reposicionamento, branch feat/reposicionamento-readme). Mesma visão do site (SITE-006): Product Engineer com IA declarada, só Mishyo (destaque) e Painel J&JL, CNPJ fora, projects.json como fonte única, README PT+EN, cards próprios sem serviços de terceiros, workflow com actions fixadas por SHA. Sem push na main nem merge.

### Arquivos de Entrada
- README.md
- scripts/generate-cards.mjs
- .github/workflows/perfil.yml
- package.json
- makakoloko.webp
- .agents/propostas/G1_PERFIL-001.md

### Arquivos de Saída
- projects.json
- scripts/render-readme.mjs
- README.md
- README.en.md
- scripts/generate-cards.mjs
- .github/workflows/perfil.yml
- assets/makakoloko.webp
- .gitignore
- package.json
- .agents/CHECKPOINT.md

### Critérios de aceite (EARS)

| # | Tipo | Critério |
|---|------|----------|
| 1 | Resultado | QUANDO o grep de termos proibidos (CNPJ, numeros antigos, projetos removidos, Docker/n8n/React Native, servicos de terceiros) rodar nos READMEs, projects.json, scripts e workflow, O SISTEMA DEVE retornar 0 linhas |
| 2 | Resultado | TODO link de WhatsApp DEVE ser https://wa.me/5531975693311 |
| 3 | Resultado | npm run readme:check DEVE sair 0 apos npm run readme e sair 1 se projects.json mudar sem regenerar |
| 4 | Resultado | SEM GH_TOKEN, generate-cards.mjs DEVE sair 1 sem criar SVG parcial |
| 5 | Resultado | Os SVGs NAO DEVEM conter nome de repo privado nem projetos removidos |
| 6 | Resultado | TODAS as uses do workflow DEVEM ter SHA de 40 caracteres |
| 7 | Resultado | README.md e README.en.md DEVEM ter as mesmas secoes e fatos; nenhum numero de usuarios do Mishyo |
| 8 | Resultado | git status limpo; makakoloko.webp fora da raiz; origin/main intocada |

### Armadilhas conhecidas
- (nenhum)

### LESSONS_LEARNED consultadas
- (nenhum)

### Relatório do Antigravity (preencher ao concluir)

> Status final:
> Commits:
> Critérios EARS validados:
> Arquivos fora da lista de saída tocados:
> Divergências:
> Lição nova:
