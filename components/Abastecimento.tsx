"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Footer from "./Footer";
import { Battery, Circle, Fuel, Gauge, PlugZap, Zap } from "lucide-react";

const conectores = ["1", "2", "ambos"];

const Abastecimento = () => {
  const [livres, setLivres] = useState<{ Onibus: string }[]>([]);
  const [carregando, setCarregando] = useState<{ Onibus: string }[]>([]);
  const [resposta, setResposta] = useState("");
  const [odometro, setOdometro] = useState("");

  function formatarNumero(valor: string) {
    const semLetras = valor.replace(/\D/g, ""); // aqui não irá permitir letrar, apenas números
    return semLetras.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // aqui vai formatar os números com ponto
  }

  function handleOdometroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = e.target.value;
    const valorFormatado = formatarNumero(valorDigitado);
    setOdometro(valorFormatado);
  }

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const res = await fetch(`/api/veiculos`);
        if (!res.ok) {
          throw new Error("Erro ao buscar veículos");
        }
        const data = await res.json();

        // Aqui é onde irei separar o INICIADOS de LIVRES

        // Aqui você separa os veículos pela situação
        const onibusLivres = data.filter(
          (item: { Situacao: string }) => item.Situacao === "LIVRE"
        );
        const onibusCarregando = data.filter(
          (item: { Situacao: string }) => item.Situacao === "INICIADA"
        );

        setLivres(onibusLivres);
        setCarregando(onibusCarregando);
      } catch (error) {
        console.error("Erro:", error);
      }
    }

    fetchVeiculos();
  }, []);

  // Irá salvar o veículo no localStorage
  function selecionarVeiculo(veiculo: { Onibus: string }) {
    localStorage.setItem("veiculoSelecionado", JSON.stringify(veiculo));
  }

  // Aqui vai iniciar o Carregamento
  function iniciarCarregamento(veiculo: { Onibus: string }) {
    setLivres((prev) => prev.filter((v) => v.Onibus !== veiculo.Onibus));
    setCarregando((prev) => [...prev, veiculo]);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <Header />
        {/* Corpo da Página */}
        <div className="mt-5 mx-5">
          {/* Onibus Livres */}
          <div>
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-blue-500 bg-blue-500 rounded-full" />
              <span className="text-lg font-semibold text-gray-700">
                Ônibus Livres ({livres.length})
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-2 gap-4 mt-5 max-h-52 overflow-y-auto">
              {livres.map((item, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        selecionarVeiculo(item);
                      }}
                      variant="outline"
                      className="inline-flex items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-blue-500 text-white"
                    >
                      {item.Onibus}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm w-full rounded-xl p-6">
                    <DialogHeader className="flex items-start">
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="text-blue-500" />
                        Iniciar Recarga - Ônibus{" "}
                        <span className="bg-blue-500 text-white p-1 rounded-full">
                          {item.Onibus}
                        </span>
                      </DialogTitle>
                    </DialogHeader>

                    {/* Parte das STEPS */}
                    <DialogSteps
                      veiculo={item}
                      iniciarCarregamento={iniciarCarregamento}
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            <Separator className="mt-5" />
          </div>

          {/* Onibus Carregando */}
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-yellow-500 bg-yellow-500 rounded-full" />
              <span className="text-lg font-semibold text-gray-700">
                Ônibus Carregando ({carregando.length})
              </span>
            </div>
            <div className="mt-3 ml-1">
              {carregando.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Nenhum ônibus carregando
                </p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
                  {carregando.map((item, index) => (
                    <Dialog key={index}>
                      <form>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="inline-flex items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-yellow-500 text-white"
                          >
                            {item.Onibus}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm w-full rounded-xl p-6">
                          <DialogHeader className="flex items-start">
                            <DialogTitle className="flex items-center gap-2">
                              <Zap className="text-yellow-500" />
                              Finalizar Recarga - Ônibus{" "}
                              <span className="bg-yellow-500 text-white p-1 rounded-full">
                                {item.Onibus}
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 mt-6">
                            <div className="grid gap-3">
                              <Label className="flex items-center gap-2">
                                <Battery className="w-4 h-4" />
                                Percentual Final (%)
                              </Label>
                              <Input
                                id="percentual-final"
                                name="percentual-final"
                                type="number"
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label
                                htmlFor="kw"
                                className="flex items-center gap-2"
                              >
                                <Zap className="w-4 h-4" />
                                Energia Utilizada (kw/h)
                              </Label>
                              <Input id="kw" name="kw" type="number" />
                            </div>
                            <div className="grid gap-3">
                              <Label className="flex items-center gap-2">
                                <Gauge className="w-4 h-4" />
                                Odômetro (km)
                              </Label>
                              <Input
                                id="odometro"
                                type="text"
                                value={odometro}
                                onChange={handleOdometroChange}
                                placeholder="0"
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label>Houve Falhas?</Label>
                              <Select onValueChange={(val) => setResposta(val)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sim">Sim</SelectItem>
                                  <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {resposta === "sim" && (
                              <div>
                                <Label>Tipo de Problema</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o Problema" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="interrompimento">
                                      Interrupção
                                    </SelectItem>
                                    <SelectItem value="carga-rapida">
                                      Carga Rápida
                                    </SelectItem>
                                    <SelectItem value="energia">
                                      Queda de Energia
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <div>
                                  <Label>Descrição</Label>
                                  <Textarea className="text-sm" />
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <div className="flex items-center justify-between mt-4 gap-4">
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  className="w-full h-14"
                                >
                                  Cancelar
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                className="w-full h-14 bg-gray-800 text-lg font-bold"
                              >
                                Concluir
                              </Button>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contagem de Ônibus Livres e Carregando */}
          <section className="grid grid-cols-2 gap-3 mt-8">
            <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="text-2xl font-bold text-blue-500">
                {livres.length}
              </div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="text-2xl font-bold text-yellow-500">
                {carregando.length}
              </div>
              <div className="text-sm text-muted-foreground">Carregando</div>
            </div>
          </section>
        </div>
      </main>
      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
};

export default Abastecimento;

{
  /* Função para Passar as Etapas */
}

type Carregador = {
  UndId: number;
  EqpItmId: number;
  Carregador: string;
};

const DialogSteps = ({
  veiculo,
  iniciarCarregamento,
}: {
  veiculo: { Onibus: string };
  iniciarCarregamento: (v: { Onibus: string }) => void;
}) => {
  const [step, setStep] = useState(1);
  const [conectorSelecionado] = useState<string | null>(null);
  /* const [setOdometro] = useState(""); */
  const [formData, setFormData] = useState({
    carregador: null as number | null,
    conector: null as string | null,
    percentualInicial: "",
    odometro: "",
    odometroConfirme: "",
  });
  const [carregadores, setCarregadores] = useState<Carregador[]>([]);
  const odometroValido = formData.odometro === formData.odometroConfirme;
  const [formConfirmacao, setFormConfirmacao] = useState<
    typeof formData | null
  >(null);
  const carregadorSelecionado = carregadores.find(
    (c) => c.EqpItmId === formData.carregador
  );

  useEffect(() => {
    if (step === 4) {
      const dados = localStorage.getItem("formDataConfirmacao");
      if (dados) {
        setFormConfirmacao(JSON.parse(dados));
      }
    }
  }, [step]);

  useEffect(() => {
    const eletropostoJson = localStorage.getItem("eletropostoSelecionado");
    const eletroposto = eletropostoJson ? JSON.parse(eletropostoJson) : null;
    const UndId = eletroposto?.UndId;
    if (!UndId) return;

    fetch(`/api/carregadores?undId=${UndId}`)
      .then((r) => r.json())
      .then((data: Carregador[]) => {
        setCarregadores(data.filter((c) => c && c.EqpItmId != null));
      })
      .catch(console.error);
  }, []);

  // Aqui irá gerar o botões baseado nos carregadores
  const botoes = carregadores;

  /*
  function formatarNumero(valor: string) {
    const semLetras = valor.replace(/\D/g, ""); // aqui não irá permitir letrar, apenas números
    return semLetras.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // aqui vai formatar os números com ponto
  }
    */

  /*
  function handleOdometroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = e.target.value;
    const valorFormatado = formatarNumero(valorDigitado);
    setOdometro(valorFormatado);
  }
  */

  /*
  // Na hora de salvar no banco, irá salvar sem pontuação
  function getValorOdometroParaSalvar() {
    return odometro.replace(/\./g, "");
  }
 */

  function pegarDadosDoLocalStorage() {
    // Aqui irá pegar unidade
    const eletropostoJson = localStorage.getItem("eletropostoSelecionado");
    const eletroposto = eletropostoJson ? JSON.parse(eletropostoJson) : null;
    const UndId = eletroposto?.UndId ?? null;

    // pegar veículo que você deve salvar antes no localStorage na chave "veiculoSelecionado"
    const veiculoJson = localStorage.getItem("veiculoSelecionado");
    const veiculo = veiculoJson ? JSON.parse(veiculoJson) : null;
    const VclId = veiculo?.EqpItmId ?? null;

    // pegar usuário logado
    const usuarioJson = localStorage.getItem("usuarioLogado");
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;
    const UsrIdAlt = usuario?.UsrId ?? null;

    return { UndId, VclId, UsrIdAlt };
  }

  async function enviarRecargaInicial(formData: {
    carregador: number | null;
    conector: string | null;
    percentualInicial: string;
    odometro: string;
    odometroConfirme: string;
  }) {
    try {
      // Pegando valores do localStorage
      const { UndId, VclId, UsrIdAlt } = pegarDadosDoLocalStorage();

      if (!UndId || !VclId || !UsrIdAlt) {
        alert("Faltam dados no localStorage: UndId, VclId ou UsrIdAlt");
        return;
      }

      // Data atual para DtaIni e DtaOpe
      const agora = new Date().toISOString();

      // Montar dados para enviar
      const dadosParaEnviar = {
        UndId,
        VclId: Number(VclId),
        CrrId: formData.carregador,
        CrrCnc: formData.conector === "ambos" ? 0 : Number(formData.conector),
        DtaIni: agora,
        DtaOpe: agora,
        SocIni: Number(formData.percentualInicial),
        OdoIni: Number(formData.odometro.replace(/\./g, "")),
        UsrIdAlt,
        RcgIdOrg: 0,
        EmpId: 1,
        SttRcgId: 5,
        SttId: 1,
      };

      console.log("Dados enviados para a API:", dadosParaEnviar);

      const resposta = await fetch("/api/recarga/inicial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        alert(
          "Erro ao salvar recarga: " + (erro.error || JSON.stringify(erro))
        );
        return;
      }

      const dadosResposta = await resposta.json();
      alert("Recarga inicial criada com sucesso! ID: " + dadosResposta.RcgId);
      iniciarCarregamento(veiculo);
    } catch (error) {
      alert("Erro ao enviar recarga: " + error);
    }
  }

  return (
    // Aqui onde irá fazer todo a parte do front-end, onde vai apenas chamar lá em cima, no primeiro Return
    <>
      <div className="grid gap-4 mt-6">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Escolha um Carregador:
            </Label>
            <div className="grid grid-cols-5 gap-20">
              {botoes
                .filter(
                  (item): item is Carregador => !!item && item.EqpItmId != null
                )
                .map((item) => (
                  <Button
                    key={item.EqpItmId}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        carregador: item.EqpItmId,
                      }))
                    }
                    className={`inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-20 w-20 bg-blue-500 text-white ${
                      formData.carregador === item.EqpItmId
                        ? "bg-gray-500 text-white"
                        : "bg-blue-500"
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
                  onClick={() => setFormData((prev) => ({ ...prev, conector }))}
                  className={`inline-flex items-center justify-center rounded-full text-base font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-blue-500 text-white ${
                    conectorSelecionado === conector
                      ? "bg-gray-500 text-white"
                      : "bg-blue-500"
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
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                Percentual Inicial (%):
              </Label>
              <Input
                id="percentual"
                type="number"
                value={formData.percentualInicial}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    percentualInicial: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Odômetro (km):
              </Label>
              <Input
                id="odometro"
                type="text"
                value={formData.odometro}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, odometro: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Confirme o Odômetro (km):
              </Label>
              <Input
                id="odometroConfirme"
                type="text"
                value={formData.odometroConfirme}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    odometroConfirme: e.target.value,
                  }))
                }
                placeholder="0"
              />
              {!odometroValido && (
                <p className="text-red-600 text-sm mt-1">
                  Os odômetros devem ser iguais
                </p>
              )}
            </div>
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
              variant="outline"
              className="w-full h-14"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          ) : (
            <DialogClose asChild>
              <Button variant="outline" className="w-full h-14">
                Cancelar
              </Button>
            </DialogClose>
          )}

          {step < 4 ? (
            <Button
              type="button"
              className="w-full h-14 bg-blue-500 text-lg font-bold"
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
                  const odometroValido =
                    formData.odometro === formData.odometroConfirme;
                  if (!odometroValido) {
                    alert("Os odômetros não coincidem.");
                    return;
                  }
                  // Salva os dados no localStorage antes de ir para step 4
                  localStorage.setItem(
                    "formDataConfirmacao",
                    JSON.stringify(formData)
                  );
                }

                setStep(step + 1);
              }}
            >
              Próximo
            </Button>
          ) : (
            // Botão Carregar na step 4
            <Button
              type="submit"
              onClick={() => {
                if (!formConfirmacao) {
                  alert("Nenhum dado para enviar");
                  return;
                }
                enviarRecargaInicial(formConfirmacao);
              }}
              className="w-full h-14 bg-blue-500 text-lg font-bold"
            >
              Carregar
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
};
