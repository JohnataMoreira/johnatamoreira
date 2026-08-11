// ============================================================
// GERADOR DE CARDS SVG — Perfil GitHub Johnata Moreira
// Lê repos privados via token, gera cards animados temáticos J&JL.
// Roda no GitHub Actions; publica SVGs na branch `output`.
// ============================================================

import { writeFileSync, mkdirSync } from "node:fs";

const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const USER = "JohnataMoreira";

// --- Paleta da marca J&JL ---
const C = {
  ink: "#0D1117",       // fundo
  ink2: "#161B22",      // fundo card
  terra: "#F27321",     // terracota J&JL (assinatura)
  terraDeep: "#C45A10", // terracota escuro
  navy: "#1A3D6E",      // azul institucional
  cream: "#FAFAF8",     // texto claro
  mute: "#8B949E",      // texto secundário
  line: "#21262D",      // linhas/grid
  green: "#25D366",     // produção
  gold: "#FFD700",      // legado/instituto
};

// --- Chamada à API GitHub (autenticada, enxerga privados) ---
async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "johnata-profile-cards",
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} em ${path}`);
  return res.json();
}

// Conta commits reais de um repo (via paginação do header Link)
async function countCommits(repo) {
  const res = await fetch(
    `https://api.github.com/repos/${USER}/${repo}/commits?per_page=1`,
    {
      headers: {
        Authorization: `token ${TOKEN}`,
        "User-Agent": "johnata-profile-cards",
      },
    }
  );
  if (!res.ok) return 0;
  const link = res.headers.get("link") || "";
  const m = link.match(/page=(\d+)>; rel="last"/);
  return m ? parseInt(m[1], 10) : 1;
}

// Escapa texto para SVG
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ============================================================
// COLETA DE DADOS REAIS
// ============================================================
async function collectData() {
  const repos = await gh(`/user/repos?per_page=100&affiliation=owner`);
  const langs = {};
  let privateCount = 0;
  for (const r of repos) {
    if (r.private) privateCount++;
    if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
  }

  // Commits reais (só nos repos de produto/governança, ignora forks)
  const coreRepos = repos.filter((r) => !r.fork).map((r) => r.name);
  let totalCommits = 0;
  const perRepo = [];
  for (const name of coreRepos) {
    const c = await countCommits(name);
    totalCommits += c;
    perRepo.push({ name, commits: c });
  }
  perRepo.sort((a, b) => b.commits - a.commits);

  const langTotal = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
  const langList = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => ({ name, pct: Math.round((n / langTotal) * 100) }));

  return {
    totalRepos: repos.length,
    privateCount,
    publicCount: repos.length - privateCount,
    totalCommits,
    perRepo,
    langList,
    topRepos: perRepo.slice(0, 5),
  };
}

