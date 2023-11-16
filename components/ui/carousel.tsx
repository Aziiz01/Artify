import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import robot from '@/public/realistic.jpg'

function Btn(){
    return(
        <Link href="/dashboard">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 hover:transform hover:scale-110 transition-transform">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Try Now
            </span>
            </button>
        </Link>
    );
}

function CarouselComponent(){
    return (
        <Carousel autoPlay infiniteLoop showArrows>
            <div style={{
                display:'flex',
                width:'100%',
                height:'700px',
                backgroundImage:`url(${robot.src})`,
                backgroundSize:'cover',
                backgroundPosition:'center',
                justifyContent:'center',
                alignItems:'center'
            }}>
                <div className='flex flex-col gap-6 z-10'>
                    <h1 className='mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'> Realistic</h1>
                    <Btn/> 
                </div>
            </div>

            <div style={{
                display:'flex',
                width:'100%',
                height:'700px',
                backgroundImage:`url(${robot.src})`,
                backgroundSize:'cover',
                backgroundPosition:'center',
                justifyContent:'center',
                alignItems:'center'

            }}>
                <div className='flex flex-col gap-6 z-10'>
                    <h1 className='mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'> Realistic</h1>
                    <Btn/> 
                </div>
            </div>
            <div style={{
                display:'flex',
                width:'100%',
                height:'700px',
                backgroundImage:`url(${robot.src})`,
                backgroundSize:'cover',
                backgroundPosition:'center',
                justifyContent:'center',
                alignItems:'center'

            }}>
                <div className='flex flex-col gap-6 z-10'>
                    <h1 className='mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'> Realistic</h1>
                    <Btn/> 
                </div>
            </div>
        </Carousel>
    );
}

export default CarouselComponent;
