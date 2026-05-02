"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFriendlyAuthError } from "@/lib/auth/messages";
import { getAuthConfigError, getSupabaseClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("Criando sua conta...");

    const configError = getAuthConfigError();
    if (configError) {
      setStatus("");
      setError(configError);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (signUpError) {
        setStatus("");
        setError(getFriendlyAuthError(signUpError.message));
        return;
      }

      if (signUpData.session) {
        router.replace("/");
        return;
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!signInError && signInData.session) {
        router.replace("/");
        return;
      }
    } catch {
      setStatus("");
      setError("Não foi possível criar sua conta agora. Confira a configuração de autenticação e tente novamente.");
      return;
    }

    setStatus("Conta criada. Confirme seu e-mail para entrar.");
  };

  return (
    <main className="page auth-page">
      <section className="auth-copy">
        <p className="eyebrow">Criar conta</p>
        <h1>Um espaço simples para voltar o coração para Deus.</h1>
        <p className="lead">
          O cadastro permite manter sua sessão ativa neste dispositivo e preparar
          o caminho para recursos futuros, sem transformar a experiência em
          dashboard ou cobrança.
        </p>
      </section>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Registro</p>
          <h2>Criar conta</h2>
        </div>
        <label className="field">
          <span>Nome</span>
          <input
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            required
            type="text"
            value={name}
          />
        </label>
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
            autoComplete="new-password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error ? <p className="status error">{error}</p> : null}
        {status ? <p className="status success">{status}</p> : null}
        <button className="button full" type="submit">
          <UserPlus size={18} />
          Criar conta gratuita
        </button>
        <p className="helper">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
