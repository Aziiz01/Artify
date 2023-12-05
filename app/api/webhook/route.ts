import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import { db } from "@/firebase"
import {collection, serverTimestamp, doc, query , where , getDocs ,setDoc, getDoc, updateDoc} from "firebase/firestore"
import toast from "react-hot-toast"

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
    const p= subscription.items.data[0].price.lookup_key;
    await setDoc(doc(db, "userSubscription", session?.metadata?.userId), {
      timeStamp: serverTimestamp(),
      payment_email: session?.customer_details?.email,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
       credits: subscription.items.data[0].price.metadata.credits,
    }, { merge: true });

    const ApiCountRef = doc(db, 'UserCredits', session?.metadata?.userId);
    const docSnap = await getDoc(ApiCountRef);
    const p_credit= subscription.items.data[0].price.metadata.credits;

    if (docSnap.exists()){
     const old_count = docSnap.data().count;
     if (p_credit === 'unlimited' ){
      await updateDoc(ApiCountRef, {
        count: p_credit,
        package : p,
        deadline : new Date(
          subscription.current_period_end * 1000
        )
     })} else {
     const new_count = parseInt(old_count, 10) + parseInt(p_credit, 10);
     await updateDoc(ApiCountRef, {
      count: new_count,
      package : p,
      deadline : new Date(
        subscription.current_period_end * 1000
      )
  });
   } }else{
setDoc(ApiCountRef, {
    package : p,
     count: p_credit,
   deadline : new Date(
    subscription.current_period_end * 1000
  )
}, { merge: true });
  }}
    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string )
       
    const q = query(collection(db, "userSubscription"), where("stripeSubscriptionId", "==", subscription.id));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const docRef = doc.ref; 
      const updateData = {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };
          setDoc(docRef, updateData, { merge: true });
    });
    
}

  return new NextResponse(null, { status: 200 })
};
