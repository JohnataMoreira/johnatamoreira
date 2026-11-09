# G1 — PERFIL-001 — Reposicionar o README do perfil (PT + EN), fonte única de projetos e cards próprios
Executor: Antigravity | Worktree: `~/Projetos/Sites e Repos/perfil-github-reposicionamento` | Branch: `feat/reposicionamento-readme` | Máx. iterações: 3
Contexto: `~/Projetos/QG/docs/historico/SESSAO_2026-11-06_reposicionamento_github_e_site.md` (§ 1, 5, 7, 9). Leia antes. Mesma visão do site (tarefa SITE-006, `Site JohnataMoreira/.agents/propostas/G1_SITE-006.md`): use o MESMO vocabulário e os MESMOS fatos.
NÃO faça: push na main, merge, `gh repo edit`, mexer em secrets/token, reescrever histórico. Entrega = branch com commits + prova; o merge é do Claude após Gate 3 do Johnata.

## Objetivo
Perfil honesto e legível em 30 segundos por recrutador/fundador: "Full-stack / Product Engineer (desenvolvimento assistido por IA)", Mishyo em grande destaque, Painel J&JL em segundo. Nada que o Johnata não consiga sustentar em entrevista. Sem dependência de serviço de terceiros para imagens.

## Dados fixos (não inventar outros)
- Nome: Johnata Moreira · 40 anos · Belo Horizonte, MG · família MANTIDA (Carol, Ester, Estevão, Elis, como já está) · **CNPJ NÃO aparece** em lugar nenhum.
- Contato: e-mail `contato@johnatamoreira.com.br` · LinkedIn https://www.linkedin.com/in/eujohnatamoreira · Site https://johnatamoreira.com.br · WhatsApp `https://wa.me/5531975693311` · Telefone +55 31 92006-0816 · Instagram @johnatavinicius (manter).
- Mishyo: https://mishyo.com · em produção desde jun/2026 (~5 meses) · 6 meses de desenvolvimento · +385 mil linhas no repositório (+120 mil de código) · "em breve nas lojas oficiais" · **sem contagem de usuários/famílias**.
- Painel J&JL: https://painel.grupojjl.com.br · atuação como gestor de tráfego · "mais de 15 vendas" · "VGV de mais de R$ 20 milhões" (declaração do Johnata).
- Como foi construído: IA declarada abertamente (Johnata orquestra e verifica; a IA escreve a maior parte do código); EARS, gates, E2E Playwright contra staging, RLS, auditoria cruzada entre modelos (achou uma escalada de privilégio P0, corrigida), decisões registradas. NÃO escrever "arquiteto", "código de alta precisão", "escrevi 120 mil linhas" nem "minha única habilidade é...".
- Só 2 projetos citados: Mishyo e Painel J&JL. FrotaOS, Fieldoc, MeuGuia, InvestImob/CRMimob saem de README, cards e dados (sem linha "Arquivo").
- Instituto Jesus Lindão: seção própria DEPOIS dos projetos (não abre o README); manter a citação e o fundo de R$ 2 bilhões.
- Stack: **conferir antes** em `package.json` de `~/Projetos/apps/Mishyo` e `~/Projetos/apps/Painel J&JL` (e `docs/` deles). Badges só do que é usado de verdade; sai React Native/Flutter/NestJS/Docker/n8n se não constarem. Esperado: TypeScript, Next.js, Supabase, Tailwind, Playwright, Vercel, Cloudflare (+ o que a conferência provar).

