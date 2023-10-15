import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"
import { db } from "@/firebase"
import { addDoc ,collection, serverTimestamp, updateDoc, doc, query , where , getDocs , getDoc , setDoc} from "firebase/firestore"
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
    //console.log(subscription.items.data[0].price.metadata.credits);
    await setDoc(doc(db, "userSubscription", session?.metadata?.userId), {
      timeStamp: serverTimestamp(),
      userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
       credits: subscription.items.data[0].price.metadata.credits,
    }, { merge: true });
    
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const q = query(collection(db, "userSubscription"), where("stripeSubscriptionId", "==", subscription.id));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const docRef = doc.ref; // Get a reference to the document
      const updateData = {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
    
      // Update the document with the new data
      setDoc(docRef, updateData, { merge: true });
    
      console.log(doc.id, " => Document updated with new data");
    });
    
/*

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
  */}

  return new NextResponse(null, { status: 200 })
};
