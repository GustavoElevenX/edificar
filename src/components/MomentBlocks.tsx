import type { MomentResult } from "@/lib/content";

export function MomentBlocks({ result }: { result: MomentResult }) {
  const blocks = [
    ["Introdução", result.introduction],
    ["Palavra para refletir", `Referência: ${result.reference}`],
    ["Passagem", result.biblePassage],
    ["Reflexão", result.reflection],
    ["Oração", result.prayer],
    ["Pergunta de consciência", result.question],
    ["Prática do dia", result.practice]
  ];

  return (
    <div className="moment-result-grid">
      {blocks.map(([title, body]) => (
        <section className="soft-panel result-block" key={title}>
          <p className="eyebrow">{title}</p>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}
