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
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function ImageToImagePage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [passedImage, setPassedImage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<HTMLImageElement[] | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const searchParams = useSearchParams()
  const imageId = searchParams.get('imageId')

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

  const imageStrength = 0.4;

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedImage(file);
  };

  const handleGenerate = async () => {
    setIsLoading(true);

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

    // Provide a default value if initImage is still undefined
    if (initImage === undefined) {
      // You can set a default Buffer or handle this case according to your needs.
      initImage = Buffer.from([]); // For example, create an empty Buffer.
    }

    // Now, you can use the 'initImage' variable in your request object.
    const request = buildGenerationRequest("stable-diffusion-xl-1024-v1-0", {
      type: "image-to-image",
      prompts: [
        {
          text: textInput,
        },
      ],
      stepScheduleStart: 1 - imageStrength,
      initImage, // Assign the value here
      seed: 123463446,
      samples: 1,
      cfgScale: 5,
      steps: 30,
      sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
    });

    try {
      const response = await executeGenerationRequest(client, request, metadata);

      const generatedImages = onGenerationComplete(response);

      setGeneratedImage(generatedImages);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to make image-to-image request:", error);
    }
  }

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
          Algorithm Model : STABLE DIFF SDXL V1
        </h2>
       
        <Button
          onClick={handleGenerate} disabled={isLoading}
          className="bg-black text-white py-2 px-4 rounded-md mt-4 w-full"
        // Attach the click event handler
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {generatedImage == null  && !isLoading && (
          <Empty label="No images generated." />
        )}
       {generatedImage && (
  generatedImage.map((img: any, index: any) => (
    <Card key={index} className="rounded-lg overflow-hidden">
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
      </CardFooter>
    </Card>
  ))
  )}



      </div>{/*DALLE PHOTOS */}
     
    </div>
  );
}
