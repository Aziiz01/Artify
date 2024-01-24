'use client'
import React from 'react';
import { styleData } from '@/app/static/styles';

interface SelectedStyleCardProps {
  selectedStyle: string;
}

const SelectedStyleCard: React.FC<SelectedStyleCardProps> = ({ selectedStyle }) => {
  // Replace 'styleData' with the actual data structure of your styles
  const selectedStyleData = styleData.find((style) => style.style === selectedStyle);

  if (!selectedStyleData) {
    return null; // Render nothing if the selected style is not found
  }

  return (
    <div
      style={{
        backgroundImage: `url(${selectedStyleData.backgroundImg})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: '150px',
        height: '150px',
        marginRight: '10px',
      }}
    >
      {selectedStyleData.style}
    </div>
  );
};

export default SelectedStyleCard;
