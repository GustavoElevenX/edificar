"use client";

import { Gift } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";

const amounts = [10, 25, 50, 100];

function SupportContent() {
  const { session, user } = useAuth();
  const [donorName, setDonorName] = useState(user?.user_metadata?.name ?? "");
  const [donorEmail, setDonorEmail] = useState(user?.email ?? "");
  const [amount, setAmount] = useState<number | "custom">(25);
  const [customAmount, setCustomAmount] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const finalAmount = amount === "custom" ? Number(customAmount) : amount;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("Registrando apoio...");

    if (!finalAmount || finalAmount <= 0) {
      setStatus("");
      setError("Informe um valor válido para apoiar a missão.");
      return;
    }

    try {
      const response = await postJson<
        {
          donorName: string;
          donorEmail: string;
          amount: number;
          paymentStatus: string;
        },
        { ok: boolean; checkoutUrl?: string | null }
      >(
        "/api/donations",
        {
          donorName,
          donorEmail,
          amount: finalAmount,
          paymentStatus: "pending"
        },
        session
      );

      if (response.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
        return;
      }

      setStatus("Apoio registrado. O checkout será aberto quando o provedor de pagamento estiver configurado.");
    } catch (apiError) {
      setStatus("");
      setError(apiError instanceof Error ? apiError.message : "Não foi possível registrar.");
    }
  };

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Apoiar a Missão</p>
            <h1>Ajude a manter o Edificar gratuito</h1>
          </div>
          <p>
            O Edificar nasceu para ajudar empresários a se aproximarem de Deus
            todos os dias. Sua contribuição ajuda a manter e expandir a missão.
          </p>
        </div>

        <div className="moment-layout">
          <article className="soft-panel">
            <h2>A plataforma é gratuita e continuará gratuita.</h2>
            <p className="lead">
              As contribuições voluntárias ajudam a cobrir custos de tecnologia,
              manutenção, desenvolvimento, envio de mensagens e futuras ações de
              doação. Contribuir não libera acesso especial à presença de Deus e
              não traz promessa espiritual, financeira ou religiosa em troca.
            </p>
            <p className="helper">
              Fluxo recomendado: conectar um provedor de pagamento, abrir o
              checkout, receber a confirmação por webhook e redirecionar a pessoa
              para uma página de agradecimento.
            </p>
          </article>

          <form className="form-panel" onSubmit={handleSubmit}>
            <p className="eyebrow">Doação voluntária</p>
            <div className="donation-options">
              {amounts.map((option) => (
                <button
                  className={amount === option ? "chip selected" : "chip"}
                  key={option}
                  onClick={() => setAmount(option)}
                  type="button"
                >
                  R${option}
                </button>
              ))}
              <button
                className={amount === "custom" ? "chip selected" : "chip"}
                onClick={() => setAmount("custom")}
                type="button"
              >
                Valor livre
              </button>
            </div>
            {amount === "custom" ? (
              <label className="field">
                <span>Valor</span>
                <input
                  min="1"
                  onChange={(event) => setCustomAmount(event.target.value)}
                  type="number"
                  value={customAmount}
                />
              </label>
            ) : null}
            <label className="field">
              <span>Nome opcional</span>
              <input onChange={(event) => setDonorName(event.target.value)} value={donorName} />
            </label>
            <label className="field">
              <span>E-mail opcional</span>
              <input
                onChange={(event) => setDonorEmail(event.target.value)}
                type="email"
                value={donorEmail}
              />
            </label>
            {error ? <p className="status error">{error}</p> : null}
            {status ? <p className="status success">{status}</p> : null}
            <button className="button full" type="submit">
              <Gift size={18} />
              Apoiar a missão
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function SupportPage() {
  return (
    <RequireAuth>
      <SupportContent />
    </RequireAuth>
  );
}
