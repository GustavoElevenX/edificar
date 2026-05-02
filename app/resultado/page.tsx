"use client";

import { Gift, HeartHandshake, Share2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MomentBlocks } from "@/components/MomentBlocks";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";
import type { MomentResult } from "@/lib/content";

function ResultContent() {
  const params = useSearchParams();
  const { session } = useAuth();
  const theme = params.get("tema") ?? "";
  const [storedResult, setStoredResult] = useState<MomentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("edificar:lastMoment");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MomentResult;
        if (!theme || parsed.selectedTheme === theme) {
          setStoredResult(parsed);
        }
      } catch {
        setStoredResult(null);
      }
    }
  }, [theme]);

  useEffect(() => {
    if (storedResult || !theme || !session) return;

    setLoading(true);
    setError("");
    postJson<{ inputText: string; selectedTheme: string }, { result: MomentResult }>(
      "/api/moments",
      { inputText: "", selectedTheme: theme },
      session
    )
      .then((response) => {
        setStoredResult(response.result);
        localStorage.setItem("edificar:lastMoment", JSON.stringify(response.result));
      })
      .catch((apiError) => {
        setError(
          apiError instanceof Error
            ? apiError.message
            : "Não foi possível gerar este caminho agora."
        );
      })
      .finally(() => setLoading(false));
  }, [session, storedResult, theme]);

  const result = useMemo(() => storedResult, [storedResult]);

  const share = async () => {
    if (!result) return;

    const text = `${result.title}\nReferencia: ${result.reference}\n\n${result.reflection}\n\n${result.practice}`;
    if (navigator.share) {
      await navigator.share({ title: "Meu momento com Deus", text });
      return;
    }

    await navigator.clipboard.writeText(text);
  };

  if (loading || !result) {
    return (
      <main className="page">
        <section className="section">
          <p className="eyebrow">Seu momento com Deus</p>
          <h1>Gerando sua reflexão...</h1>
          <p className="lead">
            Estamos preparando a Palavra, a reflexão, a oração, a pergunta e a
            prática do dia.
          </p>
          {error ? <p className="status error">{error}</p> : null}
          {!theme && !loading ? (
            <div className="actions">
              <Link className="button" href="/momento">
                Começar meu momento com Deus
              </Link>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Seu momento com Deus</p>
            <h1>{result.title}</h1>
          </div>
          <p>
            Leia devagar. A proposta não é resolver tudo de uma vez, mas voltar
            o coração para Deus antes de continuar.
          </p>
        </div>

        <MomentBlocks result={result} />

        <div className="actions" style={{ marginTop: 22 }}>
          <Link className="button" href="/momento">
            <HeartHandshake size={18} />
            Fazer outro momento
          </Link>
          <Link className="button secondary" href="/receber-diario">
            Receber momentos diarios
          </Link>
          <button className="button secondary" onClick={share} type="button">
            <Share2 size={18} />
            Compartilhar
          </button>
          <Link className="button secondary" href="/apoiar">
            <Gift size={18} />
            Apoiar a missão
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <RequireAuth>
      <ResultContent />
    </RequireAuth>
  );
}
