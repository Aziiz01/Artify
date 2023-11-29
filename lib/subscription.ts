import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import {
  doc,
  serverTimestamp,
  updateDoc,
  getDocs,
  getDoc,
  addDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { checkApiLimit, incrementApiLimit } from "./api-limit";
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (userId: string | null) => {

  if (!userId) {
    console.log("Unauthorized to check subscription!");
    return false;
  }

  const docRef = doc(db, "userSubscription", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const productData = docSnap.data();
    if (

      productData.stripePriceId &&
      productData.stripeCurrentPeriodEnd &&
      productData.stripeCurrentPeriodEnd.toDate().getTime() + DAY_IN_MS > Date.now()
    ) {
      return true; // Subscription is valid
    } else {
      return false; // Subscription is not valid
    }
  } else {
    console.log("No such document!");
    return false;
  }
};
export const countCredit = async (userId: string | null, count: number) => {
  if (!userId) {
    return false;
  }
  const isPro = await checkSubscription(userId);
 // const free = await checkApiLimit(userId,count);
  if (!isPro) {
    await incrementApiLimit(userId, count);
    return true;
  } else {
    try {
      const docRef = await getDoc(doc(db, "UserCredits", userId));
      if (docRef.exists()) {
        const productData = docRef.data();
        const currentCredits = parseInt(productData.count, 10);
        const credits = (currentCredits - count);
        if (credits < 0) { 
          return false 
        } else {
          const updatedCredits = credits.toString();
          await updateDoc(doc(db, "UserCredits", userId), {
            count: updatedCredits,
          });
          console.log("document updated");
          return true;
        }
      }
    } catch (error) {
      console.log('Error while decrementing credits:', error);
      return false;
    }
  }
}

