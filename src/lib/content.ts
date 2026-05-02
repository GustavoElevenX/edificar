export type MomentResult = {
  title: string;
  introduction: string;
  reference: string;
  biblePassage: string;
  reflection: string;
  prayer: string;
  question: string;
  practice: string;
  selectedTheme: string;
};

export type ThemeCard = {
  category: string;
  title: string;
  description: string;
};

type ThemeBase = {
  keywords: string[];
  title: string;
  reference: string;
  introduction: string;
  reflection: string;
  prayer: string;
  question: string;
  practice: string;
};

export const heartStates = [
  "Grato",
  "Em paz",
  "Distante de Deus",
  "Cansado",
  "Ansioso",
  "Precisando de direção",
  "Pensando muito em dinheiro",
  "Preocupado com a família",
  "Passando por tribulação",
  "Querendo agradecer"
];

export const quickThemes = [
  "Quero voltar para Deus",
  "Preciso agradecer mais",
  "Estou distante de Deus",
  "Estou ansioso",
  "Estou cansado",
  "Preciso de sabedoria",
  "Estou pensando muito em dinheiro",
  "Quero cuidar melhor da minha família",
  "Estou passando por tribulação",
  "Quero liderar com mais humildade",
  "Preciso de clareza",
  "Quero ser uma pessoa melhor"
];

export const categories: { name: string; themes: ThemeCard[] }[] = [
  {
    name: "Deus no centro",
    themes: [
      {
        category: "Deus no centro",
        title: "Quando você se afastou de Deus",
        description: "Um convite para reorganizar o coração sem culpa pesada."
      },
      {
        category: "Deus no centro",
        title: "Quando a rotina engoliu sua fé",
        description: "Pausar antes que a pressa decida o tom do dia."
      },
      {
        category: "Deus no centro",
        title: "Quando precisa voltar ao primeiro amor",
        description: "Lembrar que Deus não deve ficar nas sobras da agenda."
      }
    ]
  },
  {
    name: "Gratidão",
    themes: [
      {
        category: "Gratidão",
        title: "Quando você esqueceu de agradecer",
        description: "Reconhecer o que Deus já sustentou até aqui."
      },
      {
        category: "Gratidão",
        title: "Quando uma bênção virou algo comum",
        description: "Recuperar sensibilidade para as pequenas misericórdias."
      },
      {
        category: "Gratidão",
        title: "Quando você só olha para o que falta",
        description: "Olhar para a vida com humildade e contentamento."
      }
    ]
  },
  {
    name: "Família",
    themes: [
      {
        category: "Família",
        title: "Quando sua família só recebe seu cansaço",
        description: "Voltar a estar presente com amor e mansidão."
      },
      {
        category: "Família",
        title: "Quando o trabalho está tomando tudo",
        description: "Reavaliar prioridades diante de Deus."
      },
      {
        category: "Família",
        title: "Quando quer liderar sua casa com amor",
        description: "Cuidar da casa antes de tentar vencer o mundo."
      }
    ]
  },
  {
    name: "Dinheiro e coração",
    themes: [
      {
        category: "Dinheiro e coração",
        title: "Quando o dinheiro ocupa espaço demais",
        description: "Trabalhar com responsabilidade sem entregar o coração."
      },
      {
        category: "Dinheiro e coração",
        title: "Quando o resultado virou identidade",
        description: "Separar valor pessoal de números e reconhecimento."
      },
      {
        category: "Dinheiro e coração",
        title: "Quando a comparação te domina",
        description: "Sair da pressa de medir a própria vida pela dos outros."
      }
    ]
  },
  {
    name: "Liderança e caráter",
    themes: [
      {
        category: "Liderança e caráter",
        title: "Quando você precisa liderar com humildade",
        description: "Ser exemplo antes de cobrar dos outros."
      },
      {
        category: "Liderança e caráter",
        title: "Quando está tratando pessoas com impaciência",
        description: "Permitir que a fé alcance o jeito de liderar."
      },
      {
        category: "Liderança e caráter",
        title: "Quando o orgulho começa a aparecer",
        description: "Voltar ao lugar de servo diante de Deus."
      }
    ]
  },
  {
    name: "Tribulações",
    themes: [
      {
        category: "Tribulações",
        title: "Quando tudo parece pesado",
        description: "Respirar, orar e caminhar sem decidir movido pelo medo."
      },
      {
        category: "Tribulações",
        title: "Quando você está ansioso",
        description: "Entregar a pressa e buscar a paz que vem de Deus."
      },
      {
        category: "Tribulações",
        title: "Quando está com medo",
        description: "Confiar sem fingir que a dor não existe."
      }
    ]
  },
  {
    name: "Clareza e decisões",
    themes: [
      {
        category: "Clareza e decisões",
        title: "Antes de uma decisão importante",
        description: "Orar, avaliar e procurar conselhos maduros."
      },
      {
        category: "Clareza e decisões",
        title: "Quando você está confuso",
        description: "Buscar sabedoria sem pressa e sem orgulho."
      },
      {
        category: "Clareza e decisões",
        title: "Quando está tentando controlar tudo sozinho",
        description: "Reconhecer limites e depender de Deus com humildade."
      }
    ]
  }
];

