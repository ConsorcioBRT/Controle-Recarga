"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Camera, CheckCircle } from "lucide-react";

type Tipo = { PsqTpoId: number; PsqTpo: string };

type Pergunta = {
  PsqTpoId: number;
  PsqPrgId: number;
  Pergunta: string;
  Sequencia?: number;
};

type EixoAPI = {
  BrtId: number;
  BrtNme: string;
};

type EletropostoAPI = { UndId: number; PostoRecarga: string };
type VeiculoAPI = { EqpItmId: number; Onibus: string; UndId: number };
type CarregadorAPI = { UndId: number; EqpItmId: number; Carregador: string };

type RespostaWizard = {
  PsqPrgId: number;
  resposta: "SIM" | "NAO" | null;
  justificativa: string;
};

type Step =
  | "ASSUNTO"
  | "LINHA"
  | "ELETROPOSTO"
  | "CARREGADOR"
  | "VEICULO"
  | "PERGUNTAS"
  | "CONCLUIDO";

function formatarDataLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
}

// tenta extrair número do texto (ex: "Ônibus 012" -> 12). Se não achar, retorna null.
function extrairNumero(str: string): number | null {
  const m = (str ?? "").match(/\d+/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

export default function Checklist2Fluxos() {
  // ====== TIPOS ======
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [tipoId, setTipoId] = useState<string>("");

  const ID_ELETROPOSTO = 1; // ajuste se necessário
  const ID_VEICULO = 2; // ajuste se necessário

  const assunto = useMemo(() => {
    const id = Number(tipoId);
    if (id === ID_ELETROPOSTO) return "ELETROPOSTO" as const;
    if (id === ID_VEICULO) return "VEICULO" as const;
    return "" as const;
  }, [tipoId]);

  // ====== LINHAS ======
  const [eixos, setEixos] = useState<EixoAPI[]>([]);
  const [loadingEixos, setLoadingEixos] = useState(false);
  const [eixoId, setEixoId] = useState<string>("");

  const eixoSelecionada = useMemo(
    () => eixos.find((l) => String(l.BrtId) === eixoId) ?? null,
    [eixos, eixoId],
  );

  // ====== PERGUNTAS ======
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loadingPerguntas, setLoadingPerguntas] = useState(false);

  // ====== ELETROPOSTO ======
  const [eletropostos, setEletropostos] = useState<EletropostoAPI[]>([]);
  const [loadingEletro, setLoadingEletro] = useState(false);
  const [undId, setUndId] = useState<string>("");

  const eletroSelecionado = useMemo(
    () => eletropostos.find((e) => String(e.UndId) === undId) ?? null,
    [eletropostos, undId],
  );

  // ====== CARREGADORES ======
  const [carregadores, setCarregadores] = useState<CarregadorAPI[]>([]);
  const [loadingCarregadores, setLoadingCarregadores] = useState(false);
  const [carregadorId, setCarregadorId] = useState<string>("");

  const carregadorSelecionado = useMemo(
    () => carregadores.find((c) => String(c.EqpItmId) === carregadorId) ?? null,
    [carregadores, carregadorId],
  );

  // ====== VEICULO (Select = todos | Botões = filtrados pelo eletroposto do login) ======
  const [postoSelecionado, setPostoSelecionado] = useState<number | null>(null);

  useEffect(() => {
    try {
      const eletro = localStorage.getItem("eletropostoSelecionado");
      setPostoSelecionado(eletro ? JSON.parse(eletro).UndId : null);
    } catch {
      setPostoSelecionado(null);
    }
  }, []);

  const temEletroNoLogin = Boolean(postoSelecionado);

  const [todosVeiculos, setTodosVeiculos] = useState<VeiculoAPI[]>([]);
  const [veiculosRecentes, setVeiculosRecentes] = useState<VeiculoAPI[]>([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);
  const [eqpItmId, setEqpItmId] = useState<string>("");

  const [veiculosSelecionados, setVeiculosSelecionados] = useState<
    VeiculoAPI[]
  >([]);

  const veiculoSelecionado = useMemo(
    () => todosVeiculos.find((v) => String(v.EqpItmId) === eqpItmId) ?? null,
    [todosVeiculos, eqpItmId],
  );

  function ordenarVeiculos(arrIn: VeiculoAPI[]) {
    const arr = [...arrIn];
    arr.sort((a, b) => {
      const na = extrairNumero(a.Onibus);
      const nb = extrairNumero(b.Onibus);
      if (na !== null && nb !== null) return na - nb;
      if (na !== null && nb === null) return -1;
      if (na === null && nb !== null) return 1;
      return (a.Onibus ?? "").localeCompare(b.Onibus ?? "", "pt-BR", {
        numeric: true,
        sensitivity: "base",
      });
    });
    return arr;
  }

  const todosVeiculosOrdenados = useMemo(
    () => ordenarVeiculos(todosVeiculos),
    [todosVeiculos],
  );

  const veiculosRecentesOrdenados = useMemo(
    () => ordenarVeiculos(veiculosRecentes),
    [veiculosRecentes],
  );

  const veiculosSelecionadosOrdenados = useMemo(
    () => ordenarVeiculos(veiculosSelecionados),
    [veiculosSelecionados],
  );

  function addVeiculoSelecionado(v: VeiculoAPI) {
    setVeiculosSelecionados((prev) => {
      const existe = prev.some((x) => x.EqpItmId === v.EqpItmId);
      if (existe) return prev;
      return [...prev, v];
    });
  }

  function removerVeiculoSelecionado(eqpId: number) {
    setVeiculosSelecionados((prev) => prev.filter((x) => x.EqpItmId !== eqpId));
    setEqpItmId((prevId) => {
      const n = Number(prevId);
      return n === eqpId ? "" : prevId;
    });
  }

  // ====== WIZARD ======
  const [step, setStep] = useState<Step>("ASSUNTO");
  const [qIndex, setQIndex] = useState<number>(0);
  const [respostas, setRespostas] = useState<RespostaWizard[]>([]);
  const [fotosPorPergunta, setFotosPorPergunta] = useState<
    Record<number, File[]>
  >({});
  const [sending, setSending] = useState(false);

  const perguntaAtual = useMemo(() => {
    if (!perguntas.length) return null;
    return perguntas[qIndex] ?? null;
  }, [perguntas, qIndex]);

  const respostaAtual = useMemo(() => {
    if (!perguntaAtual) return null;
    return respostas.find((r) => r.PsqPrgId === perguntaAtual.PsqPrgId) ?? null;
  }, [respostas, perguntaAtual]);

  const podeIrProximoPergunta = useMemo(() => {
    if (!perguntaAtual) return false;
    const r = respostaAtual;
    if (!r?.resposta) return false;
    if (r.resposta === "SIM") return true;
    return r.justificativa.trim().length > 0;
  }, [perguntaAtual, respostaAtual]);

  const ehUltimaPergunta = useMemo(() => {
    if (!perguntas.length) return false;
    return qIndex === perguntas.length - 1;
  }, [perguntas.length, qIndex]);

  // ====== LOAD TIPOS ======
  useEffect(() => {
    (async () => {
      setLoadingTipos(true);
      try {
        const res = await fetch("/api/checklistTipos");
        if (!res.ok) throw new Error("Erro ao buscar tipos");
        const data: Tipo[] = await res.json();
        setTipos(data);
      } catch (e) {
        console.error(e);
        setTipos([]);
      } finally {
        setLoadingTipos(false);
      }
    })();
  }, []);

  // ====== LOAD LINHAS ======
  useEffect(() => {
    (async () => {
      setLoadingEixos(true);
      try {
        const res = await fetch("/api/eixo");
        if (!res.ok) throw new Error("Erro ao buscar eixos");
        const data: EixoAPI[] = await res.json();

        setEixos(data);
      } catch (e) {
        console.error(e);
        setEixos([]);
      } finally {
        setLoadingEixos(false);
      }
    })();
  }, []);

  // ====== quando escolher TIPO: buscar perguntas + reset fluxo ======
  useEffect(() => {
    if (!tipoId) {
      setPerguntas([]);
      setRespostas([]);
      setQIndex(0);

      setEixoId("");

      setUndId("");
      setCarregadores([]);
      setCarregadorId("");

      setEqpItmId("");
      setVeiculosSelecionados([]);

      setStep("ASSUNTO");
      return;
    }

    (async () => {
      setLoadingPerguntas(true);
      try {
        const res = await fetch(`/api/checklistPerguntas?PsqTpoId=${tipoId}`);
        if (!res.ok) throw new Error("Erro ao buscar perguntas");
        const data: Pergunta[] = await res.json();

        data.sort((a, b) => a.PsqPrgId - b.PsqPrgId);
        setPerguntas(data);

        setRespostas([]);
        setQIndex(0);

        setEixoId("");

        setUndId("");
        setCarregadores([]);
        setCarregadorId("");

        setEqpItmId("");
        setVeiculosSelecionados([]);

        setStep("ASSUNTO");
      } catch (e) {
        console.error(e);
        setPerguntas([]);
      } finally {
        setLoadingPerguntas(false);
      }
    })();
  }, [tipoId]);

  // ====== carregar eletropostos quando assunto = ELETROPOSTO ======
  useEffect(() => {
    if (assunto !== "ELETROPOSTO") return;

    (async () => {
      setLoadingEletro(true);
      try {
        const res = await fetch("/api/eletroposto");
        if (!res.ok) throw new Error("Erro ao buscar eletropostos");
        const data: EletropostoAPI[] = await res.json();
        setEletropostos(data);
      } catch (e) {
        console.error(e);
        setEletropostos([]);
      } finally {
        setLoadingEletro(false);
      }
    })();
  }, [assunto]);

  // Se entrar em CARREGADOR sem undId, tenta preencher pelo login
  useEffect(() => {
    if (step !== "CARREGADOR") return;
    if (undId) return;
    if (!postoSelecionado) return;

    setUndId(String(postoSelecionado));
  }, [step, undId, postoSelecionado]);

  // Carregar carregadores quando estiver no passo CARREGADOR e tiver undId
  useEffect(() => {
    if (step !== "CARREGADOR") return;
    if (!undId) return;

    (async () => {
      setLoadingCarregadores(true);
      try {
        const res = await fetch(`/api/carregadores?undId=${undId}`);
        if (!res.ok) throw new Error("Erro ao buscar carregadores");
        const data: CarregadorAPI[] = await res.json();
        setCarregadores((data ?? []).filter((c) => c && c.EqpItmId != null));
      } catch (e) {
        console.error(e);
        setCarregadores([]);
      } finally {
        setLoadingCarregadores(false);
      }
    })();
  }, [step, undId]);

  // quando muda eletroposto (undId), reset carregador + perguntas
  useEffect(() => {
    setCarregadorId("");
    setCarregadores([]);

    setRespostas([]);
    setQIndex(0);
  }, [undId]);

  // quando muda linha, reset perguntas
  useEffect(() => {
    setRespostas([]);
    setQIndex(0);
  }, [eixoId]);

  // quando muda carregador ou veículo, reset perguntas
  useEffect(() => {
    setRespostas([]);
    setQIndex(0);
  }, [carregadorId, eqpItmId]);

  // ====== carregar veículos quando assunto = VEICULO ======
  useEffect(() => {
    if (assunto !== "VEICULO") return;

    (async () => {
      setLoadingVeiculos(true);
      try {
        const res = await fetch("/api/veiculos");
        if (!res.ok) throw new Error("Erro ao buscar veículos");
        const data: VeiculoAPI[] = await res.json();

        setTodosVeiculos(data);

        const filtrados = data.filter(
          (v) => !postoSelecionado || v.UndId === postoSelecionado,
        );
        setVeiculosRecentes(filtrados);
      } catch (e) {
        console.error(e);
        setTodosVeiculos([]);
        setVeiculosRecentes([]);
      } finally {
        setLoadingVeiculos(false);
      }
    })();
  }, [assunto, postoSelecionado]);

  // ====== helpers respostas ======
  function garantirResposta(psqPrgId: number): RespostaWizard {
    const existing = respostas.find((r) => r.PsqPrgId === psqPrgId);
    return (
      existing ?? {
        PsqPrgId: psqPrgId,
        resposta: null,
        justificativa: "",
      }
    );
  }

  function setResposta(psqPrgId: number, patch: Partial<RespostaWizard>) {
    setRespostas((prev) => {
      const exists = prev.find((r) => r.PsqPrgId === psqPrgId);
      if (!exists)
        return [...prev, { ...garantirResposta(psqPrgId), ...patch }];
      return prev.map((r) =>
        r.PsqPrgId === psqPrgId ? { ...r, ...patch } : r,
      );
    });
  }

  function marcarSim() {
    if (!perguntaAtual) return;
    setResposta(perguntaAtual.PsqPrgId, { resposta: "SIM", justificativa: "" });
    setFotosPorPergunta((prev) => ({
      ...prev,
      [perguntaAtual.PsqPrgId]: [],
    }));
  }

  function marcarNao() {
    if (!perguntaAtual) return;
    setResposta(perguntaAtual.PsqPrgId, { resposta: "NAO" });
  }

  // ====== FOTO - PERGUNTAS =======
  async function adicionarFotos(psqPrgId: number, files: FileList | null) {
    if (!files || files.length === 0) return;

    try {
      const arquivosOriginais = Array.from(files);
      const fotosComprimidas: File[] = [];

      for (const file of arquivosOriginais) {
        if (!file.type.startsWith("image/")) continue;

        const arquivoComprimido = await redimensionarImagem(file);
        fotosComprimidas.push(arquivoComprimido);
      }

      setFotosPorPergunta((prev) => ({
        ...prev,
        [psqPrgId]: [...(prev[psqPrgId] ?? []), ...fotosComprimidas],
      }));
    } catch (error) {
      console.error("Erro ao processar imagens:", error);
      alert("Erro ao processar a imagem.");
    }
  }

  function removerFoto(psqPrgId: number, indexFoto: number) {
    setFotosPorPergunta((prev) => ({
      ...prev,
      [psqPrgId]: (prev[psqPrgId] ?? []).filter((_, i) => i !== indexFoto),
    }));
  }

  // ====== navegação do wizard ======
  const podeProximoStep = useMemo(() => {
    if (step === "ASSUNTO") return Boolean(tipoId);
    if (step === "LINHA") return Boolean(eixoId);
    if (step === "ELETROPOSTO") return Boolean(undId);
    if (step === "CARREGADOR") return Boolean(carregadorId);
    if (step === "VEICULO") return Boolean(eqpItmId);
    if (step === "PERGUNTAS") return podeIrProximoPergunta;
    if (step === "CONCLUIDO") return false;
    return false;
  }, [
    step,
    tipoId,
    eixoId,
    undId,
    carregadorId,
    eqpItmId,
    podeIrProximoPergunta,
  ]);

  function irAnterior() {
    if (step === "ASSUNTO") return;

    if (step === "CONCLUIDO") {
      setStep("PERGUNTAS");
      setQIndex(Math.max(0, perguntas.length - 1));
      return;
    }

    if (step === "LINHA") {
      setEixoId("");
      setTipoId("");
      setStep("ASSUNTO");
      return;
    }

    if (step === "ELETROPOSTO") {
      setUndId("");
      setStep("LINHA");
      return;
    }

    if (step === "CARREGADOR") {
      setCarregadorId("");

      if (temEletroNoLogin) {
        setUndId("");
        setStep("LINHA");
        return;
      }

      setStep("ELETROPOSTO");
      return;
    }

    if (step === "VEICULO") {
      setEqpItmId("");
      setStep("LINHA");
      return;
    }

    if (step === "PERGUNTAS") {
      if (qIndex === 0) {
        if (assunto === "ELETROPOSTO") setStep("CARREGADOR");
        else if (assunto === "VEICULO") setStep("VEICULO");
        else setStep("LINHA");
        return;
      }
      setQIndex((i) => Math.max(0, i - 1));
    }
  }

  function irProximo() {
    if (!podeProximoStep) return;

    if (step === "ASSUNTO") {
      setStep("LINHA");
      return;
    }

    if (step === "LINHA") {
      const idNum = Number(tipoId);

      if (idNum === ID_ELETROPOSTO) {
        if (postoSelecionado) {
          setUndId(String(postoSelecionado));
          setStep("CARREGADOR");
          return;
        }
        setStep("ELETROPOSTO");
        return;
      }

      if (idNum === ID_VEICULO) {
        setStep("VEICULO");
        return;
      }

      setStep("PERGUNTAS");
      return;
    }

    if (step === "ELETROPOSTO") {
      setStep("CARREGADOR");
      return;
    }

    if (step === "CARREGADOR") {
      setStep("PERGUNTAS");
      return;
    }

    if (step === "VEICULO") {
      setStep("PERGUNTAS");
      return;
    }

    if (step === "PERGUNTAS") {
      if (!ehUltimaPergunta) {
        setQIndex((i) => Math.min(perguntas.length - 1, i + 1));
      } else {
        setStep("CONCLUIDO");
      }
      return;
    }
  }

  // ====== REDIMENCIONAR FOTO ======
  async function redimensionarImagem(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      reader.onerror = () => reject(new Error("Erro ao ler imagem"));

      img.onload = () => {
        const MAX_WIDTH = 1280;
        let { width, height } = img;

        if (width > MAX_WIDTH) {
          const proporcao = MAX_WIDTH / width;
          width = MAX_WIDTH;
          height = Math.round(height * proporcao);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível criar o canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Erro ao comprimir imagem"));
              return;
            }

            const nomeBase = file.name.replace(/\.[^/.]+$/, "");
            const arquivoComprimido = new File([blob], `${nomeBase}.jpg`, {
              type: "image/jpeg",
            });

            resolve(arquivoComprimido);
          },
          "image/jpeg",
          0.7,
        );
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      reader.readAsDataURL(file);
    });
  }

  // ====== ENVIAR ======
  async function enviar() {
    if (!tipoId) return;
    if (!eixoId) {
      alert("Selecione a linha.");
      return;
    }
    if (!perguntas.length) return;

    for (const p of perguntas) {
      const r = respostas.find((x) => x.PsqPrgId === p.PsqPrgId);
      if (!r?.resposta) {
        alert("Responda todas as perguntas antes de enviar.");
        return;
      }
      if (r.resposta === "NAO" && r.justificativa.trim().length === 0) {
        alert("Preencha a justificativa nas respostas 'Não'.");
        return;
      }
    }

    if (assunto === "ELETROPOSTO" && (!undId || !carregadorId)) {
      alert("Selecione o eletroposto e o carregador.");
      return;
    }
    if (assunto === "VEICULO" && !eqpItmId) {
      alert("Selecione o veículo.");
      return;
    }

    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const turnoAtual = localStorage.getItem("turnoAtual");
    const eletropostoSelecionado = localStorage.getItem(
      "eletropostoSelecionado",
    );

    if (!usuarioLogado || !turnoAtual) {
      alert("Faltam dados no localStorage (usuario/turno).");
      return;
    }

    const user = JSON.parse(usuarioLogado);
    const turno = JSON.parse(turnoAtual);

    const undIdFinal =
      assunto === "ELETROPOSTO"
        ? Number(undId)
        : eletropostoSelecionado
          ? Number(JSON.parse(eletropostoSelecionado).UndId)
          : null;

    const agora = new Date();
    const dataFormatada = formatarDataLocal(agora);

    const eqpItmIdFinal =
      assunto === "VEICULO"
        ? eqpItmId
          ? Number(eqpItmId)
          : null
        : assunto === "ELETROPOSTO"
          ? carregadorId
            ? Number(carregadorId)
            : null
          : null;

    const somenteAvarias = respostas
      .filter((r) => r.resposta === "NAO")
      .map((r) => ({
        UndId: Number(undIdFinal ?? 0),
        DtaOpe: dataFormatada,
        TrnId: Number(turno.TrnId),
        PsqId: 1,
        PsqTpoId: Number(tipoId),
        EqpItmId: eqpItmIdFinal,
        PsqPrgId: Number(r.PsqPrgId),
        PsqRsp: 0,
        PsqDth: r.justificativa.trim(),
        SttId: 1,
        UsrIdAlt: Number(user.UsrId),
        DtaAlt: dataFormatada,
      }));

    if (somenteAvarias.length === 0) {
      alert("Nenhuma avaria registrada (tudo marcado como 'Sim').");
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify({ respostas: somenteAvarias }));

      for (const resposta of somenteAvarias) {
        const arquivos = fotosPorPergunta[resposta.PsqPrgId] ?? [];

        for (const arquivo of arquivos) {
          formData.append(`foto_${resposta.PsqPrgId}`, arquivo);
        }
      }

      const res = await fetch("/api/respostaCheck", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Erro ao enviar");

      alert("Checklist enviado com sucesso!");

      setRespostas([]);
      setFotosPorPergunta({});
      setQIndex(0);

      if (assunto === "ELETROPOSTO") {
        setCarregadorId("");
        setStep("CARREGADOR");
      }

      if (assunto === "VEICULO") {
        setEqpItmId("");
        setVeiculosSelecionados([]);
        localStorage.removeItem("veiculoSelecionado");
        setStep("VEICULO");
      }
    } catch (e) {
      console.error(e);
      alert("Falha ao enviar checklist.");
    } finally {
      setSending(false);
    }
  }

  // ====== UI de cada passo ======
  const tituloPasso = useMemo(() => {
    if (step === "ASSUNTO") return "Assunto";
    if (step === "LINHA") return "Eixo";
    if (step === "ELETROPOSTO") return "Eletroposto";
    if (step === "CARREGADOR") return "Carregador";
    if (step === "VEICULO") return "Veículo";
    if (step === "CONCLUIDO") return "Concluído";
    return "Perguntas";
  }, [step]);

  const subtituloPasso = useMemo(() => {
    if (step === "ASSUNTO") {
      return temEletroNoLogin
        ? "Escolha o assunto."
        : "Escolha o assunto do checklist.";
    }
    if (step === "LINHA") return "Escolha o eixo.";
    if (step === "ELETROPOSTO") return "Escolha o eletroposto (botões).";
    if (step === "CARREGADOR") return "Escolha o carregador (botões).";
    if (step === "VEICULO")
      return "Selecione no Select (todos) e ele aparecerá como botão em Selecionado(s).";
    if (step === "PERGUNTAS")
      return loadingPerguntas
        ? "Carregando perguntas..."
        : perguntaAtual
          ? `${qIndex + 1}/${perguntas.length}`
          : "Sem perguntas.";
    if (step === "CONCLUIDO")
      return "Você finalizou as perguntas. Clique em Finalizar para enviar.";
    return "";
  }, [
    step,
    loadingPerguntas,
    perguntaAtual,
    qIndex,
    perguntas.length,
    temEletroNoLogin,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-start justify-center p-1 pb-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 space-y-4">
          <h1 className="text-xl font-semibold">Checklist</h1>

          <div className="border rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">{tituloPasso}</div>
                <div className="text-xs text-gray-500">{subtituloPasso}</div>
              </div>

              <div className="text-right text-[11px] text-gray-500 leading-tight">
                {tipoId ? (
                  <div>
                    <div>Tipo: {tipoId}</div>
                    <div>Eixo: {eixoId || "-"}</div>

                    {assunto === "ELETROPOSTO" ? (
                      <>
                        <div>UndId: {undId || "-"}</div>
                        <div>Carregador: {carregadorId || "-"}</div>
                      </>
                    ) : assunto === "VEICULO" ? (
                      <div>Veículo: {eqpItmId || "-"}</div>
                    ) : null}
                  </div>
                ) : (
                  <div>—</div>
                )}
              </div>
            </div>

            {/* ===== PASSO ASSUNTO ===== */}
            {step === "ASSUNTO" && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Assunto</span>
                <Select value={tipoId} onValueChange={setTipoId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingTipos ? "Carregando..." : "Selecione..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tipos.map((t) => (
                        <SelectItem key={t.PsqTpoId} value={String(t.PsqTpoId)}>
                          {t.PsqTpo}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ===== PASSO LINHA ===== */}
            {step === "LINHA" && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Eixo</span>
                <Select value={eixoId} onValueChange={setEixoId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingEixos
                          ? "Carregando eixos..."
                          : "Selecione o eixo..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {eixos.map((linha) => (
                        <SelectItem
                          key={linha.BrtId}
                          value={String(linha.BrtNme)}
                        >
                          {linha.BrtNme}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ===== PASSO ELETROPOSTO ===== */}
            {step === "ELETROPOSTO" && (
              <div className="space-y-2">
                {loadingEletro ? (
                  <div className="text-sm text-gray-500">
                    Carregando eletropostos...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {eletropostos.map((e) => (
                      <Button
                        key={e.UndId}
                        type="button"
                        variant={
                          undId === String(e.UndId) ? "default" : "outline"
                        }
                        className="justify-start h-12 bg-green-500 text-white"
                        onClick={() => setUndId(String(e.UndId))}
                      >
                        {e.PostoRecarga}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== PASSO CARREGADOR ===== */}
            {step === "CARREGADOR" && (
              <div className="space-y-2">
                {loadingCarregadores ? (
                  <div className="text-sm text-gray-500">
                    Carregando carregadores...
                  </div>
                ) : carregadores.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    Nenhum carregador encontrado para este eletroposto.
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium">
                      Escolha um Carregador
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      {carregadores.map((c) => (
                        <Button
                          key={c.EqpItmId}
                          type="button"
                          variant={
                            carregadorId === String(c.EqpItmId)
                              ? "default"
                              : "outline"
                          }
                          className="h-12 bg-green-500 text-white"
                          onClick={() => setCarregadorId(String(c.EqpItmId))}
                        >
                          {c.Carregador}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ===== PASSO VEÍCULO ===== */}
            {step === "VEICULO" && (
              <div className="space-y-3">
                {loadingVeiculos ? (
                  <div className="text-sm text-gray-500">
                    Carregando veículos...
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Buscar Ônibus</span>
                      <Select
                        value={eqpItmId}
                        onValueChange={(value) => {
                          setEqpItmId(value);
                          const v = todosVeiculos.find(
                            (x) => String(x.EqpItmId) === value,
                          );
                          if (v) {
                            addVeiculoSelecionado(v);
                            localStorage.setItem(
                              "veiculoSelecionado",
                              JSON.stringify(v),
                            );
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Ônibus..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {todosVeiculosOrdenados.map((v) => (
                              <SelectItem
                                key={v.EqpItmId}
                                value={String(v.EqpItmId)}
                              >
                                {v.Onibus}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {veiculosSelecionadosOrdenados.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">
                          Selecionado(s)
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {veiculosSelecionadosOrdenados.map((v) => (
                            <div
                              key={v.EqpItmId}
                              className="flex items-center gap-1"
                            >
                              <Button
                                type="button"
                                variant={
                                  eqpItmId === String(v.EqpItmId)
                                    ? "default"
                                    : "outline"
                                }
                                className="h-10 bg-green-500 text-white"
                                onClick={() => {
                                  setEqpItmId(String(v.EqpItmId));
                                  localStorage.setItem(
                                    "veiculoSelecionado",
                                    JSON.stringify(v),
                                  );
                                }}
                              >
                                {v.Onibus}
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                className="h-10 px-2"
                                onClick={() =>
                                  removerVeiculoSelecionado(v.EqpItmId)
                                }
                                title="Remover"
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {veiculosRecentesOrdenados.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">
                          Realizar Checklists dos Ônibus
                        </span>
                        <div className="grid grid-cols-5 gap-2">
                          {veiculosRecentesOrdenados.map((v) => (
                            <Button
                              key={v.EqpItmId}
                              type="button"
                              variant={
                                eqpItmId === String(v.EqpItmId)
                                  ? "default"
                                  : "outline"
                              }
                              className="h-12 bg-green-500 text-white"
                              onClick={() => {
                                setEqpItmId(String(v.EqpItmId));
                                addVeiculoSelecionado(v);
                                localStorage.setItem(
                                  "veiculoSelecionado",
                                  JSON.stringify(v),
                                );
                              }}
                            >
                              {v.Onibus}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ===== PASSO PERGUNTAS ===== */}
            {step === "PERGUNTAS" && (
              <div className="space-y-3">
                {perguntaAtual ? (
                  <>
                    <div className="text-sm font-semibold">
                      {perguntaAtual.Pergunta}?
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          respostaAtual?.resposta === "SIM"
                            ? "default"
                            : "outline"
                        }
                        className="flex-1 hover:bg-green-500"
                        onClick={marcarSim}
                      >
                        Sim
                      </Button>

                      <Button
                        type="button"
                        variant={
                          respostaAtual?.resposta === "NAO"
                            ? "default"
                            : "outline"
                        }
                        className="flex-1 hover:bg-red-500"
                        onClick={marcarNao}
                      >
                        Não
                      </Button>
                    </div>

                    {respostaAtual?.resposta === "NAO" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <span className="text-xs text-gray-500">
                            Descreva a avaria:
                          </span>
                          <Textarea
                            placeholder="Descreva a avaria / justificativa..."
                            value={respostaAtual?.justificativa ?? ""}
                            onChange={(e) =>
                              setResposta(perguntaAtual.PsqPrgId, {
                                justificativa: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs text-gray-500">
                            Tire uma foto ou selecione da galeria:
                          </span>

                          <label className="flex items-center justify-center gap-2 w-full h-12 rounded-md border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
                            <Camera className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Tirar foto / Escolher imagem
                            </span>

                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                adicionarFotos(
                                  perguntaAtual.PsqPrgId,
                                  e.target.files,
                                )
                              }
                            />
                          </label>

                          {(fotosPorPergunta[perguntaAtual.PsqPrgId] ?? [])
                            .length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs text-gray-500">
                                Fotos selecionadas:
                              </span>

                              <div className="grid grid-cols-2 gap-2">
                                {(
                                  fotosPorPergunta[perguntaAtual.PsqPrgId] ?? []
                                ).map((foto, index) => (
                                  <div
                                    key={`${foto.name}-${index}`}
                                    className="border rounded-lg p-2 space-y-2"
                                  >
                                    <div className="text-[11px] break-all text-gray-600">
                                      {foto.name}
                                    </div>

                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="w-full"
                                      onClick={() =>
                                        removerFoto(
                                          perguntaAtual.PsqPrgId,
                                          index,
                                        )
                                      }
                                    >
                                      Remover
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    {loadingPerguntas
                      ? "Carregando perguntas..."
                      : "Sem perguntas."}
                  </div>
                )}
              </div>
            )}

            {/* ===== PASSO CONCLUIDO ===== */}
            {step === "CONCLUIDO" && (
              <div className="space-y-3">
                <div className="text-sm font-semibold flex flex-col items-center gap-2">
                  <CheckCircle className="text-green-500 w-20 h-20" />
                  <h1 className="text-lg">Você finalizou as perguntas</h1>
                  <p className="text-xs text-gray-500 text-center">
                    Clique em <b>Finalizar</b> para enviar, ou <b>Anterior</b>{" "}
                    para revisar.
                  </p>
                </div>
              </div>
            )}

            {/* ===== Navegação ===== */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 bg-yellow-500 text-white hover:bg-yellow-300 hover:text-white"
                disabled={step === "ASSUNTO"}
                onClick={irAnterior}
              >
                Anterior
              </Button>

              {step === "CONCLUIDO" ? (
                <Button
                  type="button"
                  className="flex-1 h-12 text-base bg-blue-500 hover:bg-blue-300"
                  disabled={sending}
                  onClick={enviar}
                >
                  {sending ? "Enviando..." : "Finalizar"}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="flex-1 h-12 text-base bg-blue-500 hover:bg-blue-300"
                  disabled={!podeProximoStep}
                  onClick={irProximo}
                >
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
}