// ============================================================
// CARD 1 — "CENTRAL DE COMANDO" (stats reais animados)
// Substitui o github-readme-stats quebrado. Mostra números REAIS.
// ============================================================
function cardStats(d) {
  const W = 840, H = 260;
  // animação de contagem: usamos <animate> em SVG nativo (funciona no GitHub)
  const bigNum = (x, y, val, label, color, delay) => `
    <g transform="translate(${x},${y})">
      <text x="0" y="0" font-family="'Segoe UI',system-ui,sans-serif" font-size="42"
            font-weight="800" fill="${color}" opacity="0">
        ${esc(val)}
        <animate attributeName="opacity" from="0" to="1" dur="0.8s"
                 begin="${delay}s" fill="freeze"/>
        <animateTransform attributeName="transform" type="translate"
                 from="0 12" to="0 0" dur="0.8s" begin="${delay}s" fill="freeze"/>
      </text>
      <text x="2" y="26" font-family="'Segoe UI',system-ui,sans-serif" font-size="13"
            font-weight="500" fill="${C.mute}" letter-spacing="1.5" opacity="0">
        ${esc(label)}
        <animate attributeName="opacity" from="0" to="1" dur="0.8s"
                 begin="${delay + 0.15}s" fill="freeze"/>
      </text>
    </g>`;

  // barra de linguagens
  let lx = 40;
  const langBar = d.langList
    .map((l) => {
      const w = (l.pct / 100) * (W - 80);
      const colors = { TypeScript: "#3178C6", JavaScript: "#F7DF1E", Dart: "#02569B" };
      const seg = `<rect x="${lx}" y="200" width="${w}" height="10" rx="2"
        fill="${colors[l.name] || C.terra}" opacity="0">
        <animate attributeName="opacity" from="0" to="0.95" dur="0.6s" begin="1.4s" fill="freeze"/>
        <animate attributeName="width" from="0" to="${w}" dur="0.9s" begin="1.4s" fill="freeze"/>
      </rect>`;
      lx += w + 3;
      return seg;
    })
    .join("");

  const langLabels = d.langList
    .map((l, i) => `<tspan fill="${C.mute}">${esc(l.name)} ${l.pct}%</tspan>${i < d.langList.length - 1 ? '<tspan fill="#30363D">  •  </tspan>' : ""}`)
    .join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy}"/>
      <stop offset="0.5" stop-color="${C.terra}"/>
      <stop offset="1" stop-color="${C.terraDeep}"/>
    </linearGradient>
    <linearGradient id="gGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.terra}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${C.terra}" stop-opacity="0.6"/>
      <stop offset="1" stop-color="${C.terra}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="14"
        fill="${C.ink2}" stroke="url(#gStroke)" stroke-width="2"/>
  <!-- linha superior animada -->
  <rect x="20" y="14" width="${W - 40}" height="2" fill="url(#gGlow)">
    <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
  </rect>
  <!-- título -->
  <text x="40" y="52" font-family="'Segoe UI',system-ui,sans-serif" font-size="20"
        font-weight="800" fill="${C.cream}">Central de Comando
    <tspan fill="${C.terra}"> · dados reais</tspan></text>
  <text x="40" y="72" font-family="'Segoe UI',system-ui,sans-serif" font-size="12"
        fill="${C.mute}">Inclui 11 repositórios privados que serviços públicos não enxergam</text>

  ${bigNum(40, 130, d.totalCommits.toLocaleString("pt-BR"), "COMMITS REAIS", C.terra, 0.2)}
  ${bigNum(240, 130, d.totalRepos, "REPOSITÓRIOS", C.cream, 0.4)}
  ${bigNum(410, 130, d.privateCount, "PRIVADOS", C.navy === "#1A3D6E" ? "#4A86E8" : C.navy, 0.6)}
  ${bigNum(560, 130, d.langList.length, "LINGUAGENS", C.green, 0.8)}
  ${bigNum(700, 130, "6", "PRODUTOS", C.gold, 1.0)}

  <!-- barra de linguagens -->
  <rect x="40" y="200" width="${W - 80}" height="10" rx="2" fill="${C.line}"/>
  ${langBar}
  <text x="40" y="232" font-family="'Segoe UI',system-ui,sans-serif" font-size="12">
    ${langLabels}
  </text>
</svg>`;
}

// ============================================================
// CARD 2 — "INSTITUTO JESUS LINDÃO" (narrativa + progresso)
// O diferencial: um card que conta a MISSÃO, não só código.
// ============================================================
function cardInstituto(d) {
  const W = 840, H = 220;
  const META = 2_000_000_000; // R$ 2 bilhões

  // "Tijolos" = produtos construídos. Cada produto é um passo rumo ao fundo.
  const tijolos = [
    { nome: "FrotaOS", status: "validação" },
    { nome: "Mishyo", status: "pausa" },
    { nome: "Fieldoc", status: "gate" },
    { nome: "InvestImob", status: "produção" },
    { nome: "Painel JM", status: "produção" },
    { nome: "MeuGuia", status: "dev" },
  ];

  const bricks = tijolos
    .map((t, i) => {
      const x = 40 + i * 130;
      const on = t.status === "produção";
      return `
      <g transform="translate(${x},120)">
        <rect x="0" y="0" width="118" height="42" rx="6"
              fill="${on ? C.terra : C.ink}" stroke="${on ? C.terraDeep : C.line}"
              stroke-width="1.5" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.5s"
                   begin="${0.6 + i * 0.12}s" fill="freeze"/>
          <animateTransform attributeName="transform" type="translate"
                   from="0 8" to="0 0" dur="0.5s" begin="${0.6 + i * 0.12}s" fill="freeze"/>
        </rect>
        <text x="59" y="19" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif"
              font-size="12" font-weight="700" fill="${on ? "#fff" : C.cream}" opacity="0">
          ${esc(t.nome)}
          <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${0.8 + i * 0.12}s" fill="freeze"/>
        </text>
        <text x="59" y="33" text-anchor="middle" font-family="'Segoe UI',system-ui,sans-serif"
              font-size="9" fill="${on ? "#ffe" : C.mute}" letter-spacing="0.5" opacity="0">
          ${esc(t.status.toUpperCase())}
          <animate attributeName="opacity" from="0" to="0.85" dur="0.5s" begin="${0.8 + i * 0.12}s" fill="freeze"/>
        </text>
      </g>`;
    })
    .join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gInst" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.navy}"/>
      <stop offset="1" stop-color="${C.terra}"/>
    </linearGradient>
    <radialGradient id="gHalo" cx="0.5" cy="0.4" r="0.8">
      <stop offset="0" stop-color="${C.gold}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="14"
        fill="${C.ink2}" stroke="url(#gInst)" stroke-width="2"/>
  <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="13" fill="url(#gHalo)"/>

  <!-- título -->
  <text x="40" y="48" font-family="Georgia,serif" font-size="22" font-weight="700" fill="${C.gold}">
    ⛪ Instituto Jesus Lindão</text>
  <text x="40" y="74" font-family="Georgia,serif" font-size="13" font-style="italic" fill="${C.mute}">
    "Uma escola onde nenhuma criança é excluída. Um hospital onde a dignidade não depende do saldo."</text>

  <!-- meta -->
  <text x="${W - 40}" y="48" text-anchor="end" font-family="'Segoe UI',system-ui,sans-serif"
        font-size="13" fill="${C.mute}">FUNDO PERPÉTUO · META</text>
  <text x="${W - 40}" y="74" text-anchor="end" font-family="'Segoe UI',system-ui,sans-serif"
        font-size="22" font-weight="800" fill="${C.gold}">R$ 2 bilhões</text>

  <!-- legenda tijolos -->
  <text x="40" y="105" font-family="'Segoe UI',system-ui,sans-serif" font-size="12"
        fill="${C.cream}">Cada produto é um tijolo no fundo
    <tspan fill="${C.terra}"> — ${d.totalCommits.toLocaleString("pt-BR")} commits construindo isso</tspan></text>

  ${bricks}

  <!-- linha de base pulsante -->
  <rect x="40" y="178" width="${W - 80}" height="2" rx="1" fill="${C.line}"/>
  <rect x="40" y="178" width="200" height="2" rx="1" fill="${C.terra}">
    <animate attributeName="width" values="0;200" dur="1.5s" begin="1.6s" fill="freeze"/>
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" begin="3s" repeatCount="indefinite"/>
  </rect>
  <text x="40" y="198" font-family="'Segoe UI',system-ui,sans-serif" font-size="10"
        fill="${C.mute}">O fundo pertence à fundação. Não tem dono. Tem uma missão.</text>
</svg>`;
}

