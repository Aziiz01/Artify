"use client"
import { useState } from "react";
import { Button } from "./ui/button"
import Image from "next/image"
import { Download } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PublishButton } from "./publish_button";
import { faExpand, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';


export interface imageData{
    text_prompts: string,
    style_preset : string,
    samples : number,
    algoModel:string,
    width:number,
    height:number,
    cfg_scale:number,
    steps:number,
    seed:number
    negativePrompt: string
    //fast_count:number|undefined
  }

export default function ImageContainer({base64Images, imageData}:{base64Images:string[] , imageData:imageData}) {
  
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageId, setImageId] = useState("");

  const openModal = (base64:any) => {
    setSelectedImage(base64);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
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
  const openImageInNewTab = (base64 : any) => {
    if (base64) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${base64}`;
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



  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ml-2 mr-2">
        {Array.isArray(base64Images) && base64Images.length > 0 ? (
          base64Images.map((base64, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="image-container" onClick={() => openModal(base64)}>
                <Image 
                  className="rounded-lg image-hover"
                  key={index} 
                  src={`data:image/png;base64,${base64}`} 
                  alt={`Generated Image ${index + 1}`}             
                  height={1024}
                  width={1024}/>
                <div className="image-overlay">
                  <p className="text-white">Click to view in full size</p>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                <Button onClick={() => openImageInNewTab(base64)} variant="secondary">
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
        ):(<></>)}
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
                <p className="image-text">{imageData.text_prompts}</p>
              </div>
            </div> 
          </div>
        )}
        </Modal> 
      </>
  )
}