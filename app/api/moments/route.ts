import { NextResponse } from "next/server";
import {
  EDIFICAR_PROMPT_VERSION,
  generateMomentWithAI,
  getContentModelName
} from "@/lib/ai/moment";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

type MomentPayload = {
  inputText?: string;
  selectedTheme?: string;
};

function getAccessToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  return header.replace(/^Bearer\s+/i, "").trim();
}

export async function POST(request: Request) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ error: "Sessão não encontrada." }, { status: 401 });
  }

  const payload = (await request.json()) as MomentPayload;

  if (!payload.inputText && !payload.selectedTheme) {
    return NextResponse.json(
      { error: "Informe um texto ou tema para gerar o momento." },
      { status: 400 }
    );
  }

  const supabase = createRouteSupabaseClient(accessToken);
  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  let result;

  try {
    result = await generateMomentWithAI({
      inputText: payload.inputText,
      selectedTheme: payload.selectedTheme
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o momento agora."
      },
      { status: 500 }
    );
  }

  const model = getContentModelName();
  const { data: generationLog, error: generationLogError } = await supabase
    .from("ai_generation_logs")
    .insert({
      user_id: authData.user.id,
      feature: "moment",
      provider: "ai",
      model,
      prompt_version: EDIFICAR_PROMPT_VERSION,
      input_text: payload.inputText ?? "",
      selected_theme: payload.selectedTheme ?? result.selectedTheme,
      output_json: result,
      status: "success"
    })
    .select("id")
    .single();

  if (generationLogError) {
    return NextResponse.json({ error: generationLogError.message }, { status: 400 });
  }

  const { error } = await supabase.from("moment_requests").insert({
    user_id: authData.user.id,
    ai_generation_id: generationLog.id,
    input_text: payload.inputText ?? "",
    selected_theme: payload.selectedTheme ?? result.selectedTheme,
    detected_theme: result.selectedTheme,
    generated_title: result.title,
    generated_introduction: result.introduction,
    generated_reference: result.reference,
    generated_bible_passage: result.biblePassage,
    generated_reflection: result.reflection,
    generated_prayer: result.prayer,
    generated_question: result.question,
    generated_practice: result.practice,
    model,
    prompt_version: EDIFICAR_PROMPT_VERSION
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ result });
}
