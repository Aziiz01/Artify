import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"
import { db } from "@/firebase"
import { addDoc ,collection, serverTimestamp, updateDoc, doc, query , where , getDocs , getDoc} from "firebase/firestore"
export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    await addDoc(collection(db, "userSubscription"), {
      timeStamp: serverTimestamp(),
      userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
         credits: subscription.items.data[0].price.metadata.credits,
    });
    
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

///////// TOOOOOO COMPLEEEETEEEEEEEEEEEEE

    const q = query(collection(db, "userSubscription"), where("stripeSubscriptionId", "==", subscription.id));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) =>  {
  const docId = doc.id;
   updateDoc(doc(db, "userSubscription", docId), {
      
    stripePriceId: subscription.items.data[0].price.id,
    stripeCurrentPeriodEnd: new Date(
      subscription.current_period_end * 1000
    )
    ,});
console.log(doc.id, " => ", doc.data());
});

    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return new NextResponse(null, { status: 200 })
};
