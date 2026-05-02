"use client";

import { MailCheck } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { postJson } from "@/lib/api";

const interestOptions = [
  "Deus no centro",
  "Gratidão",
  "Família",
  "Liderança",
  "Sabedoria",
  "Dinheiro e coração",
  "Tribulações",
  "Clareza e decisões"
];

function ReceiveDailyContent() {
  const { session, user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [whatsapp, setWhatsapp] = useState("");
  const [preferredChannel, setPreferredChannel] = useState("email");
  const [preferredTime, setPreferredTime] = useState("07:00");
  const [interests, setInterests] = useState<string[]>(["Deus no centro"]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("Salvando sua inscrição...");

    try {
      await postJson(
        "/api/daily-subscribers",
        { name, email, whatsapp, preferredChannel, preferredTime, interests },
        session
      );
      setStatus("Inscrição salva. Quando o envio diário for ativado, você receberá neste canal.");
    } catch (apiError) {
      setStatus("");
      setError(apiError instanceof Error ? apiError.message : "Não foi possível salvar.");
    }
  };

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Receber Diário</p>
            <h1>Receba um momento com Deus todos os dias</h1>
          </div>
          <p>
            Uma Palavra, uma reflexão, uma oração, uma pergunta e uma prática
            para começar o dia com Deus no centro.
          </p>
        </div>

        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="grid two">
            <label className="field">
              <span>Nome</span>
              <input onChange={(event) => setName(event.target.value)} required value={name} />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="field">
              <span>WhatsApp opcional</span>
              <input onChange={(event) => setWhatsapp(event.target.value)} value={whatsapp} />
            </label>
            <label className="field">
              <span>Horário preferido</span>
              <input
                onChange={(event) => setPreferredTime(event.target.value)}
                type="time"
                value={preferredTime}
              />
            </label>
            <label className="field">
              <span>Canal preferido</span>
              <select
                onChange={(event) => setPreferredChannel(event.target.value)}
                value={preferredChannel}
              >
                <option value="email">E-mail</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="ambos">Ambos</option>
              </select>
            </label>
          </div>

          <div>
            <p className="eyebrow">Temas de interesse</p>
            <div className="theme-row" style={{ marginTop: 10 }}>
              {interestOptions.map((interest) => (
                <button
                  className={interests.includes(interest) ? "chip selected" : "chip"}
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  type="button"
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="status error">{error}</p> : null}
          {status ? <p className="status success">{status}</p> : null}

          <button className="button" type="submit">
            <MailCheck size={18} />
            Quero receber gratuitamente
          </button>
        </form>
      </section>
    </main>
  );
}

export default function ReceiveDailyPage() {
  return (
    <RequireAuth>
      <ReceiveDailyContent />
    </RequireAuth>
  );
}
