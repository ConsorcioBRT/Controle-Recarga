export const runtime = "nodejs";

import { NextResponse } from "next/server";
import ftp from "basic-ftp";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const recargaId = formData.get("recargaId");
    const undId = formData.get("undId");
    const vclId = formData.get("vclId");
    const dtaIni = formData.get("dtaIni"); // yyyy-mm-dd ou similar

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    //Irá converter para Buffer
    const bytes = await file.arrayBuffer();
    const buffer: Buffer = Buffer.from(bytes);

    // Conecta no FTP
    const client = new ftp.Client();
    client.ftp.verbose = true;

    await client.access({
      host: "brtgo.com.br",
      user: "recarga@brtgo.com.br",
      password: "Br7&Rm7c",
      secure: false,
    });

    // Cria stream a partir do buffer
    const stream = Readable.from(buffer);

    // Sobe o arquivo
    const filename = `recarga_${recargaId}_und_${undId}_vcl_${vclId}_${dtaIni}.jpg`;
    await client.uploadFrom(stream, filename);

    // Fecha a conexão
    client.close();

    // URL pública do arquivo
    const publicUrl = `https://brtgo.com.br/recarga/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    return NextResponse.json(
      { error: "Erro ao enviar foto", details: String(error) },
      { status: 500 }
    );
  }
}
