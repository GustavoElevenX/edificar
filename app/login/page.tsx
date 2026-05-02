"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getFriendlyAuthError } from "@/lib/auth/messages";
import { getAuthConfigError, getSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const redirect = params.get("redirect") || "/momento";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [loading, redirect, router, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("Entrando...");

    const configError = getAuthConfigError();
    if (configError) {
      setStatus("");
      setError(configError);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setStatus("");
        setError(getFriendlyAuthError(signInError.message));
        return;
      }
    } catch {
      setStatus("");
      setError("Não foi possível entrar agora. Confira a configuração de autenticação e tente novamente.");
      return;
    }

    router.replace(redirect);
  };

  return (
    <main className="page auth-page">
      <section className="auth-copy">
        <p className="eyebrow">Entrar no Edificar</p>
        <h1>Sua pausa com Deus pode continuar de onde parou.</h1>
        <p className="lead">
          A sessão fica salva neste dispositivo. Você só precisará entrar
          novamente se sair da conta, limpar o navegador ou usar outro dispositivo.
        </p>
      </section>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Login</p>
          <h2>Entrar</h2>
        </div>
        <label className="field">
          <span>E-mail</span>
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label className="field">
          <span>Senha</span>
          <input
            autoComplete="current-password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error ? <p className="status error">{error}</p> : null}
        {status ? <p className="status">{status}</p> : null}
        <button className="button full" type="submit">
          <LogIn size={18} />
          Entrar
        </button>
        <p className="helper">
          Ainda não tem conta? <Link href="/registro">Criar conta gratuita</Link>
        </p>
      </form>
    </main>
  );
}
