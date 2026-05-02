import type { Session } from "@supabase/supabase-js";

export async function postJson<TBody, TResponse>(
  path: string,
  body: TBody,
  session: Session | null
): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {})
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Não foi possível concluir está ação.");
  }

  return payload as TResponse;
}

