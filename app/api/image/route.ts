import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { addDoc, collection, serverTimestamp, setDoc, getDoc , doc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { clerkClient } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
//implement credti count fornt and back
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const user =await currentUser();
    const body = await req.json();
    const { prompt, amount, resolution} = body;
    //const users = await clerkClient.users.getUserList();
    //console.log(users)
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    if (!isPro) {
      await incrementApiLimit();
    } else {
    try {
      const docRef = await getDoc(doc(db, "UserCredits", userId));
      if (docRef.exists()) {
        const productData = docRef.data();
        const currentCredits = parseInt(productData.count, 10);
        const updatedCredits = (currentCredits - 2).toString();
        console.log(updatedCredits)
        await updateDoc(doc(db, "UserCredits", userId), {
          count: updatedCredits,
        });
        console.log("document updated");
      }
    } catch (error) {
      console.log('Error while decrementing credits:', error);
    }
  }
    return NextResponse.json(response.data.data);
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
