import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(request : Request) {
    try {
        const prices = await stripe.prices.list({
            limit: 4,
        });
        return NextResponse.json(prices.data.reverse());
    } catch (error) {
        console.error("Error fetching Stripe prices:", error);
    }
    
}