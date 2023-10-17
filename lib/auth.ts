import { auth } from "@clerk/nextjs";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { NextResponse } from "next/server";

export async function Auth() {
  const { userId } = auth();

  // In case the user signs out while on the page.
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await setDoc(doc(db, "users", userId), {
      userId: userId,
      timeStamp: serverTimestamp(),
    });
    
    return new NextResponse("User successfully added", { status: 200 });
  } catch (error) {
    console.error('Error while adding user document:', error);

    return new NextResponse("Error adding user document", { status: 500 });
  }
}
