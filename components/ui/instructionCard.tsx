import React from 'react';

interface InstructionCardProps {
  title: string;
  description: string;
}

export default function InstructionCard({ title, description }: InstructionCardProps) {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
      <div className="bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8 hover:transform hover:scale-110 transition-transform">
        <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-extrabold mb-2">{title}</h1>
        <p className="text-lg font-normal text-gray-800 dark:text-gray-100 mb-6">{description}</p>
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800" style={{ zIndex: 1 }}>
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Try Now
          </span>
        </button>
      </div>
    </div>
  );
}
