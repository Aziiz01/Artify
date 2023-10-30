'use client'
import React, { useState, ChangeEvent, useEffect } from "react";
import * as Generation from "../../../generation/generation_pb";
import {
  executeGenerationRequest,
  onGenerationComplete,
  buildGenerationRequest,
} from "../../../../lib/helpers";
import { client, metadata } from "../../../../lib/grpc-client";
import Image from "next/image";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { checkApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';
import { incrementApiLimit } from '@/lib/api-limit';
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { PublishButton } from "@/components/publish_button";
import { imgtoimg } from "@/app/api/imagetoimage/route";

export default function ImageToImagePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [passedImage, setPassedImage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<HTMLImageElement[] | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const searchParams = useSearchParams()
  const imageId = searchParams.get('imageId')
  const proModal = useProModal();
  const [selectedSamples, setSelectedSamples] = useState(1);
  const [cfgScale, setCfgScale] = useState(0); // Set an initial value, e.g., 0
  const [steps, setSteps] = useState(10); // Set an initial value, e.g., 0
  const [seed, setSeed] = useState(0);
  const router = useRouter();
  const [f_image_id, setImageId] = useState("");

  useEffect(() => {
    const getImageFromId = async () => {
      const docRef = doc(db, "images", `${imageId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data().image) {
          setPassedImage(docSnap.data().image);
        } else {
          console.error("Image URL not found in Firestore.");
        }
      } else {
        console.error("Document with imageId not found in Firestore.");
      }
    }

    getImageFromId();
  }, [imageId]);

  const handleStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(event.target.value);
  };


  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedImage(file);
  };

 async function IMG2IMG() {
  }
 function generateRandomId() {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomPart}`;
}
  const handleGenerate = async () => {
    setIsLoading(true);
    try  {
      if (isSignedIn) {
       
      let initImage: Buffer | undefined;
    
      if (typeof passedImage === "string") {
        // Handle the case where passedImage is a string (e.g., a URL or base64 data)
        // You can process it accordingly
        // Example: Convert a base64 string to a Buffer
        initImage = Buffer.from(passedImage, "base64");
      } else if (uploadedImage instanceof Blob) {
        // Handle the case where uploadedImage is a Blob or File
        initImage = Buffer.from(await uploadedImage.arrayBuffer());
      }
    
      if (initImage === undefined) {
        // You can set a default Buffer or handle this case according to your needs.
        initImage = Buffer.from([]); // For example, create an empty Buffer.
      }
    
      
       
     const userId = user.id;
     const freeTrial = await checkApiLimit(userId);
       const isPro = await checkSubscription(userId);
   
       if (!freeTrial && !isPro) {
         return null;
       }
    const response =await imgtoimg(userId,textInput,initImage,selectedSamples,cfgScale,seed,steps);
    console.log(response)
    if (response !== -1 && response !== null) {
      setGeneratedImage(response);
      const generatedImage = response[0].src;
      const base64Data = generatedImage.split(',')[1];
      const documentId = generateRandomId();
   setImageId(documentId);
      try {
        const operation = await axios.post('/api/sdxlStorage', { f_image_id, textInput,  selectedStyle, selectedSamples, cfgScale, seed, steps, base64Data });
        console.log(operation.data); // The response from the API
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }
  } else if (response == -1) {
    proModal.onOpen();
    console.log('User is not eligible for this operation.');
  } else {
   toast.error("error somwhere")  
} } else {
    console.log('You should sign in to continue.');
  }
  } finally  {
    setIsLoading(false);
  }  
}


const handleSeed = (event: any) => {
  setSeed(event.target.value);
};
const handleSamples = (event: any) => {
  setSelectedSamples(event.target.value);
}
const handleCFG = (event: any) => {
  // Get the selected cfg_scale value from the event
  const selectedCFG = event.target.value;

  // Set the cfgScale state variable with its setter
  setCfgScale(selectedCFG);
};
const handleSteps = (event: any) => {
  // Get the selected cfg_scale value from the event
  const selectedSteps = event.target.value;

  // Set the cfgScale state variable with its setter
  setSteps(selectedSteps);
};
const handleEnhance = (event: any) => {
  const url = `/image-to-image?imageId=${imageId}`;

  // Redirect to the new URL
  window.location.href = url;
};
const handleUpscale = (event: any) => {
  const url = `/upscale?imageId=${imageId}`;

  // Redirect to the new URL
  window.location.href = url;
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
      <div className="">
        <div className="flex items-center">

          <h2 className="text-2xl font-bold">
            Text Prompt
          </h2>
        </div>
        <div className="relative flex items-center">
        <p className="text-gray-500 text-lg ">
          Describe what you want the AI to create
        </p>
        
      </div>
        <input
          className="border rounded-md px-4 py-2 w-full" // Remove left padding
          type="text"
          placeholder="Your text prompt"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <h2 className="text-2xl font-bold">
          Input init image
        </h2>
               <input type="file" onChange={handleImageUpload} />
               {passedImage || uploadedImage ? (
  <Image
    width={512}
    height={512}
    src={passedImage || (uploadedImage ? URL.createObjectURL(uploadedImage) : "")}
    alt="Uploaded image"
  />
) : null}
        <h2 className="text-2xl font-bold">
          Choose a style
        </h2>
        <select value={selectedStyle} onChange={handleStyleChange}>
        <option value="">No Style</option>
          <option value="Realistic">Realistic</option>
          <option value="Anime">Anime</option>
          <option value="Cosmic">Cosmic</option>
        </select>
        <p>Selected Style: {selectedStyle}</p>
        <h2 className="text-2xl font-bold">
          Samples
        </h2>
        <select value={selectedSamples} onChange={handleSamples}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="10">10</option>
        </select>
        <h2 className="text-2xl font-bold">
          CFG_Scale
        </h2>
        <input
          type="range"
          id="cfgScale"
          name="cfgScale"
          min={0}
          max={35}
          value={cfgScale}
          onChange={handleCFG}
        />
        <p>{cfgScale}</p>
        <h2 className="text-2xl font-bold">
          Steps
        </h2>
        <input
          type="range"
          id="steps"
          name="steps"
          min={10}
          max={150}
          value={steps}
          onChange={handleSteps}
        />
        <p>{steps}</p>
        <h2 className="text-2xl font-bold">
          Seed
        </h2>
        <input
          className="" // Remove left padding
          type="text"
          placeholder="Seed"
          value={seed}
          onChange={handleSeed}
        />
        <h2 className="text-2xl font-bold">
          Algorithm Model : STABLE DIFF SDXL V1
        </h2>
       
        <Button
          onClick={handleGenerate} disabled={isLoading}
          className="bg-black text-white py-2 px-4 rounded-md mt-4 w-full"
        // Attach the click event handler
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
       
{(!generatedImage || generatedImage.length === 0) && !isLoading  && (
  <Empty label="No images generated." />
)}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
  {(Array.isArray(generatedImage) && generatedImage.length > 0) ? (
    generatedImage.map((img, index) => (
      <Card key={index} className="">
        <div className="relative aspect-square">
          <Image
            fill
            src={img.src}
            alt={`Generated Image ${index + 1}`}
          />
        </div>
        <CardFooter className="p-2">
          <Button onClick={() => window.open(img.src)} variant="secondary" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Open Image
          </Button>
          <Button onClick={handleEnhance}> Enhance </Button>
          <Button onClick={handleUpscale}> Upscale </Button>
          <PublishButton imageId={f_image_id} />
        </CardFooter>
      </Card>
    ))
  ) : null}
</div>




      </div>{/*DALLE PHOTOS */}
     
    </div>
  );
}
