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
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
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
