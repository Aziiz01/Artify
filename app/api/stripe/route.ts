import { stripe } from "@/lib/stripe";
import { NextResponse, NextRequest } from "next/server";
// implemnt user verif and database verif fok ala zeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeby
export async function POST (request : Request) {
    let data = await request.json();
    let priceId = data.priceId
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/credits',
      cancel_url: 'http://localhost:3000/credtis'
    })

    return NextResponse.json(session.url)
}