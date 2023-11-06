import React from 'react'
import Link from 'next/link'
import Image from 'next/image';

interface CardProps{
    url:string;
    imageSrc: string;
    title:string;
    description:string;    
  }

export default function CardModel({url, imageSrc, title, description}:CardProps) {
  return (
    <Link href={url}>
        <div className="flex flex-col w-400 h-600 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:transform hover:scale-110 transition-transform" >
            <div>
                <Image className="rounded-t-lg " src={imageSrc} alt="" width='400' height='400'/>
            </div>
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
            </div>
        </div>
    </Link>    
  )
}
