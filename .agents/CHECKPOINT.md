# CHECKPOINT — perfil-github (README do perfil JohnataMoreira + gerador de cards)
> Atualizado: 09/11/2026 (Claude, Desktop). Teto ~200 linhas.
## Estado
- main: hotfix `44664fe` (WhatsApp 5531975693311 correto; CNPJ removido do README). Resto do README/cards/workflow ainda no formato antigo (FrotaOS, Docker, n8n, serviços de terceiros).
- PERFIL-001 (Gate 1 despachado, **AGUARDANDO o Johnata acionar o Antigravity**): `.agents/propostas/G1_PERFIL-001.md`, branch `feat/reposicionamento-readme`, worktree `../perfil-github-reposicionamento`. Regista README PT+EN, `projects.json`, cards próprios, actions por SHA.
- Contexto/decisões: `~/Projetos/QG/docs/historico/SESSAO_2026-11-06_reposicionamento_github_e_site.md`.
## Pendências do Johnata
- Acionar o Antigravity; conferir que `CARDS_TOKEN` é fine-grained (Contents + Metadata, só leitura, com validade); Gate 3 lendo os READMEs renderizados.
## Pós-merge (Claude)
- `gh repo edit` (description, topics, homepage); remover `.webp` solto; repo-vitrine público só com gitleaks + licença restritiva (tarefa futura).

## Atualizacao 12/11/2026 (sessao Estrategista)
- **Token:** `CARDS_TOKEN` agora e fine-grained (Contents+Metadata, leitura, 90 dias, vence ~10/02/2027). Workflow verde em 12/11. Classic `Antigravity`, PAT `n8n` e app Dokploy removidos pelo Johnata. Pendente: substituir classic `antigravity-ide` e `claude-desktop` por tokens minimos com validade.
- **Visual aprovado pelo Johnata e validado no GitHub (desktop e celular):** ciclo de gates animado, tijolos do Instituto (1 tijolo = 40 commits, sem % de progresso, legenda "simbolo"), cabecalho com tijolos. Prototipos no branch `feat/reposicionamento-readme` (`assets/prototipos/`, `PROTOTIPO.md`), gerados por `/tmp/proto/*.py` (descartavel; o PERFIL-001 reescreve em Node).
- **Dado desatualizado:** README publico diz "1.800+ commits"; real = 6.471 (run de 12/11). O gerador deve ler o total, nunca fixar.
- **Proximo:** Johnata avalia o cabecalho; depois revisar G1_PERFIL-001 incluindo esses 3 visuais e despachar ao Antigravity. Ideias de 2a fase: auditoria cruzada (timeline), quando eu construo (horas dos commits), Mishyo no ar, ultimos artigos.
