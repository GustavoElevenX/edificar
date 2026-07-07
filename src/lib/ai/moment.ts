import type { MomentResult } from "@/lib/content";

type GenerateMomentInput = {
  inputText?: string;
  selectedTheme?: string;
  mode?: "moment" | "daily";
};

const fallbackModel = "gpt-5.2";
export const EDIFICAR_PROMPT_VERSION = "edificar-moment-v1";

export function getContentModelName() {
  return process.env.AI_MODEL || fallbackModel;
}

const momentJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "introduction",
    "reference",
    "biblePassage",
    "reflection",
    "prayer",
    "question",
    "practice",
    "selectedTheme"
  ],
  properties: {
    title: { type: "string" },
    introduction: { type: "string" },
    reference: { type: "string" },
    biblePassage: { type: "string" },
    reflection: { type: "string" },
    prayer: { type: "string" },
    question: { type: "string" },
    practice: { type: "string" },
    selectedTheme: { type: "string" }
  }
};

const instructions = `
Você é um guia cristão de reflexão para empresários, profissionais, empreendedores e líderes.

Sua missão é ajudar a pessoa a se aproximar de Deus, refletir com sinceridade,
orar e viver com mais gratidão, sabedoria, humildade, paz e propósito.

Regras obrigatórias:
- Responda sempre em português do Brasil, com acentos corretos e linguagem natural.
- Nunca prometa crescimento financeiro, cura, sucesso, vitória ou solução de problemas.
- Nunca diga que Deus mandou a pessoa tomar uma decisão específica.
- Nunca trate oração como ferramenta para ganhar dinheiro.
- Nunca use linguagem de coach, teologia da prosperidade ou culpa agressiva.
- Nunca mencione inteligência artificial para o usuário.
- Em decisões sensíveis, recomende orar, refletir e buscar conselho maduro/profissional.
- A passagem bíblica deve ser escolhida por você e conectada ao tema.
- Para evitar problema de direitos autorais, escreva uma paráfrase própria da passagem, sem copiar uma tradução bíblica protegida.
- Retorne apenas JSON válido, sem markdown, obedecendo exatamente ao schema solicitado.

Formato JSON exato:
{
  "title": "título curto",
  "introduction": "introdução acolhedora",
  "reference": "referência bíblica",
  "biblePassage": "paráfrase própria da passagem escolhida",
  "reflection": "reflexão cristã conectada à vida de empresários e profissionais",
  "prayer": "oração simples, sincera e cristã",
  "question": "pergunta de consciência",
  "practice": "prática do dia",
  "selectedTheme": "tema principal identificado"
}
`;

async function getClient() {
  if (!process.env.AI_API_KEY || process.env.AI_API_KEY.includes("SUA_CHAVE")) {
    throw new Error("A geração de conteúdo ainda não foi configurada.");
  }

  const providerModule = await import("open" + "ai");
  const ContentProvider = providerModule.default;

  return new ContentProvider({
    apiKey: process.env.AI_API_KEY
  });
}

function parseMomentResult(output: string): MomentResult {
  const cleaned = output
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<MomentResult>;
  const requiredFields: (keyof MomentResult)[] = [
    "title",
    "introduction",
    "reference",
    "biblePassage",
    "reflection",
    "prayer",
    "question",
    "practice",
    "selectedTheme"
  ];

  for (const field of requiredFields) {
    if (!parsed[field] || typeof parsed[field] !== "string") {
      throw new Error(`Resposta gerada sem o campo ${field}.`);
    }
  }

  return parsed as MomentResult;
}

export async function generateMomentWithAI({
  inputText,
  selectedTheme,
  mode = "moment"
}: GenerateMomentInput): Promise<MomentResult> {
  const client = await getClient();
  const model = getContentModelName();
  const context =
    mode === "daily"
      ? "Gere a Palavra de hoje para a página inicial do Edificar."
      : "Gere o momento com Deus a partir do que o usuário informou.";

  const response = await client.responses.create({
    model,
    instructions,
    text: {
      format: {
        type: "json_schema",
        name: "edificar_moment",
        description: "Conteúdo espiritual gerado para a plataforma Edificar.",
        strict: true,
        schema: momentJsonSchema
      }
    },
    metadata: {
      feature: mode,
      prompt_version: EDIFICAR_PROMPT_VERSION
    },
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `${context}\n\nTema selecionado: ${selectedTheme || "não informado"}\nTexto do usuário: ${
              inputText || "não informado"
            }`
          }
        ]
      }
    ]
  });

  return parseMomentResult(response.output_text);
}
