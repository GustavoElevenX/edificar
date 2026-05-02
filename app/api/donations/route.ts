import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

type DonationPayload = {
  donorName?: string;
  donorEmail?: string;
  amount?: number;
  paymentStatus?: string;
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

  const payload = (await request.json()) as DonationPayload;

  if (!payload.amount || payload.amount <= 0) {
    return NextResponse.json({ error: "Valor de doação invalido." }, { status: 400 });
  }

  const supabase = createRouteSupabaseClient(accessToken);
  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const checkoutUrl = buildCheckoutUrl(payload);

  const { error } = await supabase.from("donations").insert({
    user_id: authData.user.id,
    donor_name: payload.donorName || null,
    donor_email: payload.donorEmail || null,
    amount: payload.amount,
    payment_status: payload.paymentStatus ?? "pending",
    checkout_url: checkoutUrl
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, checkoutUrl });
}

function buildCheckoutUrl(payload: DonationPayload) {
  const baseUrl = process.env.DONATION_CHECKOUT_URL;

  if (!baseUrl) return null;

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("amount", String(payload.amount));
    if (payload.donorName) url.searchParams.set("name", payload.donorName);
    if (payload.donorEmail) url.searchParams.set("email", payload.donorEmail);
    url.searchParams.set("success_url", `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/obrigado`);
    return url.toString();
  } catch {
    return baseUrl;
  }
}
