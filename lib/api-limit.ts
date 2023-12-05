import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { doc, serverTimestamp, getDoc, setDoc , increment} from "firebase/firestore";
import { db } from "@/firebase";

export const incrementApiLimit = async (userId: string | null, count: number) => {
  if (!userId) {
    return;
  }

  const docRef = doc(db, "UserApiLimit", userId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, {
        count: increment(-(count)), 
        timeStamp: serverTimestamp(),
      }, { merge: true });
    } else {
      await setDoc(docRef, {
        count: 25-count, 
        timeStamp: serverTimestamp(),
        userId: userId,
      });
    }
  } catch (error) {
    console.error("Error updating or creating the document:", error);
  }
};

export const checkApiLimit = async ( userId: string | null , count : number) => {
  if (!userId) {
    return false;
  }

  const docRef = await getDoc(doc(db, "UserApiLimit", userId));
  if (docRef.exists()) {
    const productData = docRef.data();
    console.log(productData.count-count)
    if (productData.count >= count) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const getApiLimitCount = async (userId: string | null): Promise<number> => {
  if (!userId) {
    return 0;
  }

  const docRef = await getDoc(doc(db, "UserApiLimit", userId));

  if (!docRef.exists()) {
    return 25;
  } else {
    const productData = docRef.data();
    return productData.count;
  }

};
