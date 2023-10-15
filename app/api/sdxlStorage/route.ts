import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../../../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from "../../../firebase";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.text(); // Read the request body as text
    const imageData = JSON.parse(body);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!imageData) {
      return new NextResponse("Image is required in order to save", { status: 400 });
    }
    // Generate a unique filename based on the current timestamp
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}.jpg`; // Change the file extension as needed

    // Extract the base64-encoded image data from the data
    const base64Data = imageData.base64Data;
    //console.log(base64Data);

    const storageRef = ref(storage, 'SDXL/' + filename);

    // Upload the base64-encoded image data to Firebase Storage
    await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/jpeg' });

    // Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    // Store the URL in Firestore
    await addDoc(collection(db, "images"), {
      userId: userId,
      image: imageUrl,
      timeStamp: serverTimestamp(),
    });
    return new NextResponse("Image successfully uploaded", { status: 200 });

  }  catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
