import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { absoluteUrl } from "@/lib/utils";

const creditsUrl = absoluteUrl("/credits");

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
      let data = await request.json();
      let priceId = data.priceId;

      if (!priceId) {
        return new NextResponse("Price ID is required", { status: 400 });
      }
  
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: creditsUrl,
        cancel_url: creditsUrl,
        
        metadata: {
          userId,
        },
      });
  
      return NextResponse.json(session.url);
    
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
