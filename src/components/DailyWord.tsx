"use client";

import { BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MomentResult } from "@/lib/content";

export function DailyWord() {
  const [result, setResult] = useState<MomentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/daily-moment", { method: "POST" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Não foi possível gerar.");
        return payload.result as MomentResult;
      })
      .then((dailyResult) => {
        if (!active) return;
        setResult(dailyResult);
      })
      .catch((dailyError) => {
        if (!active) return;
        setError(dailyError instanceof Error ? dailyError.message : "Não foi possível gerar.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <article className="soft-panel">
      <p className="eyebrow">Palavra de hoje</p>
      {loading ? (
        <p className="lead">
          <Loader2 className="spin inline-icon" size={18} />
          Gerando uma reflexão para hoje...
        </p>
      ) : error ? (
        <>
          <h2>Antes de pedir mais, agradeça.</h2>
          <p className="lead">{error}</p>
        </>
      ) : result ? (
        <>
          <h2>{result.title}</h2>
          <p className="lead">{result.introduction}</p>
          <div className="actions">
            <Link
              className="button secondary"
              href={`/resultado?tema=${encodeURIComponent(result.selectedTheme)}`}
              onClick={() =>
                localStorage.setItem("edificar:lastMoment", JSON.stringify(result))
              }
            >
              <BookOpen size={18} />
              Ler momento completo
            </Link>
          </div>
        </>
      ) : null}
    </article>
  );
}
