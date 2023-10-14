import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { doc, serverTimestamp, updateDoc, getDoc, addDoc ,collection} from "firebase/firestore";
import { db } from "@/firebase";
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const docRef = await getDoc(doc(db, "UserSubscription", userId));

  

  if (!docRef.exists()) {
    return false;
  }
const productData = docRef.data();
  const isValid =
  productData.stripePriceId &&
  productData.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return !!isValid;
  
};
