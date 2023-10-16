import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from "../../../firebase";

export async function POST(req: Request) {
  try {
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
    const prompt = variables.prompt;
    const Model = variables.selectedModel;
    const Style = variables.selectedStyle;
    const Samples = variables.selectedSamples;
    const seed = variables.seed;
    const steps = variables.steps;
    const height = variables.height;
    const width = variables.width;
    const cfg_scale = variables.cfg_scale;

    const storageRef = ref(storage, 'SDXL/' + filename);

    // Upload the base64-encoded image data to Firebase Storage
    await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/jpeg' });

    // Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    try {
      await addDoc(collection(db, "images"), {
        userId: userId,
        image: imageUrl,
        prompt: prompt,
        Model: Model,
        Style: Style,
        samples: Samples,
        seed: seed,
        steps: steps,
        dimensions: `${height}*${width}`,
        cfg_scale: cfg_scale,
        timeStamp: serverTimestamp(),
      });
      return new NextResponse("Image successfully uploaded", { status: 200 });
    } catch (error) {
      console.log('error while adding doc')
    }
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