// ============================================================
// CARD 3 — "RANKING DE PROJETOS" (top repos por commits reais)
// ============================================================
function cardRanking(d) {
  const W = 840, H = 240;
  const max = d.topRepos[0]?.commits || 1;
  const nice = { "qg-empresa": "Central de Comando (QG)", trafego: "Painel Tráfego JM",
    Mishyo: "Mishyo", FrotaOS: "FrotaOS", investimob: "InvestImob" };

  const rows = d.topRepos
    .map((r, i) => {
      const y = 78 + i * 32;
      const w = (r.commits / max) * (W - 340);
      return `
      <g transform="translate(40,${y})">
        <text x="0" y="0" font-family="'Segoe UI',system-ui,sans-serif" font-size="13"
              font-weight="600" fill="${C.cream}">${esc(nice[r.name] || r.name)}</text>
        <rect x="200" y="-12" width="${W - 340}" height="14" rx="3" fill="${C.line}"/>
        <rect x="200" y="-12" width="0" height="14" rx="3" fill="${C.terra}">
          <animate attributeName="width" from="0" to="${w}" dur="0.9s"
                   begin="${0.3 + i * 0.15}s" fill="freeze"/>
        </rect>
        <text x="${W - 90}" y="0" font-family="'Segoe UI',system-ui,sans-serif" font-size="13"
              font-weight="700" fill="${C.terra}" opacity="0">${r.commits.toLocaleString("pt-BR")} commits
          <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${0.6 + i * 0.15}s" fill="freeze"/>
        </text>
      </g>`;
    })
    .join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gRank" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.terra}"/>
      <stop offset="1" stop-color="${C.navy}"/>
    </linearGradient>
  </defs>
  <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="14"
        fill="${C.ink2}" stroke="url(#gRank)" stroke-width="2"/>
  <text x="40" y="48" font-family="'Segoe UI',system-ui,sans-serif" font-size="20"
        font-weight="800" fill="${C.cream}">Onde a energia foi</text>
  <text x="40" y="66" font-family="'Segoe UI',system-ui,sans-serif" font-size="12"
        fill="${C.mute}">Top 5 projetos por commits reais — o trabalho que não aparece nos rankings públicos</text>
  ${rows}
</svg>`;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  if (!TOKEN) {
    console.error("ERRO: defina GH_TOKEN ou GITHUB_TOKEN");
    process.exit(1);
  }
  console.log("Coletando dados reais dos repositórios...");
  const d = await collectData();
  console.log(`  ${d.totalCommits} commits · ${d.totalRepos} repos · ${d.privateCount} privados`);

  mkdirSync("cards", { recursive: true });
  writeFileSync("cards/central-comando.svg", cardStats(d));
  writeFileSync("cards/instituto.svg", cardInstituto(d));
  writeFileSync("cards/ranking.svg", cardRanking(d));

  // snapshot JSON (para debug / futuro uso)
  writeFileSync("cards/data.json", JSON.stringify(d, null, 2));
  console.log("Cards gerados em cards/ ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
