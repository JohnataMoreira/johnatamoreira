import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const projectsRaw = readFileSync("projects.json", "utf8");
const projects = JSON.parse(projectsRaw);
const fingerprint = createHash("sha256").update(projectsRaw).digest("hex").slice(0, 16);
const content = JSON.parse(readFileSync("content.json", "utf8"));
const check = process.argv.includes("--check");
const allowed = [/^https:\/\/johnatamoreira\.com\.br\//, /^https:\/\/www\.linkedin\.com\/(posts|pulse|feed\/update)/];

if (!Array.isArray(projects) || projects.length !== 2 || projects.some((p) => !p.nome || !p.url || !Array.isArray(p.stack))) {
  throw new Error("projects.json deve conter exatamente dois projetos válidos");
}
if (!Array.isArray(content)) throw new Error("content.json deve ser uma lista");
for (const item of content) {
  if (!item.titulo || !item.url || !item.data || !allowed.some((re) => re.test(item.url))) {
    throw new Error(`URL de conteúdo não permitida: ${item.url}`);
  }
}

const links = `[
[Site](https://johnatamoreira.com.br) · [LinkedIn](https://www.linkedin.com/in/eujohnatamoreira) · [Mishyo](https://mishyo.com) · [WhatsApp](https://wa.me/5531975693311) · [E-mail](mailto:contato@johnatamoreira.com.br)
]`;
const projectBlock = (p, lang) => `### ${p.nome}\n**${p.status}**\n\n${lang === "pt" ? p.resumo_pt : p.resumo_en}\n\n${p.stack.map((x) => `\`${x}\``).join(" ")}\n\n[Conhecer →](${p.url})`;
const articles = content.slice().sort((a, b) => String(b.data).localeCompare(String(a.data))).slice(0, 5);
const writing = (lang) => articles.length ? `\n## ${lang === "pt" ? "Escrevo" : "Writing"}\n\n${articles.map((a) => `- [${a.titulo}](${a.url}) — ${a.data}`).join("\n")}\n` : "";

const pt = `<!-- projects-fingerprint:${fingerprint} -->\n<div align="center">\n\n# Johnata Moreira\n\n**Full-stack / Product Engineer**\n\nDesenvolvimento assistido por IA, com gates, prova e auditoria.\n\n${links}\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/header.svg" width="98%" alt="Johnata Moreira — Product Engineer" />\n\n</div>\n\n---\n\n## Quem sou\n\nSou Johnata Moreira, de Belo Horizonte. Construo produtos digitais, orquestro agentes de IA e verifico cada entrega com critérios claros. Minha família e o Instituto Jesus Lindão dão sentido ao trabalho.\n\n## Mishyo\n\n${projectBlock(projects[0], "pt")}\n\n## Painel J&JL\n\n${projectBlock(projects[1], "pt")}\n\n## Como eu trabalho\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/gates.svg" width="98%" alt="Ciclo de gates de desenvolvimento" />\n\nEspecifico antes de executar, mantenho o trabalho em branch, testo contra staging, reviso segurança e só então tomo a decisão humana de publicação. A IA escreve grande parte do código; eu orquestro, verifico e assumo a decisão.\n\n## Instituto Jesus Lindão\n\nUma escola onde nenhuma criança seja excluída por não poder pagar. Um hospital onde a dignidade do atendimento não dependa do saldo na conta.\n\nA meta é um fundo perpétuo de **R$ 2 bilhões**. Cada produto sustentável é um tijolo nessa construção.\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/tijolos.svg" width="98%" alt="Tijolos simbólicos do Instituto Jesus Lindão" />\n\n## Atividade\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/central-comando.svg" width="98%" alt="Atividade de desenvolvimento" />\n\n${writing("pt")}\n\n## Contato\n\n${links}\n\n<div align="center">\n\nConstruindo com propósito, sessão por sessão.\n\n<details><summary>Quando o deploy dá certo</summary><img src="assets/makakoloko.webp" width="180" alt="Macaco comemorando" /></details>\n\n</div>\n`;

const en = `<!-- projects-fingerprint:${fingerprint} -->\n<div align="center">\n\n# Johnata Moreira\n\n**Full-stack / Product Engineer**\n\nAI-assisted development, with gates, evidence and audit.\n\n${links}\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/header.en.svg" width="98%" alt="Johnata Moreira — Product Engineer" />\n\n</div>\n\n---\n\n## About me\n\nI am Johnata Moreira, based in Belo Horizonte, Brazil. I build digital products, orchestrate AI agents and verify every delivery with explicit criteria. My family and Instituto Jesus Lindão give the work its purpose.\n\n## Mishyo\n\n${projectBlock(projects[0], "en")}\n\n## J&JL Dashboard\n\n${projectBlock(projects[1], "en")}\n\n## How I work\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/gates.en.svg" width="98%" alt="Development gate cycle" />\n\nI specify before execution, keep work on a branch, test against staging, review security and only then make the human release decision. AI writes much of the code; I orchestrate, verify and own the decision.\n\n## Instituto Jesus Lindão\n\nA school where no child is excluded for being unable to pay. A hospital where dignity does not depend on a bank balance.\n\nThe goal is a perpetual **R$ 2 billion** fund. Every sustainable product is a brick in that construction.\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/tijolos.en.svg" width="98%" alt="Symbolic bricks for Instituto Jesus Lindão" />\n\n## Activity\n\n<img src="https://raw.githubusercontent.com/JohnataMoreira/johnatamoreira/output/central-comando.svg" width="98%" alt="Development activity" />\n\n${writing("en")}\n\n## Contact\n\n${links}\n\n<div align="center">\n\nBuilding with purpose, one session at a time.\n\n<details><summary>When the deploy works</summary><img src="assets/makakoloko.webp" width="180" alt="Celebrating monkey" /></details>\n\n</div>\n`;

for (const [file, value] of [["README.md", pt], ["README.en.md", en]]) {
  if (check) {
    const current = readFileSync(file, "utf8");
    if (current !== value) throw new Error(`${file} está desatualizado; rode npm run readme`);
  } else writeFileSync(file, value);
}
if (!check) console.log("README.md e README.en.md gerados");
