import { mkdirSync, writeFileSync } from "node:fs";
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) { console.error("ERRO: defina GH_TOKEN ou GITHUB_TOKEN"); process.exit(1); }
const user = "JohnataMoreira";
const projects = ["Mishyo", "qg-empresa"];
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
async function commits(repo) { const r = await fetch(`https://api.github.com/repos/${user}/${repo}/commits?per_page=1`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "profile-generator" } }); if (!r.ok) throw new Error(`GitHub ${r.status}`); const link = r.headers.get("link") || ""; const last = link.match(/page=(\d+)>; rel="last"/); return last ? Number(last[1]) : 1; }
const data = { totalCommits: 0, projects: [] };
for (const repo of projects) { const count = await commits(repo); data.totalCommits += count; data.projects.push({ name: repo === "qg-empresa" ? "Painel J&JL" : "Mishyo", commits: count }); }
const svg = (title, body, height = 220) => `<svg role="img" aria-label="${esc(title)}" width="840" height="${height}" viewBox="0 0 840 ${height}" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:'Segoe UI',system-ui,sans-serif}.muted{fill:#8B949E}.cream{fill:#FAFAF8}.terra{fill:#F27321}.navy{fill:#4A86E8}</style><rect width="840" height="${height}" rx="16" fill="#161B22" stroke="#F27321" stroke-width="2"/><text x="40" y="48" font-size="22" font-weight="800" class="cream">${esc(title)}</text>${body}</svg>`;
mkdirSync("cards", { recursive: true });
writeFileSync("cards/central-comando.svg", svg("Central de atividade", `<text x="40" y="105" font-size="48" font-weight="800" class="terra">${data.totalCommits}</text><text x="40" y="132" font-size="13" class="muted">COMMITS OBSERVADOS</text><text x="300" y="105" font-size="32" font-weight="800" class="navy">2</text><text x="300" y="132" font-size="13" class="muted">PROJETOS EM FOCO</text><rect x="40" y="175" width="760" height="10" rx="5" fill="#21262D"/><rect x="40" y="175" width="280" height="10" rx="5" fill="#F27321"><animate attributeName="width" from="0" to="280" dur="1s" fill="freeze"/></rect>`, 220));
writeFileSync("cards/instituto.svg", svg("Instituto Jesus Lindão", `<text x="40" y="92" font-size="15" class="muted">Cada produto sustentável é um tijolo.</text><text x="40" y="142" font-size="30" font-weight="800" class="terra">R$ 2 bilhões</text><text x="40" y="174" font-size="12" class="muted">fundo perpétuo · símbolo de propósito</text>`, 220));
const rows = data.projects.map((p, i) => `<text x="40" y="${105 + i * 48}" font-size="16" font-weight="700" class="cream">${esc(p.name)}</text><rect x="210" y="${90 + i * 48}" width="560" height="18" rx="9" fill="#21262D"/><rect x="210" y="${90 + i * 48}" width="${Math.max(32, p.commits * 40)}" height="18" rx="9" fill="#F27321"/><text x="790" y="${105 + i * 48}" text-anchor="end" font-size="13" class="terra">${p.commits}</text>`).join("");
writeFileSync("cards/ranking.svg", svg("Projetos em foco", rows, 220));
writeFileSync("cards/sequencia.svg", svg("Ritmo de construção", `<text x="40" y="105" font-size="44" font-weight="800" class="terra">${data.totalCommits}</text><text x="40" y="135" font-size="13" class="muted">commits que deixam o trabalho verificável</text>`, 220));
writeFileSync("cards/data.json", JSON.stringify(data, null, 2));
console.log(JSON.stringify(data));
