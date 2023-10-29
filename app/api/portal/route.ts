import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { absoluteUrl } from "@/lib/utils";
import { doc, serverTimestamp, updateDoc, getDoc, addDoc ,collection , setDoc , increment} from "firebase/firestore";
import { db } from "@/firebase";
const creditsUrl = absoluteUrl("/credits");

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const docRef = doc(db, "userSubscription", userId);
    const docSnap = await getDoc(docRef);


    if (docSnap.exists() && docSnap.data().stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: docSnap.data().stripeCustomerId,
        return_url: creditsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

   
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
