import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { arbeitgeber_id, email } = await req.json();

  const customer = await stripe.customers.create({
    email,
    metadata: { arbeitgeber_id },
  });

  await supabase
    .from("arbeitgeber")
    .update({ stripe_customer_id: customer.id, subscription_status: "pending" })
    .eq("id", arbeitgeber_id);

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1T7YpL5umvNTC2nKWD3u1rLx",
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/preise?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
