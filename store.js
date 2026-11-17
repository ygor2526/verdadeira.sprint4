// SPRINT 04 --------

import { mkdir, readFile, writeFile } from "node:fs/promises";

const pasta = new URL("../data/", import.meta.url);
const arquivo = new URL("../data/mensagens.json", import.meta.url);

export async function lerMensagens() {
  try {
    const conteudo = await readFile(arquivo, "utf8");
    const dados = JSON.parse(conteudo);
    if (!Array.isArray(dados)) throw new Error("O JSON precisa conter um array.");
    return dados;
  } catch (erro) {
    if (erro.code === "ENOENT") return [];
    throw erro; // outros erros não podem ser silenciados
  }
}

export async function salvarMensagens(mensagens) {
  await mkdir(pasta, { recursive: true });
  await writeFile(arquivo, JSON.stringify(mensagens, null, 2), "utf8");
}
