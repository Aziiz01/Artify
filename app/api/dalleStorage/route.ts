import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp, setDoc , doc } from "firebase/firestore";
import { db } from '../../../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage  } from "../../../firebase";
import axios from 'axios'; // Import the axios library to make HTTP requests
import { currentUser } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    // Need to save the images with the user that created them
    const user = await currentUser();
const user_email = user?.emailAddresses[0].emailAddress;
const firstName = user?.firstName;
const lastName =user?.lastName;
    const { userId } = auth();
    const body = await req.json();
    const urls = body.url;
const prompt = body.values.prompt;
const textInput = body.values.textInput;
const style = body.values.style;
const amount = body.values.amount;
const height = body.values.height;
const width = body.values.width;
const docId = body.documentId;

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
        email_adress : user_email,
        firstName : firstName,
        lastName : lastName,
        userId: userId,
        image: imageUrl,
        Model :'DALLE',
        prompt: textInput,
        style: style,
        amount : amount,
        height : height,
        width : width,
        published: false, 
        likes: [] ,
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