## Escopo
1. `projects.json` (raiz): fonte única `[{id, nome, status, url, resumo_pt, resumo_en, stack[], destaque}]` só com Mishyo e Painel. Status do Mishyo: "em lançamento"; do Painel: "em produção". README e cards leem DESTE arquivo; nenhum status escrito à mão em `generate-cards.mjs` (hoje linhas ~276–281).
2. `scripts/render-readme.mjs` gera `README.md` (PT) e `README.en.md` (EN) a partir de `projects.json` + textos no próprio script; `npm run readme` gera, `npm run readme:check` falha (exit 1) se os arquivos commitados estiverem desatualizados. Topo de cada arquivo com troca de idioma (`🇧🇷 Português | 🇺🇸 English`). Ordem: cabeçalho + headline + links (site, LinkedIn, e-mail, Mishyo, WhatsApp) → Quem sou (curto, honesto, bloco TypeScript pode ficar sem produtos mortos) → Mishyo (destaque: o que é, como foi construído, link) → Painel J&JL + tráfego → Como eu trabalho (IA, gates, E2E, RLS, auditoria cruzada) → Instituto Jesus Lindão → Atividade (cards) → Contato → rodapé com `<details>` do macaco ("quando o deploy dá certo"; imagem movida para `assets/makakoloko.webp`; sai da raiz).
3. Cards: `generate-cards.mjs` passa a ler `projects.json`. `cardInstituto` e `cardRanking` mostram só Mishyo e Painel, com nome de exibição (NÃO vazar nome de repo privado). Número de commits: usar o calculado pelo script; remover qualquer "1.800+" e "11 repos privados" fixos do README/typing (texto do README não cita contagem fixa; se citar, vem do `data.json`). Manter `exit(1)` em falha (nunca publicar card quebrado).
4. Substituir TODO serviço de terceiros que serve imagem: capsule-render (header/footer), readme-typing-svg, komarev (contador — remover), github-readme-activity-graph, github-profile-summary-cards. Troque por SVG gerado no workflow (cards em `cards/` -> branch `output`) ou por texto/markdown. Shields.io: pode permanecer só para badges de stack/contato (ou trocar por texto, a seu critério; registrar a escolha).
5. Workflow `.github/workflows/perfil.yml`: fixar TODAS as actions por SHA de commit com comentário da versão (checkout, setup-node, Platane/snk, crazy-max/ghaction-github-pages); manter `permissions: contents: write` mínimo; adicionar passo `npm run readme:check`. NÃO alterar nome do secret (`CARDS_TOKEN`).
6. Higiene: `cards/*.svg` fora da main (adicionar ao `.gitignore` e `git rm --cached`; as imagens do README vêm da branch `output`); `package.json` com `"private": true`; atualizar `.agents/CHECKPOINT.md` e `.agents/BACKLOG.md` (Status + Relatório).
7. Opcional, só se a fonte bastar: `docs/case-estudo-autorizacao.md`, texto sanitizado "como a auditoria cruzada achou e corrigimos uma escalada de privilégio" (fontes: `~/Projetos/apps/Mishyo/security_report.md`, `LESSONS_LEARNED.md`). PROIBIDO incluir segredos, URLs/rotas internas, nomes de tabela/policy, trechos de SQL ou dados. Se não der para sanitizar com segurança, pule e registre no relatório. Linkar do README só se existir.

## Critérios (EARS)
| # | Critério |
|---|---|
| 1 | QUANDO `grep -rn -i -E "cnpj|68\.123|553192006816|5531992116627|FrotaOS|Fieldoc|MeuGuia|InvestImob|CRMimob|n8n|Docker|React Native|capsule-render|komarev|typing-svg|activity-graph|profile-summary|1\.800|única habilidade" README.md README.en.md projects.json scripts .github` rodar, O SISTEMA DEVE retornar 0 linhas (exceto o próprio `projects.json` se citar arquivados: então 0). |
| 2 | TODO link de WhatsApp DEVE ser `https://wa.me/5531975693311`. |
| 3 | `npm run readme:check` DEVE sair 0 após `npm run readme`, e sair 1 se `projects.json` mudar sem regenerar. |
| 4 | `node scripts/generate-cards.mjs` com token válido DEVE gerar 4 SVGs; SEM token DEVE sair 1 sem criar SVG parcial. |
| 5 | Os SVGs NÃO DEVEM conter nome de repo privado nem os 4 projetos removidos (`grep` nos SVGs gerados). |
| 6 | O workflow DEVE ter todas as `uses:` com SHA de 40 caracteres. |
| 7 | `README.md` e `README.en.md` DEVEM ter o mesmo conjunto de seções e os mesmos fatos. |
| 8 | Nenhum número de usuários/famílias do Mishyo DEVE aparecer. |
| 9 | Raiz do repo NÃO DEVE conter `makakoloko.webp` nem `cards/*.svg` rastreado; `git status` limpo no fim; `origin/main` intocada. |

## Armadilhas
- As imagens do README apontam para `raw.githubusercontent.com/.../output/*.svg`: não renomear os arquivos de card sem atualizar os dois READMEs.
- A branch `output` é recriada a cada run (keep_history false): nunca commitar nela à mão.
- Rodar o gerador local exige `GH_TOKEN`; sem token, valide só o critério 4 (sem token) e peça ao Claude a execução com token no Gate 2.
- Não inventar fato; lacuna = escrever sem o dado e listar no relatório.

## Prova exigida (Gate 2)
`git log --oneline origin/main..HEAD`, saída literal do grep (critério 1), saída de `readme:check` (ok e falha provocada), `git diff --stat origin/main`, `grep` dos SVGs (critério 5), lista dos SHAs fixados, `git status`, o que foi pulado e por quê.

## Ações do JOHNATA (o executor não faz)
- Conferir que `CARDS_TOKEN` é fine-grained, só leitura (Contents + Metadata), com validade; se for classic com escopo `repo`, trocar.
- Gate 3: ler os dois READMEs renderizados na branch antes do merge.
