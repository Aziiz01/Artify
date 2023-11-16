import React from 'react';
import Image from 'next/image';

interface InstructionImageProps {
  backgroundImage: string;
  gridColumn?: string;
  gridRow?: string;
}

export default function InstructionImage({
  backgroundImage,
  gridColumn,
  gridRow,
}: InstructionImageProps) {
  const containerStyle = {
    gridColumn,
    gridRow,
  };

  return (
    <div className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-950 to-red-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded" style={containerStyle}>
      <div style={{ width: '99%', height: '99%', position: 'relative' }}>
        <Image src={backgroundImage} alt="Image Description" layout="fill" objectFit="cover" className="rounded" />
      </div>
    </div>
  );
}
