"use client";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hook/use-pro-modal";
import { Button } from "@/components/ui/button"; // Import the Button component
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { Clock, Download, ImageIcon } from "lucide-react";
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
import { clerkClient } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/hook/use-login-modal";
import PickStyle from "@/components/ui/pickStyle";
import "../../style.css";

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const proModal = useProModal();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<HTMLImageElement[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState('Stable Diffusion 2.1');
  const [height, setHeight] = useState(512);
  const [width, setWidth] = useState(512);
  const [selectedSamples, setSelectedSamples] = useState(1);
  const [cfgScale, setCfgScale] = useState(0); // Set an initial value, e.g., 0
  const [steps, setSteps] = useState(10); // Set an initial value, e.g., 0
  const [seed, setSeed] = useState(0);
  const [imageId, setImageId] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const loginModal = useLoginModal();
  const [mobileSize, setMobileSize] = useState(false) 
  const [clicked, setClicked] = useState(false);
  const [displayImagesImmediately, setDisplayImagesImmediately] = useState(false);
  let count = 3;

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileSize(isMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  const handleSelectedStyleChange = (newSelectedStyle: string) => {
    setSelectedStyle(newSelectedStyle);
  };

  const handleDimensions = (event: any) => {
    const selectedValue = event.target.value;
    const [selectedHeight, selectedWidth] = selectedValue.split('x');
    setHeight(selectedHeight);
    setWidth(selectedWidth);
  };


  type SDXLModelApiMapping = {
    [key: string]: (
      userId: string,
      prompt: string,
      selectedStyle: string,
      height: number,
      width: number,
      selectedSamples: number,
      cfgScale: number,
      seed: number,
      steps: number
    ) => Promise<any>;
  };

  const SDXLmodelApiMapping: SDXLModelApiMapping = {
    "Stable Diffusion XL 1.0": SDXLv1,
    "Stable Diffusion XL 0.9": SDXLv09,
    "Stable Diffusion XL 0.8": SDXLv08,
    "Stable Diffusion 2.1": SDXLv21,
    "Stable Diffusion 1.5": SDXLv15,
  };

  const handleButtonClick = () => {
    setClicked(!clicked);
    setDisplayImagesImmediately(true);
    count += 2;  
  };

  const handleSeed = (event: any) => {
    setSeed(event.target.value);
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
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomPart}`;
  }


  const DALLE = async (values: any) => {
    try {
      setPhotos([]);
      const response = await axios.post('/api/image', values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setPhotos(urls);
  
      for (const url of urls) {
        const documentId = generateRandomId();
        setImageId(documentId);
  
        // Send a POST request for each URL separately
        await axios.post('/api/dalleStorage', { url, values, documentId });
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else if (error?.response?.status === 405) {
        toast.error("Your credit balance is insufficient!");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };
  
const saveImagesInBackground = async (images : any) => {
  // Save the images in the background
  const saveImagesPromises = images.map(async (img : any) => {
    const generatedImage = img.src;
    const base64Data = generatedImage.split(',')[1];
    const documentId = generateRandomId();
    setImageId(documentId);

    try {
      await axios.post('/api/sdxlStorage', {
     documentId,
     textInput,
     selectedModel,
     selectedStyle,
     height,
     width,
     selectedSamples,
     cfgScale,
     seed,
     steps,
     base64Data,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }

    return img;
  });

  // Wait for all image save promises to resolve (in the background)
  try {
    const savedImages = await Promise.all(saveImagesPromises);
    // Optionally, update the UI or perform any actions after saving is complete
    console.log("Images saved successfully:", savedImages);
  } catch (error) {
    console.error("Error saving images:", error);
    toast.error("Failed to save some images.");
  }
};

  const generateImage = async () => {
    setIsLoading(true);
    router.refresh();
    if (isSignedIn) {
      const userId = user.id;
      try {
        if (selectedModel === 'DALL E2') {
          await DALLE(values);
        } else {
          // Use the selected model to determine which API to call
          const selectedApi = SDXLmodelApiMapping[selectedModel];
          if (selectedApi) {
            const prompt = `${textInput} , ${selectedStyle}`;
            try {
              const generatedImages = await selectedApi(userId, prompt, selectedStyle, height, width, selectedSamples, cfgScale, seed, steps);
              if (generatedImages !== null && generatedImages !== false) {
                if (displayImagesImmediately) {
                  console.log('displaying first')
                  setImage(generatedImages);
                  saveImagesInBackground(generatedImages);
                } else { 
                  console.log('saving first')
                  saveImagesInBackground(generatedImages);
                  setImage(generatedImages);
                }
                router.refresh();
              } else if (generatedImages === false) {
                toast.error("You credit balance is insufficient!");
                proModal.onOpen();
              } else {
                proModal.onOpen();
                console.log('User is not eligible for this operation.');
              }
            } catch (error : any) {
              if (error.response && error.response.status === 403) {
                proModal.onOpen();
              } else {
                console.error("Something went wrong:", error);
                toast.error("Something went wrong.");
              }
            }
            
          } else {
            console.error(`API for model ${selectedModel} not found.`);
          }
        }
      } finally {
        setIsLoading(false);
      }
    } else {
     loginModal.onOpen();
    }
  };
  
  

  const handleGenerate = () => {
    generateImage();
  };

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

  const openImageInNewTab = (img : any) => {
    if (img && img.src) {
      const link = document.createElement('a');
      link.href = img.src;
      link.target = '_blank';
      link.download = 'image.png'; // Provide a default name for the downloaded image
      link.click();
    }
  };
  
  return (
    <div style={{
      display:'grid',
      height:!mobileSize ? '850px' : '2000px',
      gridTemplateColumns: !mobileSize ? '40% 60%' : undefined,
      gridTemplateRows: mobileSize ? '50% 50%' : undefined,
    }}>
      <div className="px-4 lg:px-8 bg-transparent" style={{ overflowY: !mobileSize ? 'scroll' : undefined, height:'850px'  }}>
      <div className="flex items-center">
        <h2 className="text-2xl text-blue-900 font-extrabold">Text Prompt</h2>
        <button className="ml-2 text-gray-500 hover:text-blue-500">
          <span role="img" aria-label="Help">
            ❓
          </span>
        </button>
      </div>
      <div className="relative flex items-center">
        <p className=" text-gray-400 font-bold text-lg">
          Describe what you want the AI to create
        </p>
        <button className="bg-gray-200 text-gray-500 py-1 px-2 rounded-md ml-auto"      
       onClick={handleSurpriseMeClick}>
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Surprise Me
        </button>
      </div>
      <input
        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"// Remove left padding
        type="text"
        placeholder="Your text prompt"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />

      <h2 className="text-2xl pt-5 text-blue-900 font-extrabold">Choose a style : <span className="text-1xl ">{selectedStyle}</span> </h2>
      <PickStyle onSelectedStyleChange={handleSelectedStyleChange} />
      <div
      className={`save-time-container ${clicked ? "clicked" : ""}`}
      onClick={handleButtonClick}
    >
      <div className="inner-effect"></div>
      <p>Fast Process (+2 credits)</p>
      <Clock/>
    </div>
      <div className="flex gap-3">
        <h2 className="text-2xl pt-5 text-blue-900 font-extrabold">Algorithm Model</h2>
        <div>
          <select className="bloc w-200 px-4 mt-4 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={selectedModel} onChange={handleModelChange}>
            <option value="Stable Diffusion XL 1.0">Stable Diffusion XL 1.0 (Pro only)</option>
            <option value="Stable Diffusion XL 0.9">Stable Diffusion XL 0.9 (Pro only)</option>
            <option value="Stable Diffusion XL 0.8">Stable Diffusion XL 0.8</option>
            <option value="Stable Diffusion 2.1">Stable Diffusion 2.1</option>
            <option value="Stable Diffusion 1.5">Stable Diffusion 1.5</option>
            <option value="DALL E2">DALL E2</option>
          </select>
          <p>Selected Model: {selectedModel}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-7">
        <h2 className="text-2xl  text-blue-900 font-extrabold">Dimensions</h2>
        <select className="bloc w-200 px-4 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={`${height}x${width}`} onChange={handleDimensions}>
          <option value="512x512">512x512</option>
          <option value="1024x1024">1024x1024</option>
          <option value="2048x2048">2K</option>
        </select>
      </div>
      <div className="flex gap-3 mt-7">
        <h2 className="text-2xl pt-5 text-blue-900 font-extrabold">Samples</h2>
        <select className="bloc w-200 px-4 mt-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={selectedSamples} onChange={handleSamples}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
        </select>
      </div>

      <div className="flex mt-7 gap-3">
        <h2 className="text-2xl text-blue-900 font-extrabold">CFG_Scale</h2>
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
      </div>

      <div className="flex mt-7 gap-3">
        <h2 className="text-2xl text-blue-900 font-extrabold">Steps</h2>
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
      </div>

      <div className="flex mt-7 gap-3">
        <h2 className="text-2xl text-blue-900 font-extrabold">Seed</h2>
        <input
          className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"// Remove left padding
          type="text"
          placeholder="Seed"
          value={seed}
          onChange={handleSeed}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="mt-4 w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
        // Attach the click event handler
        >
        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 ">
         {isLoading ? 'Generating...' : 'Generate'}
        </span>
      </Button>
    </div>
    <div  style={{ overflowY: !mobileSize ? 'scroll' : undefined, height:'850px' }}>
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-4xl font-bold">Explore the Power of AI</h2>
        <p className="text-gray-500 text-lg">
          Chat with the Smartest AI - Experience the Power of AI
        </p>
      </div>
      {isLoading && (
        <div className="p-20">
          <Loader />
        </div>
      )}

      {(!image || image.length === 0) && !isLoading && photos.length === 0 && (
        <Empty label="No images generated." />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {Array.isArray(image) && image.length > 0 ? (
          image.map((img, index) => (
            <Card key={index} className="">
            <div className="relative aspect-square">
              <Image height={img.height} width={img.width} src={img.src} alt={`Generated Image ${index + 1}`} />
            </div>
            <CardFooter className="p-2">
            <Button onClick={() => openImageInNewTab(img)} variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleEnhance}>Enhance</Button>
              <Button onClick={handleUpscale}>Upscale</Button>
              <PublishButton imageId={imageId} />
            </CardFooter>
          </Card>
          ))
        ) : !isLoading && photos === null ? (
          <Empty label="No images generated." />
        ) : null}
      </div>
  
    

      {photos && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {photos.map((src) => (
            <Card key={src} className="rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image fill alt="Generated" src={src} />
            </div>
            <CardFooter className="p-2">
              <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Open Image
              </Button>
              <Button onClick={handleEnhance}>Enhance</Button>
              <Button onClick={handleUpscale}>Upscale</Button>
              <PublishButton imageId={imageId} />
            </CardFooter>
          </Card>
          ))}
    </div>
      )}
   </div>
   </div>
  )}

