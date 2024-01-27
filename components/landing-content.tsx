"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Special_button } from "./ui/special_button";
import { Footer } from "./footer";
const testimonials = [
  {
    name: "Joel",
    avatar: "J",
    title: "Software Engineer",
    description: "This is the best application I've ever used!",
  },
  {
    name: "Antonio",
    avatar: "A",
    title: "Designer",
    description: "I use this daily for generating new photos!",
  },
  {
    name: "Mark",
    avatar: "M",
    title: "CEO",
    description: "This app has changed my life, cannot imagine working without it!",
  },
  {
    name: "Mary",
    avatar: "M",
    title: "CFO",
    description: "The best in class, definitely worth the premium subscription!",
  },
];

export const LandingContent = () => {
  return (
    <>


<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/cyberpunk.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/realistic.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (6).png" alt=""/>
        </div>
    </div>
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/front.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (17).png" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (19).png" alt=""/>
        </div>
    </div>
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/god.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (3).png" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image.png"alt=""/>
        </div>
    </div>
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (32).png" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (36).png" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="/image (38).png" alt="" />
        </div>
    </div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-48 mb-48">
        <div className="order-2 md:order-1 ml-20">
          <Image className="h-auto max-w-full rounded-lg" src="/tutorial1.png" height={350} width={400} alt="" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-5xl text-white mb-10">   Use AI For Creating Art! 🚀
</h2>
          <p className="text-white text-2xl">Transform text into vivid images effortlessly with our revolutionary AI art generation tool.</p>
          <Link href="/dashboard">
            <div  className="w-1/2 mt-10 ml-28">
         <Special_button  buttonText="Get Started ✨"/></div>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-48 mb-48">
  <div className="order-2 md:order-1 ml-20">
    <h2 className="text-5xl text-white  mb-10">  Presenting Our Enhancing Tool 🎨
</h2>
    <p className="text-white text-2xl">Simply upload your photo, input a description, and witness our cutting-edge AI enhance it into stunning artwork.</p>
    <Link href="/dashboard">
      <div className="w-1/2 mt-10 mr-28">
        <Special_button buttonText="Get Started ✨" />
      </div>
    </Link>
  </div>
  <div className="order-1 md:order-2 ml-28">
    <Image className="h-auto max-w-full rounded-lg" src="/tutorial1.png" height={350} width={400} alt="" />
  </div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-48 mb-48">
        <div className="order-2 md:order-1 ml-20">
          <Image className="h-auto max-w-full rounded-lg" src="/tutorial1.png" height={350} width={400} alt="" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-5xl text-white  mb-10">Upscale 2x 🔍</h2>
          <p className="text-white text-2xl">Make your pictures look better with our upscaling tool – it enhances the quality of your images.</p>
          <Link href="/dashboard">
            <div  className="w-1/2 mt-10 ml-28">
         <Special_button  buttonText="Get Started ✨"/></div>
          </Link>
        </div>
      </div>
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">  🌟 Our Happy Customers! 🌟
</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>

    </>
  )
}