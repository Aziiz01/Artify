import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { doc, serverTimestamp, getDoc, setDoc , increment} from "firebase/firestore";
import { db } from "@/firebase";

export const incrementApiLimit = async (userId: string | null) => {
  if (!userId) {
    return;
  }

  const docRef = doc(db, "UserApiLimit", userId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document exists, increment the count by 1
      await setDoc(docRef, {
        count: increment(1), // Increment the count by 1
        timeStamp: serverTimestamp(),
      }, { merge: true });
      console.log("Document updated");
    } else {
      // Document doesn't exist, create a new one with count = 1
      await setDoc(docRef, {
        count: 1,
        timeStamp: serverTimestamp(),
        userId: userId,
      });
      console.log("Document created");
    }
  } catch (error) {
    console.error("Error updating or creating the document:", error);
  }
}

export const checkApiLimit = async ( userId: string | null ) => {
  if (!userId) {
    return false;
  }

  const docRef = await getDoc(doc(db, "UserApiLimit", userId));
  if (docRef.exists()) {
    const productData = docRef.data();
    if (productData.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const getApiLimitCount = async (userId: string | null) => {

  if (!userId) {
    return 0;
  }

  const docRef = await getDoc(doc(db, "UserApiLimit", userId));

  if (!docRef.exists()) {
    return 0;
  } else {
    const productData = docRef.data();

    return productData.count;
  }
};
