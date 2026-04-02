export type Tipo = {
  PsqTpoId: number;
  PsqTpo: string;
};

export type Pergunta = {
  PsqTpoId: number;
  PsqPrgId: number;
  Pergunta: string;
  Sequencia?: number;
};

export type EletropostoAPI = {
  UndId: number;
  PostoRecarga: string;
};

export type VeiculoAPI = {
  EqpItmId: number;
  Onibus: string;
  UndId: number;
};

export type CarregadorAPI = {
  UndId: number;
  EqpItmId: number;
  Carregador: string;
};

export type RespostaWizard = {
  PsqPrgId: number;
  resposta: "SIM" | "NAO" | null;
  justificativa: string;
};

export type Step =
  | "ASSUNTO"
  | "ELETROPOSTO"
  | "CARREGADOR"
  | "VEICULO"
  | "PERGUNTAS"
  | "CONCLUIDO";

export type FotosPorPergunta = Record<number, File[]>;
