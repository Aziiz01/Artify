import { auth } from "@clerk/nextjs";
import { doc, getDoc} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { checkSubscription } from "./subscription";
export const getCredits = async () => {
  const { userId } = auth();
  const isPro = await checkSubscription(userId);


  if (!userId) {
    return 0; 
  }
  if (!isPro) {
    return  'Upgrade to Pro 🚀';
  }
  const docRef = doc(db, "UserCredits", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const productData = docSnap.data();
    if (productData.count) {
      return `${productData.count} `;
    }
  }

  return 0;
  
};