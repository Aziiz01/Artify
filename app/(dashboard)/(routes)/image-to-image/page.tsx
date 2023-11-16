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
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useProModal } from "@/hook/use-pro-modal";
import toast from "react-hot-toast";
import { checkApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import axios from "axios";
import { useLoginModal } from "@/hook/use-login-modal";

export default function ImageToImagePage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [passedImage, setPassedImage] = useState('');
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [generatedImage, setGeneratedImage] = useState<HTMLImageElement[] | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSamples, setSelectedSamples] = useState(1);
  const [cfgScale, setCfgScale] = useState(5); // Set an initial value, e.g., 0
  const [steps, setSteps] = useState(30); // Set an initial value, e.g., 0
  const [seed, setSeed] = useState(123463446);
  const searchParams = useSearchParams()
  const imageId = searchParams.get('imageId')
  const [final_imageId,setImageId] = useState("");
  const proModal = useProModal();
  const loginModal = useLoginModal();
  const [mobileSize, setMobileSize] = useState(false) 

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileSize(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const count = 3;
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

  const handleStyleChange = (event: any) => {
    setSelectedStyle(event.target.value);
  };
  const handleSeed = (event: any) => {
    setSeed(event.target.value);
  };
  
  const handleSamples = (event: any) => {
    setSelectedSamples(event.target.value);
  }
  const handleCFG = (event: any) => {
    const selectedCFG = event.target.value;
    setCfgScale(selectedCFG);
  };
  const handleSteps = (event: any) => {
    const selectedSteps = event.target.value;
    setSteps(selectedSteps);
  };
  const imageStrength = 0.4;
  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedImage(file);
  };

  function generateRandomId() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomPart}`;
  }
  // Handle image generation
  const handleGenerate = async () => {
    setIsLoading(true);
  
    if (!isSignedIn) {
      loginModal.onOpen();
    } else {
      const userId = user.id;
      try {
        const freeTrial = await checkApiLimit(userId);
        const isPro = await checkSubscription(userId);
  
        if (!isPro && !freeTrial) {
          proModal.onOpen();
          setIsLoading(false);
        } else {
          let initImageBuffer;
  
          if (uploadedImage) {
            initImageBuffer = Buffer.from(await uploadedImage.arrayBuffer());
          } else if (passedImage) {        
              const response = await fetch(`${passedImage}`);
              if (response.ok) {
                const imageArrayBuffer = await response.arrayBuffer();
                initImageBuffer = Buffer.from(imageArrayBuffer);
              } else {
                toast.error("Failed to fetch the image from the provided URL.");
                setIsLoading(false);
                return;
              }
           
          } else {
            toast.error("Please upload an image or provide a valid passedImage URL!");
            setIsLoading(false);
            return;
          }
  
          const request = buildGenerationRequest("stable-diffusion-xl-1024-v1-0", {
            type: "image-to-image",
            prompts: [
              {
                text: textInput,
              },
            ],
            stepScheduleStart: 1 - imageStrength,
            initImage: initImageBuffer,
            seed: seed,
            samples: selectedSamples,
            cfgScale: cfgScale,
            steps: steps,
            sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
          });
  
          const response = await executeGenerationRequest(client, request, metadata);
  
          // Update the generated images state with an array of HTML image elements
          const generatedImages = onGenerationComplete(response);
          if (generatedImages !== null) {
            const base64Data = generatedImages.toString().split(',')[1];
            const documentId = generateRandomId();
            setImageId(documentId);
            try {
              const response = await axios.post('/api/sdxlStorage', {
                final_imageId,
                textInput,
                selectedStyle,
                selectedSamples,
                cfgScale,
                seed,
                steps,
                base64Data,
              });
              console.log(response.data); // The response from the API
              //router.refresh();
            } catch (error) {
              console.error(error);
              toast.error("Something went wrong.");
            }
          }
          setGeneratedImage(generatedImages);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(true);
        console.error("Failed to make image-to-image request:", error);
      }
    }
  };

  return (
    <div style={{
      display:'grid',
      gridTemplateColumns: mobileSize ? '40% 60%' : undefined,
      gridTemplateRows: !mobileSize ? '30% 70%' : undefined,
    }}>
      <div className="px-4 lg:px-8" style={{ overflowY: 'scroll', height: '850px' }}>
        <div className="flex items-center">
          <h2 className="text-2xl text-blue-900 font-extrabold ">
            Text Prompt
          </h2>
        </div>
        <div className="relative flex items-center">
          <p className="text-gray-400 text-lg font-bold">
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
          <h2 className="text-2xl mt-5 text-blue-900  font-extrabold">
            Input init image
          </h2>
          <input type="file" className="text-grat-200 " onChange={handleImageUpload} />
             {passedImage || uploadedImage ? (
              <Image
                width={512}
                height={512}
                src={passedImage || (uploadedImage ? URL.createObjectURL(uploadedImage) : "")}
                alt="Uploaded image"
              />
              ) : null}
          <h2 className="text-2xl mt-5 text-blue-900  font-extrabold ">
            Choose a style
          </h2>
          <select value={selectedStyle} onChange={handleStyleChange}>
          <option value="">No Style</option>
            <option value="Realistic">Realistic</option>
            <option value="Anime">Anime</option>
            <option value="Cosmic">Cosmic</option>
          </select>
          <p>Selected Style: {selectedStyle}</p>
          <h2 className="text-2xl  mt-5 text-blue-900  font-extrabold">
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
          <h2 className="text-2xl  mt-5 text-blue-900 font-extrabold">
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
          <h2 className="text-2xl mt-5 text-blue-900 font-extrabold">
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
          <h2 className="text-2xl mt-5 text-blue-900 font-extrabold">
            Seed
          </h2>
          <input
            className="" // Remove left padding
            type="text"
            placeholder="Seed"
            value={seed}
            onChange={handleSeed}
          />
   
          <h2 className="text-2xl  mt-5 text-gray-400 font-bold">
            Algorithm Model : STABLE DIFF SDXL V1
          </h2>
       
          <Button
            onClick={handleGenerate} disabled={isLoading}
            className="mt-4 w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
            // Attach the click event handler
            >
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 ">  
              {isLoading ? 'Generating...' : 'Generate'}
            </span>
          </Button>
      </div>
     
      <div style={{ overflowY: 'scroll', height: '800px' }}>
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-4xl font-bold">
          Explore the Power of AI 
        </h2>
       
        <p className="text-gray-500 text-lg">
          Chat with the Smartest AI - Experience the Power of AI
        </p>
      </div>
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
      </div>



      {/*DALLE PHOTOS */}
     
    </div>
  );
}