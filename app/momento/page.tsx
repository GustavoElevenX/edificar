"use client";

import { HeartHandshake, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";
import { quickThemes, type MomentResult } from "@/lib/content";

type MomentResponse = {
  result: MomentResult;
};

function MomentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { session } = useAuth();
  const initialTheme = useMemo(() => params.get("tema") ?? "", [params]);
  const [text, setText] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setError("");

    if (!text.trim() && !selectedTheme) {
      setError("Escreva como está seu coração ou escolha um tema.");
      return;
    }

    setLoading(true);

    try {
      const response = await postJson<
        { inputText: string; selectedTheme: string },
        MomentResponse
      >(
        "/api/moments",
        {
          inputText: text,
          selectedTheme
        },
        session
      );

      localStorage.setItem("edificar:lastMoment", JSON.stringify(response.result));
      router.push("/resultado");
    } catch (apiError) {
      setError(
        apiError instanceof Error
          ? apiError.message
          : "Não foi possível gerar o momento agora."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Meu Momento</p>
            <h1>Conte a Deus como está o seu coração hoje.</h1>
          </div>
          <p>
            Escreva com sinceridade. Pode ser sobre sua fé, sua família, sua
            rotina, suas decisões, sua liderança, seus desafios ou sua gratidão.
          </p>
        </div>

        <div className="moment-layout">
          <form className="form-panel" onSubmit={handleGenerate}>
            <label className="field">
              <span>Como você está hoje?</span>
              <textarea
                onChange={(event) => setText(event.target.value)}
                placeholder="Exemplo: Tenho trabalhado muito, pensado demais em dinheiro e sinto que estou deixando Deus e minha família em segundo plano..."
                value={text}
              />
            </label>

            {selectedTheme ? (
              <p className="helper">Tema selecionado: {selectedTheme}</p>
            ) : null}
            {error ? <p className="status error">{error}</p> : null}

            <button className="button full" disabled={loading} type="submit">
              {loading ? <Loader2 className="spin" size={18} /> : <HeartHandshake size={18} />}
              Gerar meu momento com Deus
            </button>
          </form>

          <aside className="soft-panel">
            <p className="eyebrow">Temas rápidos</p>
            <h2>Ou escolha um tema</h2>
            <div className="theme-row">
              {quickThemes.map((theme) => (
                <button
                  className={theme === selectedTheme ? "chip selected" : "chip"}
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  type="button"
                >
                  {theme}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function MomentPage() {
  return (
    <RequireAuth>
      <MomentContent />
    </RequireAuth>
  );
}
