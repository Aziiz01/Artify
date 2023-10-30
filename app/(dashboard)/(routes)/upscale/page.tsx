'use client'

import React, { useState, ChangeEvent , useEffect } from "react";
import * as Generation from "../../../generation/generation_pb";
import {
  executeGenerationRequest,
  onGenerationComplete,
  buildGenerationRequest,
}  from "../../../../lib/helpers";// Adjust the import path as needed
import { client, metadata } from "../../../../lib/grpc-client";
import Image from "next/image";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { useSearchParams } from 'next/navigation'
import { doc, getDoc , updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { checkApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';
import { incrementApiLimit } from '@/lib/api-limit';
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import { useProModal } from "@/hook/use-pro-modal";
 
export default function UpscalePage() {
  const proModal = useProModal();
  const [passedImage, setPassedImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<HTMLImageElement[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [f_image_id, setImageId] = useState("");
  useEffect (() => {
    const getImageFromId = async () => {
      const docRef = doc(db, "images", `${imageId}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Check if the 'image' field exists in the document
        if (docSnap.data().image) {
          setPassedImage(docSnap.data().image);
        } else {
          // Handle the case where 'image' field is missing or empty
          console.error("Image URL not found in Firestore.");
        }
      } else {
        // Handle the case where the document doesn't exist
        console.error("Document with imageId not found in Firestore.");
      }
  }
  
    getImageFromId();
  },[imageId])


// Handle image upload
const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0] || null;
  setUploadedImage(file);

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target) { // Check if e.target is not null
        const imageElement = document.createElement("img");
        imageElement.src = e.target.result as string;

        imageElement.onload = () => {
          console.log(`Image width: ${imageElement.width}, height: ${imageElement.height}`);
        };
      }
    };

    reader.readAsDataURL(file);
  }
};


async function upscale () {
  if (isSignedIn) {
    const userId = user.id
  const freeTrial = await checkApiLimit(userId);
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
      // Return a 403 response immediately
      return null;
    }
  if (uploadedImage) {
    try {
      const imageElement = document.createElement("img");
      imageElement.src = URL.createObjectURL(uploadedImage);

      imageElement.onload = async () => {
        const width = imageElement.width;
        const height = imageElement.height;

        let selectedModel = null;

        if (width === 512 && height === 512) {
          selectedModel = "stable-diffusion-x4-latent-upscaler";
        } else if (width === 1024 && height === 1024) {
          selectedModel = "esrgan-v1-x2plus";
        } else {
          toast.error('Invalid dimensions. Dimensions should be 512*512 or 1024*1024');
          setIsLoading(false);
          return;
        }

        const request = buildGenerationRequest(selectedModel, {
          type: 'upscaling',
          upscaler: Generation.Upscaler.UPSCALER_ESRGAN,
          initImage: Buffer.from(await uploadedImage.arrayBuffer()),
        });

        const response = await executeGenerationRequest(client, request, metadata);

        const generatedImages = onGenerationComplete(response);
        if (!isPro) {
          await incrementApiLimit(userId);
        } else {
          try {
            const docRef = await getDoc(doc(db, "UserCredits", userId));
            if (docRef.exists()) {
              const productData = docRef.data();
              const currentCredits = parseInt(productData.count, 10);
              const updatedCredits = (currentCredits - 2).toString();
              console.log(updatedCredits);
              await updateDoc(doc(db, "UserCredits", userId), {
                count: updatedCredits,
              });
              console.log("document updated");
            }
          } catch (error) {
            console.log('Error while decrementing credits:', error);
          }
        }
        return generatedImages;
      };
    } catch (error) {
      console.error("Failed to make image-upscale request:", error);
    }
  } else {
    console.log("No image uploaded. You can use 'client' here.");
  }
} else {
  console.log('You should sign in to continue.');
}
}
function generateRandomId() {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomPart}`;
}
 // Handle image generation
const handleUpscale = async () => {
  setIsLoading(true);
  try  {
    const response =await upscale();
    if (response !== undefined && response !== null) {
      setGeneratedImage(response);
      const generatedImage = response[0]
      console.log(generatedImage);
      //const base64Data = generatedImage.split(',')[1];
      const documentId = generateRandomId();
   setImageId(documentId);
      try {
        const operation = await axios.post('/api/sdxlStorage', { f_image_id, generatedImage });
        console.log(operation.data); // The response from the API
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }
  } else if (response == null) {
    proModal.onOpen();
    console.log('User is not eligible for this operation.');
  } else {
    toast.error("Something went wrong.");
  }} finally  {
    setIsLoading(false);
  }
 
};


  return (
<div className="container mx-auto p-8">
<div className="mb-8 space-y-4 text-center">
<h2 className="text-4xl font-bold">
          Explore the Power of AI
        </h2>
        <p className="text-gray-500 text-lg">
          Chat with the Smartest AI - Experience the Power of AI
        </p>
        </div>

      <h2 className="text-2xl font-bold">Image-to-Image Generator</h2>
      <input type="file" onChange={handleImageUpload} />
              {passedImage || uploadedImage ? (
  <Image
    width={512}
    height={512}
    src={passedImage || (uploadedImage ? URL.createObjectURL(uploadedImage) : "")}
    alt="Uploaded image"
  />
) : null}
<Button
          onClick={handleUpscale} disabled={isLoading}
          className="bg-black text-white py-2 px-4 rounded-md mt-4 w-full"
        // Attach the click event handler
        >
          {isLoading ? 'Upscaling...' : 'Upscale'}
        </Button>
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {generatedImage == null  && !isLoading && (
          <Empty label="No images generated." />
        )}   
      {uploadedImage && (
        <>
               <br />
          {generatedImage && (
            <>
              <h2>Upscaled Image:</h2>
              {generatedImage.map((image, index) => (
                <Card key={index} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    fill
                    src={image.src}
                    alt={`Generated Image ${index + 1}`}
                  />
                </div>
                <CardFooter className="p-2">
                <Button onClick={() => window.open(image.src)} variant="secondary" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Open Image
                          </Button>
                </CardFooter>
              </Card>
              ))}
            </>
          )}
        </>
      )}
    </div> 
  );
              }
