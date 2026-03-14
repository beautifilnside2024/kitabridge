import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { arbeitgeber_id, email, einrichtung_name } = await request.json();

    const session = await stripe.checkout.sessions.create({
      
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        arbeitgeber_id,
        einrichtung_name,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bezahlung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bezahlung/abgebrochen`,
      locale: "de",
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Fehler:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
