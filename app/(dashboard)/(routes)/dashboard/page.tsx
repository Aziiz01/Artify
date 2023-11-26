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
  const [cfgScale, setCfgScale] = useState(7); // Set an initial value, e.g., 0
  const [steps, setSteps] = useState(30); // Set an initial value, e.g., 0
  const [seed, setSeed] = useState(0);
  const [imageId, setImageId] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const loginModal = useLoginModal();
  const [mobileSize, setMobileSize] = useState(false) 
  const [clicked, setClicked] = useState(false);
  const [displayImagesImmediately, setDisplayImagesImmediately] = useState(false);
  const [fast_count, setCount] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [creditCount, setCreditCount] = useState(1);

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


  type SDXLModelApiMapping = {
    [key: string]: (
      userId: string,
      prompt: string,
      selectedStyle: string,
      selectedSamples: number,
      cfgScale: number,
      height: number,
      width: number,
      seed: number,
      steps: number,
      fast_count : number
    ) => Promise<any>;
  };

  const SDXLmodelApiMapping: SDXLModelApiMapping = {
    "Stable Diffusion XL 1.0": SDXLv1,
    "Stable Diffusion XL 0.9": SDXLv09,
    "Stable Diffusion XL 0.8": SDXLv08,
    "Stable Diffusion 2.1": SDXLv21,
    "Stable Diffusion 1.6": SDXLv15,
  };
  const ratioMappings: { [key: string]: { width: number; height: number; selectable: boolean } } = {
    '1:1': { width: 512, height: 512, selectable: true },
    '4:3': { width: 1152, height: 896, selectable: selectedModel === "Stable Diffusion XL 1.0" || selectedModel === "Stable Diffusion XL 0.9" },
    '16:9': { width: 1344, height: 768, selectable: selectedModel === "Stable Diffusion XL 1.0" || selectedModel === "Stable Diffusion XL 0.9" },
    '9:16': { width: 768, height: 1344, selectable: selectedModel === "Stable Diffusion XL 1.0" || selectedModel === "Stable Diffusion XL 0.9" },
    '3:4': { width: 896, height: 1152, selectable: selectedModel === "Stable Diffusion XL 1.0" || selectedModel === "Stable Diffusion XL 0.9" },
  };
  
 
  
  const handleRatioClick = (ratio: string) => {
    const dimensions = ratioMappings[ratio];
    if (dimensions) {
      setSelectedDimensions(dimensions);
      setWidth(dimensions.width);
      setHeight(dimensions.height);
    }
  };
  const handleButtonClick = () => {
    setClicked(!clicked);
    setDisplayImagesImmediately(!displayImagesImmediately)
    const newCount = clicked ? 0 : 2;
    setCount(newCount);
  };

  const handleSeed = (event: any) => {
    setSeed(event.target.value);
  };

  const handleSamples = (value : number) => {
    setSelectedSamples(value);
  };
  
  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };
  const getRandomPromptIndex = () => {
    const randomIndex = Math.floor(Math.random() * promptOptions.length);
    return randomIndex;
  };
  const handleSurpriseMeClick = () => {
    const randomIndex = getRandomPromptIndex();
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
      if (displayImagesImmediately) {
        console.log('displaying first')
        setPhotos(urls);
        for (const url of urls) {
          const documentId = generateRandomId();
          setImageId(documentId);
    
          // Send a POST request for each URL separately
          await axios.post('/api/dalleStorage', { url, values, documentId });
        }     
       } else { 
        console.log('saving first')
        for (const url of urls) {
          const documentId = generateRandomId();
          setImageId(documentId);
    
          // Send a POST request for each URL separately
          await axios.post('/api/dalleStorage', { url, values, documentId });
        }        setPhotos(urls);
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
    if (selectedModel === "Stable Diffusion XL 1.0" || selectedModel === "Stable Diffusion XL 0.9") {
      setHeight(1024)
      setWidth(1024)
    } else {
      setHeight(512)
      setWidth(512)
    }

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
              const generatedImages = await selectedApi(userId, prompt, selectedStyle, selectedSamples,height,width,cfgScale, seed, steps,fast_count);
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
  
  const SampleButton = ({ value, selected, onClick }: { value: number, selected: number, onClick: (value: number) => void }) => (
    <button
      className={`bloc w-16 text-base text-gray-900 border border-gray-300 rounded-lg ${
        selected === value ? 'bg-gray-200' : 'bg-gray-50'
      } focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
  

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
      <div className="bg-white rounded-lg p-4 mb-4 mt-4">
  {/* Text Prompt Section */}
  <div >
    <h2 className="text-mm text-blue-900 font-extrabold">Text Prompt</h2>
    <div className="flex items-center">
      <p className="text-gray-400 font-bold text-sm">
        Describe what you want the AI to create
      </p>
      <button
        className="bg-gray-200 text-gray-500 py-1 px-2 rounded-md ml-auto mb-1"
        onClick={handleSurpriseMeClick}
      >
        <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
        Surprise Me
      </button>
    </div>

  {/* Input Section */}
   
    <div className="relative">
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        placeholder="Your text prompt"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />
    </div>
  </div>

      <h2 className="block text-mm text-blue-900 font-extrabold mb-2 mt-3">Choose a style : <span className="text-1xl ">{selectedStyle}</span> </h2>
      <PickStyle onSelectedStyleChange={handleSelectedStyleChange} />
      <div
      className={`save-time-container ${clicked ? "clicked" : ""}`}
      onClick={handleButtonClick}
    >
      <div className="inner-effect mt-3"></div>
      <p>Fast Process (+2 credits)</p>
      <Clock/>
    </div>
    <div className="flex gap-3 mt-3">
  <h2 className="text-mm pt-5 text-blue-900 font-extrabold">Samples</h2>

  <div className="flex gap-2">
    
    {[1, 2, 4, 6, 8].map((value) => (
      <SampleButton
        key={value}
        value={value}
        selected={selectedSamples}
        onClick={handleSamples}
      />
    ))}
  </div>
</div>
<div className="flex gap-3">
        <h2 className="text-mm pt-5 text-blue-900 font-extrabold">Algorithm Model</h2>
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
      <label>
        
        <div className="text-mm pt-5 text-blue-900 font-extrabold mb-2"
> Show Advanced Options <input
          type="checkbox"
          checked={showAdvancedOptions}
          onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
        /></div>

      </label>
      {showAdvancedOptions && (
        <>
       <div className="flex gap-2">
       <h2 className="block text-mm text-blue-900 font-extrabold mb-2 mt-3">Aspect Ratio</h2>
  {Object.entries(ratioMappings).map(([ratio, { width, height, selectable }]) => (
    <button
      key={ratio}
      className={`bloc w-16 text-base text-gray-900 border border-gray-300 rounded-lg ${
        !selectable ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50 focus:ring-blue-900 focus:border-red-500'
      } dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      onClick={() => selectable && handleRatioClick(ratio)}
      disabled={!selectable}
    >
      {ratio}

    </button>
  ))}
</div>


      <div className="flex mt-7 gap-3">
        <h2 className="text-mm text-blue-900 font-extrabold">CFG_Scale</h2>
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
        <h2 className="text-mm text-blue-900 font-extrabold">Steps</h2>
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
        <h2 className="text-mm text-blue-900 font-extrabold">Seed</h2>
        <input
          className="w-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          placeholder="Seed"
          value={seed}
          onChange={handleSeed}
        />
      </div>
      </>
    )}
      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="mt-4 w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-black   dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
variant="premium">
        <span>
         {isLoading ? 'Generating...' : `Generate`}
        </span>
      </Button>
    </div>
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

