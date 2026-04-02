import React, { useEffect, useMemo, useState } from "react";
import { Label } from "./ui/label";
import { Battery, Camera, Fuel, Gauge, PlugZap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DialogClose, DialogFooter } from "./ui/dialog";

const conectores = ["1", "2", "ambos"] as const;

type DadosOnibus = {
  RcgIdOrg: number;
  CbtId: number | null;
  TipoCombustivel: string | null;
  EqpItmId: number;
  Onibus: string;
  Situacao: string;
  Data_Operacao: string | null;
  UndId: number | null;
  PostoRecarga: string | null;
  CrrId?: number | null;
  Carregador?: string | null;
  DataInicio?: string | null;
  DataFinal?: string | null;
  BateriaInicio?: number | null;
  Bateria: number | null;
  BateriaEntregue?: number | null;
  Carga_kWh: number | null;
  OdometroInicio?: number | null;
  Odometro: number | null;
  KmRodado?: number | null;
  Checklist?: string | null;
  Capacidade_Tecnica: number;
  RcgId?: number | null;
};

type Carregador = {
  UndId: number;
  EqpItmId: number;
  Carregador: string;
};

type FormDataType = {
  carregador: number | null;
  conector: string | null;
  percentualInicial: string;
  odometro: string;
  odometroConfirme: string;
  prsBar: string;
};

type RecargaPayload = {
  UndId: number;
  VclId: number;
  CbtId: number | null;
  CrrId: number | null;
  CrrCnc: number;
  DtaIni: string;
  DtaOpe: string;
  SocIni: number;
  TmpAmb: number | null;
  PrsBar: number | null;
  UsrIdAlt: number;
  RcgIdOrg: number | null;
  EmpId: number;
  SttRcgId: number;
  SttId: number;
  SttIdChk: number;
  OdoIni?: number | null;
  OdoFin?: number | null;
};

type EletropostoLocalStorage = {
  UndId: number | null;
  PostoRecarga?: string | null;
  CbtId?: number | null;
  TipoCombustivel?: string | null;
  Latitude?: string | number | null;
  Longitude?: string | number | null;
};

