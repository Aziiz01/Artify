import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { doc, serverTimestamp, updateDoc, getDoc, addDoc ,collection} from "firebase/firestore";
import { db } from "@/firebase";
export const incrementApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }
  const docRef = await getDoc(doc(db, "UserApiLimit", userId));
  if (docRef.exists()) {
    const productData = docRef.data();
    await updateDoc(doc(db, "UserApiLimit", userId), {
      timeStamp: serverTimestamp(),
      count: productData.count + 1 
    });
    console.log("document updated");
  } else {
    await addDoc(collection(db, "UserApiLimit"), {
      timeStamp: serverTimestamp(),
      userId: userId,
       count: 1   
       });
    console.log("document created");
  }

}
export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const docRef = await getDoc(doc(db, "UserApiLimit", userId));
  if (docRef.exists()) {
    const productData = docRef.data();
    if (productData.count < MAX_FREE_COUNTS)
    {
      return true;
    }
    else {
      return false;
    }

  } else {
    return false;
  }

};

export const getApiLimitCount = async () => {
  const { userId } = auth();

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
