"use client"
import React from 'react';
import { useState } from 'react';
import robot from '@/public/robot.jpg';

export default function PickStyle({ onSelectedStyleChange }: { onSelectedStyleChange: (newSelectedStyle: string) => void }) {
  const [selected, setSelected] = useState<string>('');

  const styleData = [
    {
      backgroundImg: robot.src,
      style: 'anime',
    },
    {
      backgroundImg: robot.src,
      style: 'photographic',
    },
    {
      backgroundImg: robot.src,
      style: '3d-model',
    },
    {
      backgroundImg: robot.src,
      style: 'cinematic',
    },
  ];

  const handleSelectStyle = (style: string) => {
    setSelected(style);
    onSelectedStyleChange(style); // Pass the selected style to the parent component
  };

  return (
    <>
      <div className="border-blue-400 flex" style={{ width: '500px', height: '100px', gap: '5px' }}>
        {styleData.map((style) => (
          <div
            key={style.style}
            style={{
              backgroundImage: `url(${style.backgroundImg})`,
              backgroundPosition: 'center',
              backgroundSize: 'fit',
              width: '90px',
              height: '90px',
              cursor: 'pointer',
              filter:selected === style.style ? 'blur(1px)' : 'none',
            }}
            onClick={() => handleSelectStyle(style.style)}
          >
            {style.style}
          </div>
        ))}

      </div>
    </>
  );
}
