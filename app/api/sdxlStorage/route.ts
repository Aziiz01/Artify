import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getDoc, updateDoc, serverTimestamp, setDoc ,doc } from "firebase/firestore";
import { db } from '../../../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from "../../../firebase";
import { currentUser } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    
    const user = await currentUser();
    const user_email = user?.emailAddresses[0].emailAddress;
    const firstName = user?.firstName;
    const lastName =user?.lastName;
    const { userId } = auth();
    const body = await req.text();
    // Read the request body as text
    const variables = JSON.parse(body);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!variables) {
      return new NextResponse("One or many of the Variables are missing", { status: 400 });
    }
    // Generate a unique filename based on the current timestamp
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}.jpg`; // Change the file extension as needed

    // Extract the base64-encoded image data and other variables from the data
    const base64Data = variables.base64Data;
    const prompt = variables.textInput || "";
    const Model = variables.selectedModel || "SDXL-v1";
    const Style = variables.selectedStyle || "";
    const Samples = variables.selectedSamples || 1; 
    const seed = variables.seed || "";
    const steps = variables.steps || 30;
    const height = variables.height || 512;
    const width = variables.width || 512;
    const cfg_scale = variables.cfgScale || 0;
    const docID = variables.documentId;
    const storageRef = ref(storage, 'SDXL/' + filename);

    // Upload the base64-encoded image data to Firebase Storage
    await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/jpeg' });

    // Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    try {
      
      await setDoc(doc(db, "images" ,docID), {
        email_adress : user_email,
        firstName : firstName,
        lastName : lastName,
        userId: userId,
        image: imageUrl,
        prompt: prompt,
        Model: Model,
        Style: Style,
        height : height,
        width : width,
        samples: Samples,
        seed: seed,
        steps: steps,
        dimensions: `${height}*${width}`,
        cfg_scale: cfg_scale,
        published: false,
        likes : [],
        timeStamp: serverTimestamp(),
      });
      // implementing free Count increment after saving image
    
      return new NextResponse("Image successfully uploaded", { status: 200 });
    } catch (error) {
      console.log('error while adding doc')
    }
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
