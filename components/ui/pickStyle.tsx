"use client"
import React, { useState } from 'react';
import Modal from 'react-modal';
import { styleData } from '@/app/static/styles';
import "@/app/(dashboard)/style.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import SelectedStyleCard from './selectedCard';
export default function PickStyle({ onSelectedStyleChange }: { onSelectedStyleChange: (newSelectedStyle: string) => void }) {
  const [selected, setSelected] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectStyle = (style: string) => {
    setSelected(style);
    onSelectedStyleChange(style);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    content: {
      maxWidth: '800px',
      margin: 'auto',
    },
  };

  const stylesGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // Set four cards per row
    gap: '10px', // Adjust the gap between cards
  };
   
  return (
    <>  
          <div style={{ display: 'flex', alignItems: 'center' }}>


      <button
       className="button-surprise mr-10 ml-auto mb-1"
       onClick={openModal}>      
     <FontAwesomeIcon icon={faPalette} className="mr-1" />
       Pick Style</button>
       <SelectedStyleCard selectedStyle={selected} />

       </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Style Modal"
        style={modalStyle}
      >
        <div style={stylesGrid}>
          {styleData.map((style) => (
            <div
              key={style.style}
              style={{
                backgroundImage: `url(${style.backgroundImg})`,
                backgroundPosition: 'center',
                backgroundSize: 'auto',
                width: '100%',
                height: '200px',
                cursor: 'pointer',
                filter: selected === style.style ? 'blur(1px)' : 'none',
              }}
              onClick={() => handleSelectStyle(style.style)}
            >
              {style.style}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '20px',
          }}
          onClick={closeModal}
        >
          &#10006;
        </div>
      </Modal>
    </>
  );
}
