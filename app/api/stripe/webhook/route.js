import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook Signatur Fehler:", error.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Zahlung erfolgreich
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { arbeitgeber_id } = session.metadata;

    if (arbeitgeber_id) {
      const { error } = await supabase
        .from("arbeitgeber")
        .update({
          status: "aktiv",
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        })
        .eq("id", arbeitgeber_id);

      if (error) {
        console.error("Supabase Update Fehler:", error);
      }
    }
  }

  // Abo gekündigt oder Zahlung fehlgeschlagen
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "invoice.payment_failed"
  ) {
    const subscription =
      event.type === "customer.subscription.deleted"
        ? event.data.object
        : null;

    const customerId =
      event.type === "invoice.payment_failed"
        ? event.data.object.customer
        : subscription?.customer;

    if (customerId) {
      await supabase
        .from("arbeitgeber")
        .update({ status: "inaktiv" })
        .eq("stripe_customer_id", customerId);
    }
  }

  return Response.json({ received: true });
}
