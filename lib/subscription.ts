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
import { getCredits } from "./credits";
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (userId: string | null) => {

  if (!userId) {
    console.log("Unauthorized to check subscription!");
    return false;
  }
  //const credits = parseInt(await getCredits(), 10); // Convert to a number

  const docRef = doc(db, "userSubscription", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const productData = docSnap.data();
    if (
     // credits !==0 &&
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
