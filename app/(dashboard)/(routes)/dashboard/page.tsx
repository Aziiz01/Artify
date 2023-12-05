"use client";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ImageCard, ImageCardFooter } from "@/components/ui/image_card";
import Image from "next/image";
import { useProModal } from "@/hook/use-pro-modal";
import { Button } from "@/components/ui/button"; // Import the Button component
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { Clock, Download, ImageIcon } from "lucide-react";
import { SDXL } from '../../../api/sdxl-v1/route'; // Import the function
import { toast } from "react-hot-toast";
import { promptOptions } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faLightbulb, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { PublishButton } from "@/components/publish_button";
import { clerkClient } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/hook/use-login-modal";
import PickStyle from "@/components/ui/pickStyle";
import "../../style.css";
import Modal from 'react-modal';
import { SampleButton } from "@/components/ui/sample_button";

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const proModal = useProModal();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<HTMLImageElement[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('bad,blurry');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState('stable-diffusion-xl-1024-v1-0');
  const [height, setHeight] = useState(1024);
  const [width, setWidth] = useState(1024);
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
  const [selectedRatio, setSelectedRatio] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);


  
  
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




 
  const ratioMappings: { [key: string]: { width: number; height: number; selectable: boolean } } = {
    '1:1': { 
      width: selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9" ? 1024 : 512,
      height: selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9" ? 1024 : 512,
      selectable: true 
    },
    '4:3': { width: 1152, height: 896, selectable: selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9" },
    '16:9': { width: 1344, height: 768, selectable: selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9" },
    '9:16': { width: 768, height: 1344, selectable: selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9" },
    '3:4': { width: 896, height: 1152, selectable: selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9" },
  };
  
  
 
  
  const handleRatioClick = (ratio: string) => {
    const dimensions = ratioMappings[ratio];
    if (dimensions) {
      setSelectedDimensions(dimensions);
      setWidth(dimensions.width);
      setHeight(dimensions.height);
      setSelectedRatio(ratio);

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
    resolution: `${512}x${512}`,
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
        await axios.post('/api/dalleStorage', { url, values, documentId });
        }     
       } else { 
        console.log('saving first')
        for (const url of urls) {
          const documentId = generateRandomId();
          setImageId(documentId);
         await axios.post('/api/dalleStorage', { url, values, documentId });
        }   
         setPhotos(urls);
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
  const saveImagesPromises = images.map(async (img : any) => {
    const generatedImage = img.src;
    const base64Data = generatedImage.split(',')[1];
    const documentId = generateRandomId();
    setImageId(documentId);
    if (selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9") {
      setHeight(height)
      setWidth(width)
    } else {
      setHeight(512)
      setWidth(512)
    }

    try {
      await axios.post('/api/sdxlStorage', {
     documentId,
     textInput,
     negativePrompt,
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

  try {
    await Promise.all(saveImagesPromises);
    console.log("Images saved successfully");
  } catch (error) {
    console.error("Error saving images:", error);
    toast.error("Failed to save some images.");
  }
};

  const generateImage = async () => {
    setIsLoading(true);
    //router.refresh();
    if (isSignedIn) {
      const userId = user.id;
      try {
        if (selectedModel === 'DALL E2') {
          await DALLE(values);
        } else {
            try {
              if (selectedModel === "stable-diffusion-xl-1024-v1-0" || selectedModel === "stable-diffusion-xl-1024-v0-9") {
                setHeight(height)
                setWidth(width)
              } else {
                setHeight(512)
                setWidth(512)
              }
              const generatedImages = await SDXL(userId, textInput,negativePrompt, selectedStyle, selectedSamples,height,width,selectedModel,cfgScale, seed, steps,fast_count);
              if (generatedImages !== null && generatedImages !== false) {
                if (displayImagesImmediately) {
                  setImage(generatedImages);
                  saveImagesInBackground(generatedImages);
                } else { 
                  saveImagesInBackground(generatedImages);
                  setImage(generatedImages);
                }
               // router.refresh();
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
            
         
        }
      } finally {
        setIsLoading(false);
        router.refresh();

      }
    } else {
     loginModal.onOpen();
    }
  };
  

  
  const openModal = (image: HTMLImageElement) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
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
  const openImageInNewWindow = (img : any) => {
    const fullSizeImage = img.src; // Replace this with the appropriate property of your image object
    window.open(fullSizeImage, '_blank', 'width=auto,height=auto');
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
  const modalStyle = {
    // Add your custom modal styles here
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      maxWidth: '800px',
      margin: 'auto',
    },
  };
 return(
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
            <option value="stable-diffusion-xl-1024-v1-0">Stable Diffusion XL 1.0 (Pro only)</option>
            <option value="stable-diffusion-xl-1024-v0-9">Stable Diffusion XL 0.9 (Pro only)</option>
            <option value="stable-diffusion-v1-6">Stable Diffusion 1.6</option>
            <option value="DALL E2">DALL E2</option>
          </select>
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
        
       <h2 className="block text-mm text-blue-900 font-extrabold mb-2 mt-3">Negative Prompt</h2>
         <div className="relative">
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
        type="text"
        placeholder="What you want to avoid"
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
      />
    </div>
  
  
       <div className="flex gap-2">
       <h2 className="block text-mm text-blue-900 font-extrabold mb-2 mt-3">Aspect Ratio</h2>
       {Object.entries(ratioMappings).map(([ratio, { width, height, selectable }]) => (
  <button
    key={ratio}
    className={`bloc w-16 text-base rounded-lg ${
      !selectable
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
        : ratio === selectedRatio
        ? 'bg-gray-300 text-gray-700 border border-gray-500'
        : 'bg-gray-50 text-gray-900 focus:ring-blue-900 focus:border-red-500 border border-gray-300'
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
      <h2 className="text-4xl mt-5 text-blue-900 font-extrabold">
          Generate Art</h2>
        <p className="text-gray-500 text-lg">
        Text-to-Image Wizardry: Bring Words to Life with AI-Powered Imaging        </p>
      </div>
      {isLoading && (
        <div className="p-20">
          <Loader />
        </div>
      )}

      {(!image || image.length === 0) && !isLoading && photos.length === 0 && (
        <Empty label="No images generated." />
      )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ml-2 mr-2">
  {Array.isArray(image) && image.length > 0 ? (
    image.map((img, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="image-container" onClick={() => openModal(img)}>
          <Image
            className="rounded-lg image-hover"
            src={img.src}
            alt={`Generated Image ${index + 1}`}
            height={1024}
            width={1024}
          />
          <div className="image-overlay">
            <p className="text-white">Click to view in full size</p>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          <Button onClick={() => openImageInNewTab(img)} variant="secondary">
            <Download className="h-3 w-3 mr-1" /> Download
          </Button>
          <Button onClick={handleEnhance} variant="secondary">
            <FontAwesomeIcon icon={faWandSparkles} className="h-3 w-3 mr-1" /> Enhance
          </Button>
          <Button onClick={handleUpscale} variant="secondary">
            <FontAwesomeIcon icon={faExpand} className="h-3 w-3 mr-1" /> Upscale
          </Button>
          <PublishButton imageId={imageId} />
        </div>
      </div>
    ))
  ) : !isLoading && photos === null ? (
    <Empty label="No images generated." />
  ) : null}
</div>
  
<Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Image Modal"
      style={modalStyle}
    >
      {selectedImage && (
        <div className="vertical-modal-container">
          <div className="modal-image-container">
            <Image
              src={selectedImage.src}
              alt="selectedImage"
              fill
              className="image"
            />
             <div className="image-text-container">
              <p className="image-text">{textInput}</p>
            </div>
          </div> 
        </div>
      )}
    </Modal>
  

      {photos && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {photos.map((src) => (
            <ImageCard key={src} className="rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image fill alt="Generated" src={src} />
            </div>
            <ImageCardFooter className="p-2">
              <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Open Image
              </Button>
              <Button onClick={handleEnhance}>Enhance</Button>
              <Button onClick={handleUpscale}>Upscale</Button>
              <PublishButton imageId={imageId} />
            </ImageCardFooter>
          </ImageCard>
          ))}
    </div>
      )}
   </div>
   </div>
  )}

