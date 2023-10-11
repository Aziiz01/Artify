'use client'

import React, { useState, ChangeEvent } from "react";
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
import { models } from "./models";

export default function UpscalePage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<HTMLImageElement[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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




 // Handle image generation
const handleUpscale = async () => {
  setIsLoading(true);
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
          console.log(selectedModel)
        } else if (width === 1024 && height === 1024) {
          selectedModel = "esrgan-v1-x2plus";
          console.log(selectedModel)
        } else {
          console.error("Invalid image dimensions. Expected 512x512 or 1024x1024.");
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

        setGeneratedImage(generatedImages);
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Failed to make image-upscale request:", error);
    }
  } else {
    console.log("No image uploaded. You can use 'client' here.");
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
               {uploadedImage &&
               <Image 
               width={512}
               height={512}

               src={uploadedImage ? URL.createObjectURL(uploadedImage) : ""} alt="Uploaded image" />
}
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
