import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// Irei buscar todas as respostas dos CheckLists
export async function GET() {
  try {
    const respostasCheck = await prisma.psq_rsp.findMany({
      select: {
        DtaOpe: true,
        TrnId: true,
        PsqId: true,
        PsqTpoId: true,
        EqpItmId: true,
        PsqPrgId: true,
        PsqRspId: true,
        PsqRsp: true,
        PsqDth: true,
        SttId: true,
        UsrIdAlt: true,
        DtaAlt: true,
      },
      orderBy: {
        PsqPrgId: "asc",
      },
    });

    return NextResponse.json(respostasCheck);
  } catch (error) {
    console.error("Erro ao buscar respostas", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}

// Aqui vai ser para a Data da Operação ser sempre o dia anterior quando for 00h até 4:59h
function ajustarDtaOpe(dta: Date): Date {
  const novaData = new Date(dta);
  const hora = novaData.getHours();

  if (hora >= 0 && hora < 5) {
    novaData.setDate(novaData.getDate() - 1);
  }

  return novaData;
}

// Converte string "YYYY-MM-DD HH:mm:ss" para Date local
function parseDataBrasilia(str: string): Date {
  const [datePart, timePart] = str.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}

type RespostaPayload = {
  UndId: number;
  DtaOpe: string;
  TrnId: number;
  PsqId?: number;
  PsqTpoId?: number;
  BrtId?: number | null;
  EqpItmId?: number | null;
  PsqPrgId: number;
  PsqRsp: number;
  PsqDth?: string;
  SttId?: number;
  UsrIdAlt: number;
  DtaAlt: string;
};

type PayloadBody = {
  respostas: RespostaPayload[];
};

type UploadResponse = {
  success?: boolean;
  url?: string;
  fileUrl?: string;
};

const VPS_UPLOAD_URL = "https://www.checklist.sistemabrtgo.com.br/upload";

async function enviarFotoParaVPS(
  arquivo: File,
  respostaCriada: { PsqRspId: number; DtaOpe: Date; PsqPrgId: number },
): Promise<string> {
  const uploadFormData = new FormData();

  uploadFormData.append("PsqRspId", String(respostaCriada.PsqRspId));
  uploadFormData.append("PsqPrgId", String(respostaCriada.PsqPrgId));
  uploadFormData.append("DtaOpe", respostaCriada.DtaOpe.toISOString());
  uploadFormData.append("foto", arquivo);

  const res = await fetch(VPS_UPLOAD_URL, {
    method: "POST",
    body: uploadFormData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ao enviar foto ${arquivo.name} para a VPS`);
  }

  const data = (await res.json()) as UploadResponse;
  const url = data.url ?? data.fileUrl;

  if (!url) {
    throw new Error(`A VPS não retornou a URL da foto ${arquivo.name}`);
  }

  return url;
}

// Irei criar as respostas dos CheckLists
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let respostas: RespostaPayload[] = [];
    let formData: FormData | null = null;

    if (contentType.includes("application/json")) {
      const body = await request.json();

      // aceita tanto array direto quanto { respostas: [...] }
      if (Array.isArray(body)) {
        respostas = body as RespostaPayload[];
      } else if (body?.respostas && Array.isArray(body.respostas)) {
        respostas = body.respostas as RespostaPayload[];
      } else {
        return new NextResponse("Payload JSON inválido", { status: 400 });
      }
    } else if (contentType.includes("multipart/form-data")) {
      formData = await request.formData();
      const payloadRaw = formData.get("payload");

      if (!payloadRaw || typeof payloadRaw !== "string") {
        return new NextResponse("Payload não enviado", { status: 400 });
      }

      const body = JSON.parse(payloadRaw) as PayloadBody;
      respostas = body?.respostas ?? [];
    } else {
      return new NextResponse(
        'Content-Type deve ser "application/json" ou "multipart/form-data"',
        { status: 415 },
      );
    }

    if (!Array.isArray(respostas) || respostas.length === 0) {
      return new NextResponse("Nenhuma resposta enviada", { status: 400 });
    }

    const respostasCriadas = [];

    for (const r of respostas) {
      const {
        UndId,
        DtaOpe,
        TrnId,
        PsqId,
        PsqTpoId,
        BrtId,
        EqpItmId,
        PsqPrgId,
        PsqRsp,
        PsqDth,
        SttId,
        UsrIdAlt,
        DtaAlt,
      } = r;

      if (!PsqPrgId || PsqRsp === undefined || PsqRsp === null) {
        return new NextResponse("Dados incompletos", { status: 400 });
      }

      let dtaOpeNovo: Date;
      if (DtaOpe) {
        const dtaOpeBody = parseDataBrasilia(DtaOpe);
        dtaOpeNovo = ajustarDtaOpe(dtaOpeBody);
      } else {
        dtaOpeNovo = ajustarDtaOpe(new Date());
      }

      const dtaAltNovo = DtaAlt ? parseDataBrasilia(DtaAlt) : new Date();

      const resposta = await prisma.psq_rsp.create({
        data: {
          UndId,
          DtaOpe: dtaOpeNovo,
          TrnId,
          PsqId: PsqId || 1,
          PsqTpoId: PsqTpoId || 1,
          BrtId: BrtId ?? null,
          EqpItmId: EqpItmId ?? null,
          PsqPrgId,
          PsqRsp,
          PsqDth: PsqDth || "",
          SttId: SttId || 1,
          UsrIdAlt,
          DtaAlt: dtaAltNovo,
        },
      });

      const urlsFotosSalvas: string[] = [];

      // só tenta ler fotos se vier multipart/form-data
      if (formData) {
        const arquivosDaPergunta = formData.getAll(
          `foto_${PsqPrgId}`,
        ) as File[];

        for (const arquivo of arquivosDaPergunta) {
          const urlFoto = await enviarFotoParaVPS(arquivo, {
            PsqRspId: resposta.PsqRspId,
            DtaOpe: dtaOpeNovo,
            PsqPrgId,
          });

          urlsFotosSalvas.push(urlFoto);
        }

        if (urlsFotosSalvas.length > 0) {
          await prisma.psq_rsp_fto.createMany({
            data: urlsFotosSalvas.map((url) => ({
              PsqRspId: resposta.PsqRspId,
              PqsRspFtoUrl: url,
              SttId: 1,
              UsrIdAlt,
              DtaAlt: dtaAltNovo,
              MtvDel: null,
            })),
          });
        }
      }

      respostasCriadas.push({
        ...resposta,
        totalFotosRecebidas: urlsFotosSalvas.length,
        urlsFotosSalvas,
      });
    }

    return NextResponse.json(respostasCriadas, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao salvar resposta:", error);
      return new NextResponse(
        JSON.stringify({ message: error.message, stack: error.stack }),
        { status: 500 },
      );
    }

    console.error("Erro desconhecido:", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
