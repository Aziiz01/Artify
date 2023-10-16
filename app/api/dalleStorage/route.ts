import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp, setDoc , doc } from "firebase/firestore";
import { db } from '../../../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage  } from "../../../firebase";
import axios from 'axios'; // Import the axios library to make HTTP requests

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const urls = body.urls;
const prompt = body.values.prompt;
const amount = body.values.amount;
const resolution = body.values.resolution;
const docId = body.documentId;
console.log(urls+prompt)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!body) {
      return new NextResponse("Request body is empty", { status: 400 });
    }
 // Generate a unique filename based on the current timestamp
 const timestamp = Date.now();
 const filename = `${userId}/${timestamp}.jpg`; // Change the file extension as needed
 const storageRef = ref(storage, 'DALLE/' + filename);
 const imageResponse = await axios.get(urls, { responseType: 'arraybuffer' });
 if (imageResponse.status !== 200) {
    return new NextResponse("Failed to download the image", { status: 500 });
  }

  const base64Data = Buffer.from(imageResponse.data).toString('base64');
  await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/jpeg' });
  const imageUrl = await getDownloadURL(storageRef);

  try {

      await setDoc(doc(db, "images" ,docId), {
        userId: userId,
        image: imageUrl,
        prompt: prompt,
        amount : amount,
        resolution : resolution,
        published: false, 
        likes : 0,
        timeStamp: serverTimestamp(),
      });
      return new NextResponse("Image successfully uploaded", { status: 200 });
    } catch (error) {
      console.log('error while adding doc')
    }

    return new NextResponse("Image successfully uploaded", { status: 200 });
  } catch (error) {
    console.error('[IMAGE_ERROR]', error);

    // Log the error details for debugging
    console.error(error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
