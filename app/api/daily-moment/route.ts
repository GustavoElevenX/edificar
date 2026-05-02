import { NextResponse } from "next/server";
import { generateMomentWithAI } from "@/lib/ai/moment";

export async function POST() {
  try {
    const result = await generateMomentWithAI({
      mode: "daily",
      selectedTheme: "Palavra de hoje para empresário cristão"
    });

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar a Palavra de hoje."
      },
      { status: 500 }
    );
  }
}
