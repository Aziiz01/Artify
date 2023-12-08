'use client'
// to implement passedImage 
import React, { useState, ChangeEvent, useEffect } from "react";
import * as Generation from "../../../generation/generation_pb";
import {
  executeGenerationRequest,
  onGenerationComplete,
  buildGenerationRequest,
} from "../../../../lib/helpers";// Adjust the import path as needed
import { client, metadata } from "../../../../lib/grpc-client";
import Image from "next/image";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { useRouter, useSearchParams } from 'next/navigation'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import { useProModal } from "@/hook/use-pro-modal";
import axios from "axios";
import { useLoginModal } from "@/hook/use-login-modal";
import { PublishButton } from "@/components/publish_button";
import "../../style.css"
import { Upscale } from "@/app/api/upscale/route";
export default function UpscalePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [passedImage, setPassedImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<HTMLImageElement[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');
  const proModal = useProModal();
  const [documentId, setImageId] = useState("");
  const loginModal = useLoginModal();
  const [mobileSize, setMobileSize] = useState(false)
  const [displayImagesImmediately, setDisplayImagesImmediately] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [fast_count, setCount] = useState(0);

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
  }, [imageId])


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
            console.log(`Image width: ${imageElement.width} height: ${imageElement.height}`);
          };
        }
      };

      reader.readAsDataURL(file);
    }
  };
  const openImageInNewTab = (img: any) => {
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

  const saveImagesInBackground = async (images: any, selectedModel: string) => {
    // Save the images in the background
    const saveImagesPromises = images.map(async (img: any) => {
      const generatedImage = img.src;
      const base64Data = generatedImage.split(',')[1];
      const documentId = generateRandomId();
      setImageId(documentId);
      const height = 2048;
      const width = 2048;
      try {
        await axios.post('/api/sdxlStorage', {
          documentId,
          selectedModel,
          base64Data,
          height,
          width
        });
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }

      return img;
    });

    // Wait for all image save promises to resolve (in the background)
    try {
      await Promise.all(saveImagesPromises);
      // Optionally, update the UI or perform any actions after saving is complete
      console.log("Images saved successfully");
    } catch (error) {
      console.error("Error saving images:", error);
      toast.error("Failed to save some images.");
    }
  };



  const handleEnhance = (event: any) => {
    const url = `/image-to-image?imageId=${imageId}`;
    window.location.href = url;
  };

  const handleUpscale = async () => {
    setIsLoading(true);
    if (!isSignedIn) {
      loginModal.onOpen();
      return;
    } else {
      const userId = user.id;
      try {
        const imageElement = document.createElement("img");
        if (passedImage) {
          imageElement.src = passedImage;
        }
        else if (uploadedImage) {
          imageElement.src = URL.createObjectURL(uploadedImage)
        }

        imageElement.onload = async () => {
          console.log("Image dimensions:", imageElement.width, imageElement.height);

          const width = imageElement.width;
          const height = imageElement.height;

          let selectedModel;

          if (width === 512 && height === 512) {
            selectedModel = "stable-diffusion-x4-latent-upscaler";
          } else if (width === 1024 && height === 1024) {
            selectedModel = "esrgan-v1-x2plus";
          } else {
            console.error("Invalid image dimensions. Expected 512x512 or 1024x1024.");
            setIsLoading(false);
            return;
          }
              try {
                const generatedImages = await Upscale(userId, uploadedImage,passedImage,selectedModel,fast_count);

                if (generatedImages !== null && generatedImages !== -1 && generatedImages !== false) {
                  if (displayImagesImmediately) {
                    console.log('displaying first')
                    setGeneratedImage(generatedImages);
                    saveImagesInBackground(generatedImages, selectedModel);
                  } else {
                    console.log('saving first')
                    saveImagesInBackground(generatedImages, selectedModel);
                    setGeneratedImage(generatedImages);
                  }
                  setIsLoading(false);

                } else if (!generatedImages) {
                  proModal.onOpen();
                  setIsLoading(false);
                } else if (generatedImages == -1 || generatedImages == null){
                  setIsLoading(false);
                }
                  router.refresh();
              } catch (error) {
                console.error("Failed to make image-upscale request:", error);
                setIsLoading(false);
              }
            }
          
        
      } catch (error) {
        console.error("Error handling image:", error);
        setIsLoading(false);
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
      display: 'grid',
      height: !mobileSize ? '850px' : '2000px',
      gridTemplateColumns: !mobileSize ? '40% 60%' : undefined,
      gridTemplateRows: mobileSize ? '10% 90%' : undefined,
      backgroundColor: 'transparent'
    }}>
      <div className="px-4 lg:px-8 bg-transparent" style={{ overflowY: !mobileSize ? 'scroll' : undefined, height: '850px' }}>
      <div className="bg-white rounded-lg p-4 mb-4 mt-4">

        <h2 className="text-mm mt-5 text-blue-900 font-extrabold">Image Upscaler</h2>
        <input type="file" onChange={handleImageUpload} className="mt-4 block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
        {passedImage || uploadedImage ? (
          <Image
            priority={true}
            width={512}
            height={512}
            src={passedImage || (uploadedImage ? URL.createObjectURL(uploadedImage) : "")}
            alt="Uploaded image"
          />
        ) : null}
         <div
      className={`save-time-container ${clicked ? "clicked" : ""}`}
      onClick={handleButtonClick}
    >
      <div className="inner-effect"></div>
      <p>Fast Process (+2 credits)</p>
      <Clock />
    </div>
        <Button
          onClick={handleUpscale} disabled={isLoading}
          className="mt-4 w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-black   dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
variant="premium">
          <span>
            {isLoading ? 'Upscaling...' : 'Upscale'}
          </span>
        </Button>
      </div>
      </div>
      <div style={{ overflowY: !mobileSize ? 'scroll' : undefined, height: '850px' }}>
        <div className="mb-8 space-y-4 text-center">
          <h2 className="text-4xl mt-5 text-blue-900 font-extrabold">
Upscale Images       
   </h2>
          <p className="text-gray-500 text-lg">
          Enhance Your Visual Odyssey: Unleashing the Power of 2x Upscaling AI          </p>
        </div>
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {generatedImage == null && !isLoading && (
 <div className="mb-5">
 <Empty label="No images generated." />
 </div>
         )}

        <>
          <br />
          {generatedImage && (
            <>
              <h2>Upscaled Image:</h2>
              {generatedImage.map((img, index) => (
                <Card key={index} className="">
                  <div className="relative aspect-square">
                    <Image priority={false} height={img.height} width={img.width} src={img.src} alt={`Generated Image ${index + 1}`} />
                  </div>
                  <CardFooter className="p-2">
                    <Button onClick={() => openImageInNewTab(img)} variant="secondary" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleEnhance}>Enhance</Button>
                    <PublishButton imageId={documentId} />
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </>

      </div>
    </div>
  );
}