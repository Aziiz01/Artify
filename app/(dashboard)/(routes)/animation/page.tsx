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
import Modal from 'react-modal';
import { useLoginModal } from "@/hook/use-login-modal";
import PickStyle from "@/components/ui/pickStyle";
import { PublishButton } from "@/components/publish_button";
import "../../style.css";
import { Clock } from "lucide-react";
import { Enhance } from "@/app/api/enhance/route";
import { SampleButton } from "@/components/ui/sample_button";
import { Fast_process } from "@/components/ui/fast_process";
import { Special_button } from "@/components/ui/special_button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { S_Loader } from "@/components/s_loader";
import { Animation_post } from "@/app/api/animation/route";
import { Result } from "@/app/api/result_animation/route";

export default function AnimationPage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [passedImage, setPassedImage] = useState('');
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [video, setVideo] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
const [cfgScale, setCfgScale] = useState(5); 
  const [motion_bucket_id, setMotion] = useState(40); // Set an initial value, e.g., 0
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
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  
  const handleMotion = (event: any) => {
    const motion_bucket_id = event.target.value;
    setMotion(motion_bucket_id);
  };
  
  const handleCFG = (event: any) => {
    const selectedCFG = event.target.value;
    setCfgScale(selectedCFG);
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
      link.download = 'animation.mp4'; // Provide a default name for the downloaded image
      link.click();
    }
  };
  function generateRandomId() {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomPart}`;
  }
  
  // Define a function to save images in the background
const saveVideoInBackground = async (video : any) => {
  // Save the images in the background
  const saveVideoPromises = video.map(async (img : any) => {
    const generatedImage = img.src;
    const base64Data = generatedImage.split(',')[1];
    const documentId = generateRandomId();
    setImageId(documentId);
    const height = 1024;
    const width = 1024;
    try {
      await axios.post('/api/sdxlStorage', {
        documentId,
        cfgScale,
        seed,
        motion_bucket_id,
        base64Data,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }

    return img;
  });

  try {
     await Promise.all(saveVideoPromises);
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
        if (uploadedImage == undefined) {
          toast.error("Please Insert An Image !");
          setIsLoading(false);
          return;
        } else {
          const id = await Animation_post(userId,uploadedImage,passedImage,seed,cfgScale,motion_bucket_id,fast_count)
          if (id !== null && id !== false ) {
            const generatedVideo = await Result(id);

            if (displayImagesImmediately) {
              console.log('displaying first')
              setVideo(generatedVideo);
              saveVideoInBackground(generatedVideo);
            } else  { 
              console.log('saving first')
              saveVideoInBackground(generatedVideo);
              setVideo(generatedVideo);
            }
            setIsLoading(false);
          } else if (!id) {
            proModal.onOpen();
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
          router.refresh();

        }}
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
 
  const openModal = (image: any) => {
      setSelectedImage(image);
    
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      maxWidth: '800px',
      margin: 'auto',
    },
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

        
{ passedImage =='' ? ( 
  <>
  <div className="span">
   Input init image (JPG/PNG Format required) (1024x576
576x1024
768x768)
 </div>      
  <input type="file" className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" onChange={handleImageUpload} />
</>
): null}       

      {passedImage || uploadedImage ? (
              <Image
                width={512}
                height={512}
                src={passedImage || (uploadedImage ? URL.createObjectURL(uploadedImage) : "")}
                alt="Uploaded image"
              />
              ) : null}


  

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

<div className="flex gap-3">
      <div className="span">CFG Scale</div>
        <input
        className="slider mt-2"
          type="range"
          id="myRange"
          name="cfgScale"
          min={0}
          max={10}
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
      <div className="span">motion_bucket_id</div>
        <input
        className="slider mt-2"
          type="range"
          id="myRange"
          name="motion"
          min={1}
          max={255}
          value={motion_bucket_id}
          onChange={handleMotion}
        />
        <p>{motion_bucket_id}</p>
        
        <div className="tooltip">
  <div className="icon">i</div>
  <div className="tooltiptext">Lower values generally result in less motion in the output video, while higher values generally result in more motion.</div>
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

  
<Special_button buttonText= {isLoading ? 'Generating...' : `Generate`}
     onClick={handleGenerate}
     disabled={isLoading}
       />
      </div>
     </div>
      <div  style={{ overflowY: !mobileSize ? 'scroll' : undefined, height:'850px' }}>
      <div className=" space-y-4 text-center">
      <h2 className="font-abc text-6xl mt-5 text-blue-900 font-extrabold">
Animate Your Images        </h2>
        <p className="text-gray-500 text-lg">
        Transform images into captivating videos effortlessly with our powerful and intuitive video generation tool.
       </p>
      </div>
     {isLoading && (
  <div className="p-20 flex justify-center items-center">
      <Loader />
  </div>
)}

          {video == null  && !isLoading && (
             <div className="flex justify-center items-center mb-5">
             <Empty label="No videos generated." />
           </div>
          )}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ml-2 mr-2">
{video ?
      <div  className="flex flex-col items-center">
        <div className="image-container" onClick={() => openModal(video)}>
        <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
            <source src={video} />
          </video>
          <div className="image-overlay">
            <p className="text-white">Click to view in full size</p>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          <Button onClick={() => openImageInNewTab(video)} variant="secondary">
            <Download className="h-3 w-3 mr-1" /> Download
          </Button>
         
          <PublishButton imageId={f_imageId} />
        </div>
      </div>
    
   : null}
</div>
<Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Image Modal"
      style={modalStyle}
    >
       <div className="absolute inset-0 flex items-center justify-center">
                <S_Loader />
              </div>

              
      {selectedImage && (
        <div className="vertical-modal-container">
          <div className="modal-image-container">
          <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
            <source src={video} />
          </video>
           
          </div> 
        </div>
      )}
    </Modal>
      </div>



     
   
    </div>
  );
}