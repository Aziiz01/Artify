import { auth } from "@clerk/nextjs";
import { doc, serverTimestamp, updateDoc, getDoc, addDoc, collection, setDoc, increment } from "firebase/firestore";
import { db } from "@/firebase";

export const getCredits = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0; // User is not authenticated, return 0 credits.
  }

  const docRef = doc(db, "UserApiLimit", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const productData = docSnap.data();

    if (productData?.count) {
      return productData.count;
    }
  }

  return 0; // Return 0 credits if userCredits are not found.
};