const DialogSteps = ({
  veiculo,
  iniciarCarregamento,
}: {
  veiculo: { Onibus: string };
  iniciarCarregamento: (v: { Onibus: string }) => void;
}) => {
  const [step, setStep] = useState(1);
  const [cbtId, setCbtId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    carregador: null,
    conector: null,
    percentualInicial: "",
    odometro: "",
    odometroConfirme: "",
    prsBar: "",
  });

  const [carregadores, setCarregadores] = useState<Carregador[]>([]);
  const [formConfirmacao, setFormConfirmacao] = useState<FormDataType | null>(
    null,
  );
  const [dadosOnibus, setDadosOnibus] = useState<DadosOnibus | null>(null);
  const [erroOdometro, setErroOdometro] = useState<string | null>(null);
  const [erroOdometroConfirme, setErroOdometroConfirme] = useState<
    string | null
  >(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const carregadorSelecionado = carregadores.find(
    (c) => c.EqpItmId === formData.carregador,
  );
  const [temperaturaAtual, setTemperaturaAtual] = useState<number | null>(null);
  const [loadingTemperatura, setLoadingTemperatura] = useState(false);

  const odometroMaiorOuIgual =
    Number(formData.odometro || 0) >= (dadosOnibus?.Odometro ?? 0);

  const odometroValido =
    !!formData.odometro &&
    !!formData.odometroConfirme &&
    formData.odometro === formData.odometroConfirme;

  const botoes = carregadores;

  async function buscarTemperaturaAtual(): Promise<number | null> {
    try {
      const eletroposto = pegarEletropostoDoLocalStorage();

      const lat = eletroposto?.Latitude;
      const lon = eletroposto?.Longitude;

      if (
        lat === null ||
        lat === undefined ||
        lon === null ||
        lon === undefined
      ) {
        return null;
      }

      const latitude = Number(lat);
      const longitude = Number(lon);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return null;
      }

      const res = await fetch(
        `/api/temperatura?lat=${latitude}&lon=${longitude}`,
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar temperatura");
      }

      const data = await res.json();
      const temperatura = data?.temperatura ?? null;

      return typeof temperatura === "number" ? temperatura : null;
    } catch (error) {
      console.error("Erro ao buscar temperatura atual:", error);
      return null;
    }
  }

  function pegarFiltrosDoEletroposto() {
    const eletroposto = pegarEletropostoDoLocalStorage();

    const undId = Number(eletroposto?.UndId);
    const cbtId = Number(eletroposto?.CbtId);

    return {
      UndId: Number.isNaN(undId) ? null : undId,
      CbtId: Number.isNaN(cbtId) ? null : cbtId,
    };
  }

  function pegarEletropostoDoLocalStorage(): EletropostoLocalStorage | null {
    const eletropostoJson = localStorage.getItem("eletropostoSelecionado");
    if (!eletropostoJson) return null;

    try {
      return JSON.parse(eletropostoJson) as EletropostoLocalStorage;
    } catch {
      return null;
    }
  }

  function pegarVeiculoDoLocalStorage() {
    const veiculoJson = localStorage.getItem("veiculoSelecionado");
    if (!veiculoJson) return null;

    try {
      return JSON.parse(veiculoJson);
    } catch {
      return null;
    }
  }

  function pegarUndIdDoLocalStorage(): number | null {
    const eletroposto = pegarEletropostoDoLocalStorage();
    const numero = Number(eletroposto?.UndId);
    return Number.isNaN(numero) ? null : numero;
  }

  function pegarDadosDoLocalStorage() {
    const { UndId, CbtId } = pegarFiltrosDoEletroposto();

    const veiculoSelecionado = pegarVeiculoDoLocalStorage();
    const VclId = veiculoSelecionado?.EqpItmId ?? null;

    const usuarioJson = localStorage.getItem("usuarioLogado");
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;
    const UsrIdAlt = usuario?.UsrId ?? null;

    return {
      UndId,
      VclId,
      UsrIdAlt,
      CbtId,
    };
  }

  function formatarDataLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds(),
    )}`;
  }

  function limparEstadoAoFechar() {
    setStep(1);
    setFormData({
      carregador: null,
      conector: null,
      percentualInicial: "",
      odometro: "",
      odometroConfirme: "",
      prsBar: "",
    });
    setFormConfirmacao(null);
    setErroOdometro(null);
    setErroOdometroConfirme(null);
    setFotoFile(null);
    setFotoPreview(null);
    setTemperaturaAtual(null);
    localStorage.removeItem("formDataConfirmacao");
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function uploadFoto(
    file: File,
    dados: {
      recargaId: string;
      undId: string;
      vclId: string;
      dtaIni: string;
    },
  ) {
    const formDataFoto = new FormData();
    formDataFoto.append("file", file);
    formDataFoto.append("recargaId", dados.recargaId);
    formDataFoto.append("undId", dados.undId);
    formDataFoto.append("vclId", dados.vclId);
    formDataFoto.append("dtaIni", dados.dtaIni);

    const res = await fetch("https://brtgo.com.br/upload.php", {
      method: "POST",
      body: formDataFoto,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Erro no upload da foto");
    }

    return data;
  }

  const podeAvancar = useMemo(() => {
    if (step === 1) return !!formData.carregador;
    if (step === 2) return !!formData.conector;

    if (step === 3) {
      const prsBarValido =
        cbtId !== 5 || (cbtId === 5 && formData.prsBar.trim() !== "");

      return (
        !!formData.percentualInicial &&
        !!formData.odometro &&
        !!formData.odometroConfirme &&
        odometroValido &&
        odometroMaiorOuIgual &&
        !erroOdometro &&
        !erroOdometroConfirme &&
        prsBarValido
      );
    }

    return true;
  }, [
    step,
    formData,
    odometroValido,
    odometroMaiorOuIgual,
    erroOdometro,
    erroOdometroConfirme,
    cbtId,
  ]);

  useEffect(() => {
    async function carregarTemperatura() {
      try {
        setLoadingTemperatura(true);
        const temperatura = await buscarTemperaturaAtual();
        setTemperaturaAtual(temperatura);
      } finally {
        setLoadingTemperatura(false);
      }
    }

    carregarTemperatura();
  }, []);

  useEffect(() => {
    async function carregarDadosDoVeiculo() {
      try {
        const veiculoSelecionado = pegarVeiculoDoLocalStorage();
        const eqpItmId = veiculoSelecionado?.EqpItmId ?? null;

        if (!eqpItmId) return;

        const resposta = await fetch(`/api/veiculos?EqpItmId=${eqpItmId}`);
        const data: DadosOnibus[] = await resposta.json();

        if (!data.length) return;

        const veiculoAtual = data[0];

        setDadosOnibus(veiculoAtual);
        setCbtId(veiculoAtual.CbtId ?? null);

        const eletroposto = pegarEletropostoDoLocalStorage();
        const undId = Number(eletroposto?.UndId);
        const cbtIdStorage = Number(eletroposto?.CbtId);

        const undIdValido = !Number.isNaN(undId) ? undId : null;
        const cbtIdValido = !Number.isNaN(cbtIdStorage)
          ? cbtIdStorage
          : (veiculoAtual.CbtId ?? null);

        if (cbtIdValido && undIdValido) {
          const respCarregadores = await fetch(
            `/api/carregadores?cbtId=${cbtIdValido}&undId=${undIdValido}`,
          );

          if (!respCarregadores.ok) {
            throw new Error("Erro ao buscar carregadores");
          }

          const listaCarregadores: Carregador[] = await respCarregadores.json();

          setCarregadores(
            listaCarregadores.filter((c) => c && c.EqpItmId != null),
          );
        } else {
          setCarregadores([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do veículo:", error);
      }
    }

    carregarDadosDoVeiculo();
  }, []);

  useEffect(() => {
    if (step === 4) {
      const dados = localStorage.getItem("formDataConfirmacao");
      if (dados) {
        const parsed = JSON.parse(dados) as FormDataType;
        setFormConfirmacao(parsed);
      }
    }
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;

    async function carregarDadosStep3() {
      try {
        const veiculoSelecionado = pegarVeiculoDoLocalStorage();
        const eqpItmId = veiculoSelecionado?.EqpItmId ?? null;

        if (!eqpItmId) return;

        const resposta = await fetch(`/api/veiculos?EqpItmId=${eqpItmId}`);
        const data: DadosOnibus[] = await resposta.json();

        if (data.length > 0) {
          setDadosOnibus(data[0]);
          setCbtId(data[0].CbtId ?? null);
        }
      } catch (error) {
        console.error(error);
      }
    }

    carregarDadosStep3();
  }, [step]);

  useEffect(() => {
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  async function enviarRecargaInicial(
    dadosFormulario: FormDataType,
    arquivoFoto?: File | null,
  ) {
    try {
      const { UndId, VclId, UsrIdAlt, CbtId } = pegarDadosDoLocalStorage();

      if (!UndId || !VclId || !UsrIdAlt) {
        console.error("Faltam dados no localStorage: UndId, VclId ou UsrIdAlt");
        return;
      }

      const ultimaRecargaResp = await fetch(
        `/api/recarga/ultima?VclId=${VclId}`,
      );
      const ultimaRecarga = ultimaRecargaResp.ok
        ? await ultimaRecargaResp.json()
        : null;

      const agora = new Date();
      const dataFormatada = formatarDataLocal(agora);

      const odometroValor = Number(dadosFormulario.odometro.replace(/\./g, ""));

      // Navegador não expõe temperatura ambiente real do celular de forma confiável
      let tmpAmb = temperaturaAtual;

      if (tmpAmb === null) {
        const temp = await buscarTemperaturaAtual();
        setTemperaturaAtual(temp);
        tmpAmb = temp;
      }

      // 🔥 AQUI é o ajuste importante
      tmpAmb =
        typeof tmpAmb === "number" && !Number.isNaN(tmpAmb)
          ? Math.round(tmpAmb)
          : null;

      const prsBar =
        CbtId === 5 && dadosFormulario.prsBar.trim() !== ""
          ? Number(dadosFormulario.prsBar)
          : null;

      const dadosParaEnviar: RecargaPayload = {
        UndId,
        VclId: Number(VclId),
        CbtId: CbtId ?? null,
        CrrId: dadosFormulario.carregador,
        CrrCnc:
          dadosFormulario.conector === "ambos"
            ? 0
            : Number(dadosFormulario.conector),
        DtaIni: dataFormatada,
        DtaOpe: dataFormatada,
        SocIni: Number(dadosFormulario.percentualInicial),
        TmpAmb: tmpAmb,
        PrsBar: prsBar,
        UsrIdAlt,
        RcgIdOrg: null,
        EmpId: 1,
        SttRcgId: 5,
        SttId: 1,
        SttIdChk: 0,
      };

      if (!ultimaRecarga) {
        dadosParaEnviar.OdoIni = null;
        dadosParaEnviar.OdoFin = odometroValor;
      } else if (ultimaRecarga.SttRcgId === 7) {
        dadosParaEnviar.OdoIni =
          ultimaRecarga.OdoFin ?? ultimaRecarga.OdoIni ?? null;
        dadosParaEnviar.OdoFin = odometroValor;
        dadosParaEnviar.RcgIdOrg = ultimaRecarga.RcgId;
      } else {
        dadosParaEnviar.OdoIni = ultimaRecarga.OdoFin ?? null;
        dadosParaEnviar.OdoFin = odometroValor;
      }

      console.log("Dados enviados para a API:", dadosParaEnviar);

      const resposta = await fetch("/api/recarga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        console.error(
          "Erro ao salvar recarga: " + (erro.error || JSON.stringify(erro)),
        );
        return;
      }

      const dadosResposta = await resposta.json();
      console.log(`Recarga iniciada! ID: ${dadosResposta.RcgId}`);

      if (arquivoFoto) {
        try {
          const fotoData = await uploadFoto(arquivoFoto, {
            recargaId: String(dadosResposta.RcgId),
            undId: String(UndId),
            vclId: String(VclId),
            dtaIni: String(dadosResposta.DtaIni ?? dataFormatada),
          });
          console.log("Foto salva em:", fotoData.url);
        } catch (erroUpload) {
          console.error("Erro ao enviar foto:", erroUpload);
        }
      }

      iniciarCarregamento(veiculo);
      limparEstadoAoFechar();
    } catch (error) {
      console.error("Erro ao enviar recarga:", (error as Error).message);
    }
  }

  return (
    <>
      <div className="grid gap-4 mt-6">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Escolha um Carregador:
            </Label>

            <div className="grid grid-cols-3 gap-2">
              {botoes
                .filter(
                  (item): item is Carregador => !!item && item.EqpItmId != null,
                )
                .map((item) => (
                  <Button
                    key={item.EqpItmId}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        carregador: item.EqpItmId,
                      }))
                    }
                    className={`inline-flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-12 w-24 ${
                      formData.carregador === item.EqpItmId
                        ? "bg-green-300 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {item.Carregador}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2">
              <PlugZap />
              Escolha um Conector:
            </Label>

            <div className="grid grid-cols-3 gap-3">
              {conectores.map((conector) => (
                <Button
                  key={conector}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      conector,
                    }))
                  }
                  className={`inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 ${
                    formData.conector === conector
                      ? "bg-gray-500 text-white"
                      : "bg-white text-black hover:text-white"
                  }`}
                >
                  {conector}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            {dadosOnibus && (
              <div className="p-4 border rounded shadow mb-4 bg-white">
                <h2 className="text-lg font-bold mb-2">Última recarga</h2>

                <p>
                  <strong className="text-xs">Data:</strong>{" "}
                  {dadosOnibus.Data_Operacao
                    ? new Date(dadosOnibus.Data_Operacao).toLocaleDateString(
                        "pt-BR",
                        { timeZone: "UTC" },
                      )
                    : "—"}
                </p>

                <p>
                  <strong className="text-xs">Unidade:</strong>{" "}
                  {dadosOnibus.PostoRecarga ?? "—"}
                </p>

                <p>
                  <strong className="text-xs">Percentual Final:</strong>{" "}
                  {dadosOnibus.Bateria ?? "—"}%
                </p>

                <p>
                  <strong className="text-xs">Odômetro Final:</strong>{" "}
                  {dadosOnibus.Odometro ?? "—"} km
                </p>

                <p>
                  <strong className="text-xs">Total Kwh:</strong>{" "}
                  {dadosOnibus.Carga_kWh ?? "—"} kwh
                </p>
              </div>
            )}

            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                Percentual Inicial (%):
              </Label>

              <Input
                id="percentual"
                type="number"
                inputMode="numeric"
                value={formData.percentualInicial}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 100) {
                    setFormData((prev) => ({
                      ...prev,
                      percentualInicial: e.target.value,
                    }));
                  }
                }}
                className="bg-white"
              />
            </div>

            {cbtId === 5 && (
              <div className="grid gap-3">
                <Label className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Pressão BAR:
                </Label>

                <Input
                  id="prsBar"
                  type="number"
                  inputMode="numeric"
                  value={formData.prsBar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prsBar: e.target.value,
                    }))
                  }
                  placeholder="Informe a pressão"
                  className="bg-white"
                />
              </div>
            )}

            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Odômetro (km):
              </Label>

              <Input
                id="odometro"
                type="text"
                inputMode="numeric"
                value={formData.odometro}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    odometro: apenasNumeros,
                  }));
                }}
                onBlur={() => {
                  const valorNumerico = Number(formData.odometro);
                  const anterior = dadosOnibus?.Odometro ?? 0;

                  if (!isNaN(valorNumerico) && valorNumerico < anterior) {
                    setErroOdometro(
                      `O odômetro não pode ser menor que o anterior (${anterior} km)`,
                    );
                  } else {
                    setErroOdometro(null);
                  }
                }}
                placeholder="0"
                className="bg-white"
              />

              {erroOdometro && (
                <p className="text-red-600 text-sm mt-1">{erroOdometro}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Confirme o Odômetro (km):
              </Label>

              <Input
                id="odometroConfirme"
                type="text"
                inputMode="numeric"
                value={formData.odometroConfirme}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    odometroConfirme: apenasNumeros,
                  }));
                }}
                onBlur={() => {
                  if (formData.odometroConfirme !== formData.odometro) {
                    setErroOdometroConfirme("Os odômetros devem ser iguais");
                  } else {
                    setErroOdometroConfirme(null);
                  }
                }}
                placeholder="0"
                className="bg-white"
              />

              {erroOdometroConfirme && (
                <p className="text-red-600 text-sm mt-1">
                  {erroOdometroConfirme}
                </p>
              )}
            </div>

            <div className="flex items-center mt-5 mb-5 justify-center gap-3 p-2 rounded-sm relative">
              <Label
                htmlFor="fotoOdometro"
                className="flex items-center gap-2 text-white bg-blue-500 p-4 rounded-lg"
              >
                <Camera className="w-4 h-4" />
                Registrar Odômetro
              </Label>

              <Input
                id="fotoOdometro"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFotoChange}
              />
            </div>

            {fotoPreview && (
              <div className="mt-2">
                <p className="text-xs">Pré-visualização:</p>
                <img
                  src={fotoPreview}
                  alt="Foto do odômetro"
                  className="w-32 h-auto"
                />
              </div>
            )}
          </>
        )}

        {step === 4 && formConfirmacao && (
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-4">Confirme os dados:</h2>

            <p>
              <strong>Carregador:</strong>{" "}
              {carregadorSelecionado ? carregadorSelecionado.Carregador : "N/A"}
            </p>

            <p>
              <strong>Conector:</strong> {formConfirmacao.conector}
            </p>

            <p>
              <strong>Percentual Inicial:</strong>{" "}
              {formConfirmacao.percentualInicial} %
            </p>

            {cbtId === 5 && (
              <p>
                <strong>Pressão BAR:</strong> {formConfirmacao.prsBar || "—"}
              </p>
            )}

            <p>
              <strong>Odômetro:</strong> {formConfirmacao.odometro} km
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <div className="flex items-center justify-between mt-4 gap-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              className="w-full h-14"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          ) : (
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 bg-yellow-400 text-white"
                onClick={limparEstadoAoFechar}
              >
                Cancelar
              </Button>
            </DialogClose>
          )}

          {step < 4 ? (
            <Button
              type="button"
              className="w-full h-14 bg-blue-500 text-lg font-bold"
              disabled={!podeAvancar}
              onClick={() => {
                if (step === 1 && !formData.carregador) {
                  alert("Selecione um carregador.");
                  return;
                }

                if (step === 2 && !formData.conector) {
                  alert("Selecione um conector.");
                  return;
                }

                if (step === 3) {
                  if (!odometroMaiorOuIgual) {
                    alert(
                      `O odômetro atual ${
                        formData.odometro
                      } é menor que o anterior ${
                        dadosOnibus?.Odometro ?? 0
                      }. Verifique`,
                    );
                    return;
                  }

                  if (cbtId === 5 && !formData.prsBar.trim()) {
                    alert("Informe a Pressão BAR.");
                    return;
                  }

                  localStorage.setItem(
                    "formDataConfirmacao",
                    JSON.stringify(formData),
                  );
                }

                setStep(step + 1);
              }}
            >
              Próximo
            </Button>
          ) : (
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  if (!formConfirmacao) {
                    alert("Nenhum dado para enviar");
                    return;
                  }

                  enviarRecargaInicial(formConfirmacao, fotoFile);
                }}
                className="w-full h-14 bg-green-500 text-lg font-bold"
              >
                Iniciar
              </Button>
            </DialogClose>
          )}
        </div>
      </DialogFooter>
    </>
  );
};

export default DialogSteps;
