'use client'
import Image from 'next/image';
import React, { useState } from 'react';


interface ModalProps {
    selectedImage: ImageData | null;
    open: boolean;
    onClose: () => void;
  }
  interface ImageData {
    id: string;
    imageUrl: string;
    prompt: string;
    likes: string[];
    height: number;
    width: number;
    style : string,
    model : string
  }
 export const Modal: React.FC<ModalProps> = ({ open, onClose , selectedImage}) => {

    if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      {selectedImage && (

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
<Image
          src={selectedImage.imageUrl}
          alt={selectedImage.prompt}
          height={selectedImage.height}
          width={selectedImage.width}
          className="image"
        />        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
            <p>Do you want a</p>
            <h1>$20 CREDIT</h1>
            <p>for your first tade?</p>
          </div>
          <div className='btnContainer'>
            <button className='btnPrimary'>
              <span className='bold'>YES</span>, 
            </button>
            <button className='btnOutline'>
              <span className='bold'>NO</span>, thanks
            </button>
          </div>
          
        </div>
          
      </div>
      )}
    </div>
  );
};

