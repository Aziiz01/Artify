'use client'

import React, { useState, ChangeEvent } from "react";
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
import axios from "axios";
import { useLoginModal } from "@/hook/use-login-modal";
import PickStyle from "@/components/ui/pickStyle";
import { PublishButton } from "@/components/publish_button";
import "../../style.css";
import { Clock } from "lucide-react";
import { Enhance } from "@/app/api/enhance/route";
import { SampleButton } from "@/components/ui/sample_button";
import { Fast_process } from "@/components/ui/fast_process";
import { Special_button } from "@/components/ui/special_button";
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
const [cfgScale, setCfgScale] = useState(5); 
const [image_strength, setImgStrength] = useState(0.35); // Set an initial value, e.g., 0
  const [steps, setSteps] = useState(30); // Set an initial value, e.g., 0
  const [seed, setSeed] = useState(123463446);
  const searchParams = useSearchParams()
  const imageId = searchParams.get('imageId')
  const [f_imageId,setImageId] = useState("");
  const proModal = useProModal();
  const loginModal = useLoginModal();
  const [mobileSize, setMobileSize] = useState(false) 
  const [displayImagesImmediately, setDisplayImagesImmediately] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [fast_count, setCount] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('bad,blurry');
  const [selectedModel, setSelectedModel] = useState('stable-diffusion-xl-1024-v1-0');

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

  const handleSelectedStyleChange = (newSelectedStyle: string) => {
    setSelectedStyle(newSelectedStyle);
  };
  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };
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



  const handleSeed = (event: any) => {
    setSeed(event.target.value);
  };
  
  const handleSamples = (value : number) => {
    setSelectedSamples(value);
  };
  const handleCFG = (event: any) => {
    const selectedCFG = event.target.value;
    setCfgScale(selectedCFG);
  };
  const handleImgStrength = (event: any) => {
    const selectedStrength = event.target.value;
    setImgStrength(selectedStrength);
  };
  const handleSteps = (event: any) => {
    const selectedSteps = event.target.value;
    setSteps(selectedSteps);
  };
  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedImage(file);
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
  function generateRandomId() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomPart}`;
  }
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
  // Define a function to save images in the background
const saveImagesInBackground = async (images : any) => {
  // Save the images in the background
  const saveImagesPromises = images.map(async (img : any) => {
    const generatedImage = img.src;
    const base64Data = generatedImage.split(',')[1];
    const documentId = generateRandomId();
    setImageId(documentId);
    const height = 1024;
    const width = 1024;
    try {
      await axios.post('/api/sdxlStorage', {
        documentId,
        textInput,
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
  const handleGenerate = async () => {
    setIsLoading(true);
    if (!isSignedIn) {
      loginModal.onOpen();
    } else {
      const userId = user.id;
      try {
          const generatedImages = await Enhance(userId,uploadedImage,passedImage,textInput,negativePrompt,image_strength,selectedSamples,selectedModel,selectedStyle,cfgScale,seed,steps,fast_count)
          if (generatedImages !== null && generatedImages !== false) {
            if (displayImagesImmediately) {
              console.log('displaying first')
              setGeneratedImage(generatedImages);
              saveImagesInBackground(generatedImages);
            } else  { 
              console.log('saving first')
              saveImagesInBackground(generatedImages);
              setGeneratedImage(generatedImages);
            }
            setIsLoading(false);
          } else if (!generatedImages) {
            proModal.onOpen();
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
          router.refresh();

        }
       catch (error) {
        setIsLoading(false);
        console.error("Failed to make image-to-image request:", error);
      }
    } 
  };
  
  const handleButtonClick = () => {
    setClicked(!clicked);
    setDisplayImagesImmediately(!displayImagesImmediately)
    const newCount = clicked ? 0 : 2;
    setCount(newCount);
  };

  return (
    <div style={{
      display:'grid',
      height:!mobileSize ? '850px' : '2000px',
      gridTemplateColumns: !mobileSize ? '40% 60%' : undefined,
      gridTemplateRows: mobileSize ? '50% 50%' : undefined,
    }}>
      <div className="px-4 lg:px-8 bg-transparent" style={{ overflowY: !mobileSize ? 'scroll' : undefined, height:'850px' }}>
      <div className="form p-4 mb-4 mt-4">
   <div className="flex flex-col">
  <div className="span">Text Prompt</div>
 
  <input className="input"
        type="text"
        placeholder="Describe what you want the AI to create"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)} />
</div> 
        
{ passedImage =='' ? ( 
  <>
  <div className="span">
   Input init image
 </div>      
  <input type="file" className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" onChange={handleImageUpload} />
</>
): null}             {passedImage || uploadedImage ? (
              <Image
                width={512}
                height={512}
                src={passedImage || (uploadedImage ? URL.createObjectURL(uploadedImage) : "")}
                alt="Uploaded image"
              />
              ) : null}
<div className="flex flex-col">
  <div className="span">Pick a Style: {selectedStyle}</div>
  <div className="ml-auto">
    <PickStyle onSelectedStyleChange={handleSelectedStyleChange} />
  </div>
</div>



<div className="flex gap-3">
  <div className="span">Samples</div>
  <div className="flex gap-2">
    <div className="login-with">
      {[1, 2, 6, 8, 10].map((value) => (
        <div
          className={`button-log ${selectedSamples === value ? 'selected' : ''}`}
          onClick={() => handleSamples(value)}
          key={value}
        >
          <b>{value}</b>
        </div>
      ))}
    </div>
  </div>
</div>

  
<div className="flex gap-3">
    <div className="span mt-2">Algorithm Model</div>
    <div>
          <select className="bloc w-200 px-4 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={selectedModel} onChange={handleModelChange}>
            <option value="stable-diffusion-xl-1024-v1-0">Stable Diffusion XL 1.0 (Pro only)</option>
            <option value="stable-diffusion-v1-6">Stable Diffusion 1.6</option>
          </select>
        </div>
    </div>
    <div className="flex">

<Fast_process
    clicked={clicked} 
    onClick={handleButtonClick}
  />
<div className="tooltip mt-3 ml-3">
<div className="icon">i</div>
<div className="tooltiptext">Fast Process cuts generation time by 40%, streamlining slow processes. It efficiently accelerates tasks for quicker results</div>
</div>
</div>
    <label>
        
        
<div className="flex items-center">
<div className="span mr-5">Show Advanced Options</div>
 <div className="flex gap-3 mt-5">
       
          </div>
  <div>
    <input
      id="checkbox"
      type="checkbox"
      name="checkbox"
      checked={showAdvancedOptions}
      onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
    />
    <label className="label" htmlFor="checkbox"></label>
  </div>
</div>

      </label>
      {showAdvancedOptions && (
        <>
        <div className="flex items-center">

         <div className="span mr-10">
              Image Strength
            </div>
            <input
              className="slider mt-2 mr-3"
              type="range"
              id="myRange"
              name="imageStrength"
              min={0}
              max={1}
              step={0.01} 
              value={image_strength}
              onChange={handleImgStrength}
            />
            <p>{image_strength}</p>
            </div>
           <div className="flex flex-col">

        <div className="span">Negative Prompt</div>
        <input className="input"
        type="text"
        placeholder="Describe what you want the AI to avoid"
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)} />
</div>
        <div className="flex gap-3">
      <div className="span">CFG Scale</div>
        <input
        className="slider mt-2"
          type="range"
          id="myRange"
          name="cfgScale"
          min={0}
          max={35}
          value={cfgScale}
          onChange={handleCFG}
        />
        <p>{cfgScale}</p>
        
        <div className="tooltip">
  <div className="icon">i</div>
  <div className="tooltiptext">How closely the process follows the given prompt text (higher values bring your image closer to the prompt)</div>
</div>
      </div>
      <div className="flex gap-3">
      <div className="span">Steps</div>
      <input id="myRange" className="slider mt-2" value={steps} max="150" min="10" type="range" onChange={handleSteps} />
        <p>{steps}</p> 
        <div className="tooltip">
  <div className="icon">i</div>
  <div className="tooltiptext">Number of diffusion steps to run</div>
</div>
      </div>

      <div className="flex flex-col">
      <div className="span">Seed <div className="tooltip">
  <div className="icon">i</div>
  <div className="tooltiptext">Choose either to exclude this option or input 0 to use a random seed for noise</div>
</div>
</div>
      
      <input className="input"
        type="text"
        placeholder="0 for optimized generation"
        value={seed}
        onChange={handleSeed} />
      </div>
      </>
    )}
<Special_button buttonText= {isLoading ? 'Generating...' : `Generate`}
     onClick={handleGenerate}
     disabled={isLoading}
       />
      </div>
     </div>
      <div  style={{ overflowY: !mobileSize ? 'scroll' : undefined, height:'850px' }}>
      <div className=" space-y-4 text-center">
      <h2 className="font-abc text-6xl mt-5 text-blue-900 font-extrabold">
Enhance Images
        </h2>
        <p className="text-gray-500 text-lg">
        Transform Images with Cutting-Edge Image-to-Image Models
       </p>
      </div>
     {isLoading && (
  <div className="p-20 flex justify-center items-center">
      <Loader />
  </div>
)}

          {generatedImage == null  && !isLoading && (
             <div className="flex justify-center items-center mb-5">
             <Empty label="No images generated." />
           </div>
          )}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {Array.isArray(generatedImage) && generatedImage.length > 0 ? (
          generatedImage.map((img, index) => (
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
              <PublishButton imageId={f_imageId} />
            </CardFooter>
          </Card>
          ))
        
        ) : null}
      </div>
      </div>



     
    </div>
  );
}