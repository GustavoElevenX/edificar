import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

type SubscriberPayload = {
  name?: string;
  email?: string;
  whatsapp?: string;
  preferredChannel?: string;
  preferredTime?: string;
  interests?: string[];
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

  const payload = (await request.json()) as SubscriberPayload;

  if (!payload.name || !payload.email) {
    return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  const supabase = createRouteSupabaseClient(accessToken);
  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const { error } = await supabase.from("daily_subscribers").insert({
    user_id: authData.user.id,
    name: payload.name,
    email: payload.email,
    whatsapp: payload.whatsapp || null,
    preferred_channel: payload.preferredChannel ?? "email",
    preferred_time: payload.preferredTime ?? "07:00",
    interests: payload.interests ?? []
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
