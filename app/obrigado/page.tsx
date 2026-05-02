import { HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="page">
      <section className="section">
        <article className="soft-panel">
          <p className="eyebrow">Obrigado por apoiar</p>
          <h1>Sua contribuição ajuda o Edificar a continuar gratuito.</h1>
          <p className="lead">
            Que Deus abençoe sua generosidade. Essa contribuição não compra favor
            espiritual nem libera benefício religioso; ela apenas ajuda essa
            missão a alcançar mais pessoas com uma pausa de fé, oração e reflexão.
          </p>
          <div className="actions">
            <Link className="button" href="/">
              <HeartHandshake size={18} />
              Voltar ao Edificar
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
