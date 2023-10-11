import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { absoluteUrl } from "@/lib/utils";

const creditsUrl = absoluteUrl("/credits");

export async function POST(request?: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: creditsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    if (request) {
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
    } else {
      return new NextResponse("Bad Request", { status: 400 });
    }
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
