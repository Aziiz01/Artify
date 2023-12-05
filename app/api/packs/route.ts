import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const prices = await stripe.prices.list({
        });
        return NextResponse.json(prices.data.reverse());
    } catch (error) {
        console.error("Error fetching Stripe prices:", error);
    }
    
}