const bases: ThemeBase[] = [
  {
    keywords: ["agradecer", "gratidão", "grato", "bênção", "falta"],
    title: "Quando você esquece de agradecer",
    reference: "1 Tessalonicenses 5:18",
    introduction:
      "Talvez a rotina tenha feito você olhar primeiro para o próximo problema. Este momento é um convite simples: antes de pedir mais, reconhecer o que Deus já sustentou.",
    reflection:
      "Empreender pode acostumar o coração a viver no futuro: a próxima meta, a próxima conta, a próxima decisão. Mas aquilo que hoje parece comum talvez tenha sido motivo de oração no passado. A gratidão não ignora responsabilidades; ela recoloca Deus acima da pressa.",
    prayer:
      "Senhor, abre meus olhos para reconhecer Tua bondade neste dia. Perdoa-me quando vivo apenas pedindo e quase não agradeço. Ensina-me a caminhar com contentamento, humildade e um coração atento ao que Tu já fizeste. Amém.",
    question: "O que você tem hoje que um dia pediu a Deus?",
    practice: "Antes de pedir qualquer coisa hoje, escreva três motivos sinceros de gratidão."
  },
  {
    keywords: ["dinheiro", "resultado", "meta", "comparação", "prosperidade", "financeiro"],
    title: "Quando o dinheiro ocupa espaço demais",
    reference: "Mateus 6:24",
    introduction:
      "Se o dinheiro tem tomado mais espaço do que deveria, este não é um chamado para abandonar responsabilidades. É um convite para reorganizar o coração diante de Deus.",
    reflection:
      "O dinheiro é necessário, mas se torna perigoso quando passa a definir segurança, identidade e valor. Muitos começam querendo cuidar da família e construir algo bom; aos poucos, o resultado pode ocupar o lugar da confiança. Deus não cabe nas sobras do coração.",
    prayer:
      "Senhor, ajuda-me a trabalhar com excelência sem colocar minha segurança no dinheiro, nos resultados ou no reconhecimento. Que minha vida pertença a Ti antes de pertencer às metas. Ensina-me gratidão, domínio próprio e sabedoria. Amém.",
    question: "O dinheiro tem sido ferramenta ou tem ocupado o lugar de Deus no seu coração?",
    practice: "Agradeça hoje por algo que Deus já te deu e que dinheiro nenhum compra."
  },
  {
    keywords: ["família", "casa", "filhos", "esposa", "marido", "presente"],
    title: "Quando a família precisa do seu coração presente",
    reference: "1 Timóteo 5:8",
    introduction:
      "Pode ser que você esteja trabalhando muito por amor à sua família, mas chegando em casa sem disponibilidade para amar. Deus também se importa com esse lugar.",
    reflection:
      "O trabalho pode ser uma forma de cuidado, mas não substitui presença, mansidão e escuta. A liderança que nasce em Deus não aparece apenas em decisões grandes; ela aparece no tom de voz, no tempo dedicado e na humildade de pedir perdão quando necessário.",
    prayer:
      "Senhor, ajuda-me a cuidar melhor da minha casa. Que minha família não receba apenas meu cansaço, minha pressa ou minha irritação. Ensina-me a amar com atitudes simples, presença real e um coração mais parecido com o de Jesus. Amém.",
    question: "Quem perto de você precisa receber mais presença do que justificativas?",
    practice: "Separe um tempo sem celular hoje para ouvir alguém da sua família com atenção."
  },
  {
    keywords: ["ansioso", "ansiedade", "medo", "tribulação", "pesado", "cansado", "preocupado"],
    title: "Quando tudo parece pesado",
    reference: "Filipenses 4:6-7",
    introduction:
      "Você não precisa fingir que está tudo leve. Este momento é uma pausa para colocar diante de Deus aquilo que tem pesado no coração.",
    reflection:
      "A ansiedade tenta transformar cada decisão em urgência e cada problema em ameaça. Deus não chama você à irresponsabilidade, mas à dependência. Orar antes de agir ajuda o coração a não ser governado apenas pelo medo, pela pressa ou pela necessidade de controlar tudo.",
    prayer:
      "Senhor, entrego a Ti o peso deste dia. Dá-me paz para respirar, sabedoria para agir e humildade para pedir ajuda quando for necessário. Que eu não decida movido pelo desespero, mas pela Tua presença. Amém.",
    question: "Qual peso você está tentando carregar sozinho?",
    practice: "Antes da próxima decisão importante, pare por três minutos, ore e respire com calma."
  },
  {
    keywords: ["sabedoria", "clareza", "decisão", "decidir", "confuso", "direção"],
    title: "Antes de uma decisão importante",
    reference: "Tiago 1:5",
    introduction:
      "Nem toda decisão precisa nascer da pressa. Este momento te convida a buscar sabedoria antes de buscar controle.",
    reflection:
      "A vida de quem lidera é cheia de escolhas. Algumas exigem coragem; outras exigem paciência. Buscar sabedoria não é paralisar, mas reconhecer que você não precisa decidir tudo sozinho. Ore, avalie com responsabilidade e converse com pessoas maduras antes de movimentos definitivos.",
    prayer:
      "Senhor, guia meu coração. Livra-me de decidir por medo, orgulho ou vaidade. Dá-me sabedoria, conselhos corretos e serenidade para fazer o que é justo diante de Ti. Amém.",
    question: "Está decisão nasce de sabedoria ou de ansiedade?",
    practice: "Escreva a decisão, ore sobre ela e converse com uma pessoa madura antes de agir."
  },
  {
    keywords: ["liderar", "liderança", "humildade", "orgulho", "impaciência", "caráter"],
    title: "Quando a liderança precisa de humildade",
    reference: "Marcos 10:45",
    introduction:
      "Liderar também é ser formado por Deus. Este momento é uma oportunidade para olhar para o próprio coração antes de olhar para a performance dos outros.",
    reflection:
      "A pressão pode endurecer o jeito de falar, cobrar e decidir. Mas uma liderança com Deus no centro não usa pessoas como degraus. Ela reconhece limites, pede perdão, trata com dignidade e entende que caráter vale mais que aparência de controle.",
    prayer:
      "Senhor, forma em mim um coração humilde. Que eu lidere sem orgulho, corrija sem desprezo e tome decisões sem vaidade. Ajuda-me a servir melhor as pessoas que colocaste perto de mim. Amém.",
    question: "O seu jeito de liderar tem aproximado as pessoas de paz ou apenas de pressão?",
    practice: "Hoje, corrija ou converse com alguém usando mansidão, clareza e respeito."
  },
  {
    keywords: ["distante", "voltar", "deus", "fé", "primeiro amor", "afastado"],
    title: "Quando você precisa voltar para Deus",
    reference: "Mateus 6:33",
    introduction:
      "Se você sente que se afastou, este momento não é para te esmagar com culpa. É para lembrar que Deus deve voltar ao centro.",
    reflection:
      "É possível construir muito por fora e, ao mesmo tempo, se perder por dentro. Buscar o Reino em primeiro lugar não significa abandonar responsabilidades; significa recolocar o coração no lugar certo. Nenhuma conquista vale uma vida distante de Deus.",
    prayer:
      "Senhor, quero voltar meu coração para Ti. Perdoa-me pelas vezes em que coloquei metas, dinheiro, reconhecimento ou pressa acima da Tua presença. Ensina-me a caminhar contigo com sinceridade. Amém.",
    question: "O que tem ocupado mais espaço no seu coração do que Deus?",
    practice: "Comece o dia com uma oração simples antes de abrir mensagens, números ou pendências."
  }
];

export function generateMoment(input: string, selectedTheme?: string): MomentResult {
  const source = `${selectedTheme ?? ""} ${input}`.toLowerCase();
  const base =
    bases.find((item) => item.keywords.some((keyword) => source.includes(keyword))) ??
    bases[bases.length - 1];

  return {
    title: base.title,
    introduction: base.introduction,
    reference: base.reference,
    biblePassage:
      "Paráfrase: volte o coração para Deus, reconheça Sua presença e permita que a fé organize suas prioridades.",
    reflection: base.reflection,
    prayer: base.prayer,
    question: base.question,
    practice: base.practice,
    selectedTheme: selectedTheme || base.title
  };
}
