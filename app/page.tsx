"use client";

import {
  ArrowRight,
  BookOpen,
  Gift,
  HeartHandshake,
  LogIn,
  Mail,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DailyWord } from "@/components/DailyWord";
import { useAuth } from "@/components/AuthProvider";
import { heartStates } from "@/lib/content";

const bibleMessages = [
  {
    reference: "Mateus 6:33",
    title: "Busque primeiro o Reino",
    text: "Antes das metas, das decisões e dos números, volte seu coração para Deus e permita que Ele organize suas prioridades."
  },
  {
    reference: "Tiago 1:5",
    title: "Peça sabedoria",
    text: "Quando faltar clareza, ore com humildade. Deus não chama você a decidir sozinho, movido apenas por pressa ou medo."
  }
];

function PublicHome() {
  return (
    <main className="page">
      <section className="hero public-hero">
        <div className="hero-copy">
          <div className="hero-brand" aria-label="Edificar">
            <Image src="/edificar-logo.png" width={58} height={58} alt="" priority />
            <span>Edificar</span>
          </div>
          <h1>Empreender exige muito. Não caminhe longe de Deus.</h1>
          <p className="lead">
            Um espaço cristão para empresários pausarem, orarem, refletirem e
            lembrarem que nenhuma conquista vale uma vida distante de Deus, da
            família, da gratidão e do propósito.
          </p>
          <div className="actions">
            <Link className="button" href="/login">
              <LogIn size={19} />
              Entrar
            </Link>
            <Link className="button secondary" href="/registro">
              Criar conta gratuita
            </Link>
          </div>
        </div>
        <div className="hero-media" aria-label="Ambiente sereno de oração pela manhã" />
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Pausa diária</p>
            <h2>Um lugar simples para voltar ao centro</h2>
          </div>
          <p>
            No Edificar, você escreve como está o coração e recebe uma Palavra,
            uma reflexão, uma oração, uma pergunta de consciência e uma prática
            simples para o dia.
          </p>
        </div>
        <div className="grid three">
          <article className="card">
            <BookOpen size={22} />
            <h3>Palavra e reflexão</h3>
            <p>Conteúdos cristãos conectados à rotina de quem lidera e empreende.</p>
          </article>
          <article className="card">
            <HeartHandshake size={22} />
            <h3>Oração sincera</h3>
            <p>Um convite à humildade, gratidão, sabedoria e reconexão com Deus.</p>
          </article>
          <article className="card">
            <Sparkles size={22} />
            <h3>Prática do dia</h3>
            <p>Uma atitude simples para viver com mais presença, fé e propósito.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="grid two">
          {bibleMessages.map((message) => (
            <article className="soft-panel" key={message.reference}>
              <p className="eyebrow">{message.reference}</p>
              <h2>{message.title}</h2>
              <p className="lead">{message.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="soft-panel mission-panel">
          <div>
            <p className="eyebrow">Missão gratuita</p>
            <h2>Sem plano obrigatório, sem promessa financeira, sem paywall espiritual.</h2>
            <p className="lead">
              O Edificar é gratuito. A missão é ajudar empresários a caminharem
              com mais Deus, família, paz, sabedoria e caráter.
            </p>
          </div>
          <div className="actions">
            <Link className="button" href="/login">
              Começar agora
            </Link>
            <Link className="button secondary" href="/apoiar">
              <Gift size={18} />
              Apoiar a missão
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function MemberHome() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Deus no centro da jornada</p>
          <h1>Antes de continuar, volte para Deus.</h1>
          <p className="lead">
            Faça uma pausa honesta, entregue o peso do dia e caminhe com fé,
            humildade e sabedoria.
          </p>
          <div className="actions">
            <Link className="button" href="/momento">
              <HeartHandshake size={19} />
              Começar meu momento com Deus
            </Link>
            <Link className="button secondary" href="/receber-diario">
              <Mail size={19} />
              Receber reflexão diária
            </Link>
          </div>
        </div>
        <div className="hero-media" aria-label="Ambiente sereno de oração pela manhã" />
      </section>

      <section className="section">
        <div className="grid two">
          <DailyWord />
          <article className="soft-panel">
            <p className="eyebrow">Lembrete</p>
            <h2>Nenhum crescimento vale uma vida distante de Deus.</h2>
            <p className="lead">
              O Edificar não promete resultados financeiros. Ele existe para te
              ajudar a voltar o coração para Deus, com gratidão, família,
              sabedoria e paz.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Pausa sincera</p>
            <h2>Como está seu coração hoje?</h2>
          </div>
          <p>
            Escolha uma palavra para começar. Ela será levada para seu momento
            com Deus.
          </p>
        </div>
        <div className="grid four">
          {heartStates.map((state) => (
            <Link className="card" key={state} href={`/momento?tema=${encodeURIComponent(state)}`}>
              <h3>{state}</h3>
              <p>Começar uma reflexão a partir deste estado.</p>
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="auth-loading">
        <span>Preparando seu espaço...</span>
      </main>
    );
  }

  return user ? <MemberHome /> : <PublicHome />;
}
