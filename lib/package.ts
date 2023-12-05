import { auth } from "@clerk/nextjs";
import { doc, getDoc, collection, query, where, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const getPackage = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0; // User is not authenticated, return 0 credits.
  }

  const packageQuery = doc(db, "UserCredits", userId);
  const packageSnapshot = await getDoc(packageQuery);

  if (packageSnapshot.exists()) {
    const packageData = packageSnapshot.data();

    if (packageData?.package) {
     
      return packageData?.package ;
    } else   {
      return false;
    }
    
      
      }
    
    
  
    
 
  

  return 0; 
};
