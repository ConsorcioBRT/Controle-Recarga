"use client";

import { useEffect, useMemo, useState } from "react";
import { checklistApi } from "@/src/services/checklist/api";
import {
  CarregadorAPI,
  EletropostoAPI,
  Pergunta,
  Tipo,
  VeiculoAPI,
} from "@/src/lib/checklist/types";
import { ordenarVeiculos } from "@/src/lib/checklist/utils";
import { ID_ELETROPOSTO, ID_VEICULO } from "@/src/lib/checklist/constants";

export function useChecklistData(
  tipoId: string,
  step: string,
  postoSelecionado: number | null,
) {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [eletropostos, setEletropostos] = useState<EletropostoAPI[]>([]);
  const [carregadores, setCarregadores] = useState<CarregadorAPI[]>([]);
  const [todosVeiculos, setTodosVeiculos] = useState<VeiculoAPI[]>([]);

  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loadingPerguntas, setLoadingPerguntas] = useState(false);
  const [loadingEletro, setLoadingEletro] = useState(false);
  const [loadingCarregadores, setLoadingCarregadores] = useState(false);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);

  const assunto = useMemo(() => {
    const id = Number(tipoId);
    if (id === ID_ELETROPOSTO) return "ELETROPOSTO";
    if (id === ID_VEICULO) return "VEICULO";
    return "";
  }, [tipoId]);

  useEffect(() => {
    async function loadTipos() {
      setLoadingTipos(true);
      try {
        setTipos(await checklistApi.getTipos());
      } catch (error) {
        console.error(error);
        setTipos([]);
      } finally {
        setLoadingTipos(false);
      }
    }

    loadTipos();
  }, []);

  useEffect(() => {
    if (!tipoId) {
      setPerguntas([]);
      return;
    }

    async function loadPerguntas() {
      setLoadingPerguntas(true);
      try {
        const data = await checklistApi.getPerguntas(tipoId);
        setPerguntas([...data].sort((a, b) => a.PsqPrgId - b.PsqPrgId));
      } catch (error) {
        console.error(error);
        setPerguntas([]);
      } finally {
        setLoadingPerguntas(false);
      }
    }

    loadPerguntas();
  }, [tipoId]);

  useEffect(() => {
    if (assunto !== "ELETROPOSTO") return;

    async function loadEletropostos() {
      setLoadingEletro(true);
      try {
        setEletropostos(await checklistApi.getEletropostos());
      } catch (error) {
        console.error(error);
        setEletropostos([]);
      } finally {
        setLoadingEletro(false);
      }
    }

    loadEletropostos();
  }, [assunto]);

  async function loadCarregadores(undId: string) {
    if (!undId || step !== "CARREGADOR") return;

    setLoadingCarregadores(true);
    try {
      const data = await checklistApi.getCarregadores(undId);
      setCarregadores((data ?? []).filter((item) => item?.EqpItmId != null));
    } catch (error) {
      console.error(error);
      setCarregadores([]);
    } finally {
      setLoadingCarregadores(false);
    }
  }

  useEffect(() => {
    if (assunto !== "VEICULO") return;

    async function loadVeiculos() {
      setLoadingVeiculos(true);
      try {
        setTodosVeiculos(await checklistApi.getVeiculos());
      } catch (error) {
        console.error(error);
        setTodosVeiculos([]);
      } finally {
        setLoadingVeiculos(false);
      }
    }

    loadVeiculos();
  }, [assunto]);

  const todosVeiculosOrdenados = useMemo(
    () => ordenarVeiculos(todosVeiculos),
    [todosVeiculos],
  );

  const veiculosRecentesOrdenados = useMemo(() => {
    const filtrados = todosVeiculos.filter(
      (v) => !postoSelecionado || v.UndId === postoSelecionado,
    );

    return ordenarVeiculos(filtrados);
  }, [todosVeiculos, postoSelecionado]);

  return {
    tipos,
    perguntas,
    eletropostos,
    carregadores,
    todosVeiculos,
    todosVeiculosOrdenados,
    veiculosRecentesOrdenados,
    assunto,
    loadingTipos,
    loadingPerguntas,
    loadingEletro,
    loadingCarregadores,
    loadingVeiculos,
    loadCarregadores,
    setCarregadores,
  };
}
