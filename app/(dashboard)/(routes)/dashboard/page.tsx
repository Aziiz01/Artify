"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";
import Modal from 'react-modal'; // Import react-modal
import { Button } from "@/components/ui/button"; // Import the Button component
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { Download, ImageIcon } from "lucide-react";
import { SDXLv1 } from '../../../api/sdxl-v1/route'; // Import the function
import { SDXLv09 } from "@/app/api/sdxl-v0.9/route";
import { SDXLv08 } from "@/app/api/sdxl-v0.8/route";
import { SDXLv15 } from "@/app/api/sdxl-v1.5/route";
import { SDXLv21 } from "@/app/api/sdxl-v2.1/route";
import { toast } from "react-hot-toast";
import { promptOptions } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { PublishButton } from "@/components/publish_button";
export default function HomePage() {
  const router = useRouter();
  const proModal = useProModal();
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<HTMLImageElement[] | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedModel, setSelectedModel] = useState('Stable Diffusion 2.1');
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [selectedSamples , setSelectedSamples] = useState(1);
  const [cfgScale, setCfgScale] = useState(0); // Set an initial value, e.g., 0
  const [steps, setSteps] = useState(10); // Set an initial value, e.g., 0
const [seed, setSeed] = useState(0);
const [imageId, setImageId] = useState("");

 const handleDimensions = (event : any) => {
    const selectedValue = event.target.value;
  
    const [selectedHeight, selectedWidth] = selectedValue.split('*');
  
    setHeight(selectedHeight);
    setWidth(selectedWidth);
  };
  
  
  type SDXLModelApiMapping = {
    [key: string]:  (
      textInput: string,
      selectedStyle: string,
      height: number,
      width: number,
      selectedSamples: number,
      cfgScale: number,
      seed: number,
      steps: number
    )=> Promise<any>;
  };
  
 
    const SDXLmodelApiMapping: SDXLModelApiMapping = {
      "Stable Diffusion XL 1.0": SDXLv1,
      "Stable Diffusion XL 0.9": SDXLv09,
    "Stable Diffusion XL 0.8": SDXLv08,
    "Stable Diffusion 2.1": SDXLv21,
    "Stable Diffusion 1.5": SDXLv15,
  };
  const handleSeed= (event: any) => {
    setSeed(event.target.value);
  };
  const handleStyleChange = (event: any) => {
    setSelectedStyle(event.target.value);
  };
  const handleSamples = (event: any) => {
    setSelectedSamples(event.target.value);
  }
  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };
  const getRandomPromptIndex = () => {
    const randomIndex = Math.floor(Math.random() * promptOptions.length);
    return randomIndex;
  };
  const handleSurpriseMeClick = () => {
    const randomIndex = getRandomPromptIndex();

    // Set the selected prompt in the user input bar
    if (randomIndex !== null) {
      setTextInput(promptOptions[randomIndex]);
    }
  };
  const values = {
    prompt: `${textInput} , ${selectedStyle}`,
    amount: selectedSamples,
    resolution: `${height}x${width}`,
  }
  function generateRandomId() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000); // You can adjust the range as needed
    return `${timestamp}-${randomPart}`;
  }
  const DALLE = async (values: any) => {
    try {
      setPhotos([]);

      const response = await axios.post('/api/image', values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setPhotos(urls);
      const documentId = generateRandomId();
      setImageId(documentId);
      await axios.post('/api/dalleStorage', {urls,values,documentId})
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  const generateImage = async () => {
    setIsLoading(true);

   
    try {
      if (selectedModel === 'DALL E2') {
        await DALLE(values);
      } else {
        // Use the selected model to determine which API to call
        const selectedApi = SDXLmodelApiMapping[selectedModel];
        if (selectedApi) {
          const generatedImages = await selectedApi(textInput, selectedStyle,height,width,selectedSamples,cfgScale,seed,steps);
          if (generatedImages !== null) {
            setImage(generatedImages);
            const generatedImage = generatedImages[0].src;
            const base64Data = generatedImage.split(',')[1];
            const documentId = generateRandomId();
            setImageId(documentId);
            try {
              const response = await axios.post('/api/sdxlStorage', {documentId,textInput,selectedModel,selectedStyle,height,width,selectedSamples,cfgScale,seed,steps,base64Data});
              console.log(response.data); // The response from the API
            } catch (error) {
              console.error(error);
            }           // handleSaveSDXL(generatedImage);

          }
        } else {
          // Handle the case where the selected model doesn't have a corresponding API
          // You can display an error message or take other appropriate actions.
          console.error(`API for model ${selectedModel} not found.`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    generateImage();
  };
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  const handleCFG = (event : any) => {
    // Get the selected cfg_scale value from the event
    const selectedCFG = event.target.value;
  
    // Set the cfgScale state variable with its setter
    setCfgScale(selectedCFG);
  };
  const handleSteps = (event : any) => {
    // Get the selected cfg_scale value from the event
    const selectedSteps = event.target.value;
  
    // Set the cfgScale state variable with its setter
    setSteps(selectedSteps);
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
          <button
            className="ml-2 text-gray-500 hover:text-blue-500"
            onClick={openModal}>
            <span role="img" aria-label="Help">
              ❓
            </span>
          </button>
        </div>
        <div className="relative flex items-center">
          <p className="text-gray-500 text-lg ">
            Describe what you want the AI to create
          </p>
          {/* Add the "Surprise Me" button with Font Awesome icon */}
          <button
            className="bg-gray-200 text-gray-500 py-1 px-2 rounded-md ml-auto"
            onClick={handleSurpriseMeClick}
          >
            <FontAwesomeIcon icon={faLightbulb} className="mr-1" /> {/* Font Awesome icon */}
            Surprise Me
          </button>
        </div>
        <input
          className="border rounded-md px-4 py-2 w-full" // Remove left padding
          type="text"
          placeholder="Your text prompt"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <h2 className="text-2xl font-bold">
          Choose a style
        </h2>
        <select value={selectedStyle} onChange={handleStyleChange}>
          <option value="">many others to add </option>
          <option value="3d-model">3d-model</option>
          <option value="analog-film">analog-film </option>
          <option value="anime cinematic">anime</option>
          <option value="cinematic">cinematic</option>

        </select>
        <p>Selected Style: {selectedStyle}</p>

        <h2 className="text-2xl font-bold">
          Algorithm Model
        </h2>
        <select value={selectedModel} onChange={handleModelChange}>
          <option value="Stable Diffusion XL 1.0">Stable Diffusion XL 1.0 (Pro only)</option>
          <option value="Stable Diffusion XL 0.9">Stable Diffusion XL 0.9 (Pro only)</option>
          <option value="Stable Diffusion XL 0.8">Stable Diffusion XL 0.8</option>
          <option value="Stable Diffusion 2.1">Stable Diffusion 2.1</option>
          <option value="Stable Diffusion 1.5">Stable Diffusion 1.5</option>
          <option value="DALL E2">DALL E2</option>
        </select>
        <p>Selected Model: {selectedModel}</p>
        <h2 className="text-2xl font-bold">
          Dimensions
        </h2>
        <select value={`${height}*${width}`} onChange={handleDimensions}>
  <option value="512*512">512*512</option>
  <option value="1024*1024">1024*1024</option>
  <option value="2048*2048">2K</option>
</select>
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
        {image == null && !isLoading && photos == null && (
          <Empty label="No images generated." />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {image !== null && (
          image.map((img, index) => (
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
                <Link href="/image-to-image">
                  <Button variant="secondary" className="w-full">
                    Enhance Image (Pro)
                  </Button>
                </Link>
                 <PublishButton imageId={imageId} />
                  <Button variant="secondary" className="w-full">
                    Like
                  </Button>
              </CardFooter>
            </Card>
          ))
        )}
</div>
      </div>{/*DALLE PHOTOS */}
      {photos && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {photos.map((src) => (
            <Card key={src} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  fill
                  alt="Generated"
                  src={src}
                />
              </div>
              <CardFooter className="p-2">
                <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Open Image
                </Button>
                <PublishButton imageId={imageId} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
