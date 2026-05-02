export function getFriendlyAuthError(message?: string) {
  const normalized = (message ?? "").toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos.";
  }

  if (normalized.includes("already registered") || normalized.includes("user already")) {
    return "Já existe uma conta com este e-mail.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }

  if (normalized.includes("password")) {
    return "A senha precisa atender aos requisitos mínimos.";
  }

  return "Não foi possível concluir esta ação agora. Tente novamente em instantes.";
}
