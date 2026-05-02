import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { categories } from "@/lib/content";

function CaminhosContent() {
  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Caminhos</p>
            <h1>Caminhos para voltar ao centro</h1>
          </div>
          <p>
            Escolha um tema para refletir, orar e caminhar com Deus em meio à
            sua rotina.
          </p>
        </div>

        <div className="grid">
          {categories.map((category) => (
            <section className="soft-panel" key={category.name}>
              <p className="eyebrow">{category.name}</p>
              <div className="grid three">
                {category.themes.map((theme) => (
                  <Link
                    className="card"
                    href={`/resultado?tema=${encodeURIComponent(theme.title)}`}
                    key={theme.title}
                  >
                    <h3>{theme.title}</h3>
                    <p>{theme.description}</p>
                    <ArrowRight size={17} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function CaminhosPage() {
  return (
    <RequireAuth>
      <CaminhosContent />
    </RequireAuth>
  );
}
