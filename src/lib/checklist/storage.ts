export function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem("usuarioLogado");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getTurnoAtual() {
  try {
    const raw = localStorage.getItem("turnoAtual");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getEletropostoSelecionado() {
  try {
    const raw = localStorage.getItem("eletropostoSelecionado");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setVeiculoSelecionado(veiculo: unknown) {
  localStorage.setItem("veiculoSelecionado", JSON.stringify(veiculo));
}
