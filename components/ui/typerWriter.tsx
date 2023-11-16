import React from 'react'
import TypewriterComponent from "typewriter-effect";


export default function TyperWriter() {
  return (
    <div className=" flex flex-col justify-center items-center gap-5 mt-5 ">
        <h1 className='text-4xl text-gray-200 sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'>Use Styles to elevate your creativity.</h1>
        <p className='text-1xl  text-gray-300'>Pair your text prompt with a Style for more personalized results. Our growing list of Styles cover anime, photorealism, cartoons, paintings, and much more.</p>
         <div className="mb-5 mt-10 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-pink-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
         <TypewriterComponent
           options={{
             strings: [
               "Analog-film",
               "Cenimatic",
               "Realistic",
               "Anime."
             ],
             autoStart: true,
             loop: true,
           }}
         />
         </div>
  </div>
  )
}
