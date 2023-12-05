import { auth } from "@clerk/nextjs";
import { doc, getDoc} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
export const getCredits = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0; 
  }
  const docRef = doc(db, "UserCredits", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const productData = docSnap.data();
    if (productData.count) {
      return `${productData.count} credits left`;
    }
  }

  return 0;
  
};