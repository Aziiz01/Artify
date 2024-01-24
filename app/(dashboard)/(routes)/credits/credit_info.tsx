'use client'
import Image from "next/image"
import { useEffect, useState } from "react";
import { Stars } from "../../../../components/ui/stars";
import { FAQSection } from "./constants";
import { Mastercard } from "@/components/ui/mastercard";

export const Info = () =>{
    return(
        <div className="mx-auto max-w-4xl text-center items-center mt-10">  
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-5xl">Secured Payments With <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Imaginify</span></h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
          <span className="font-bold">Imaginify</span> unwavering focus on customer trust is reflected in our choice of <span className="font-bold">Stripe</span> as our payment partner. With <span className="font-bold">Stripe</span> advanced security features, including secure data transmission and PCI DSS compliance, we empower our users to engage <span className="font-bold">confidently</span> in transactions, emphasizing a <span className="font-bold">secure</span> and <span className="font-bold">reliable</span> payment environment.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', width: '180px', margin:'0 auto' }}>
      <div style={{ width: '80px', height: '80px',padding: '1px', borderRadius: '2px' }}>
        <Image src="/stripe-s.svg" alt="Stripe Logo" height={40} width={40} />
      </div>
      <div style={{ width: '80px', height: '80px', padding: '1px', borderRadius: '2px' }}>
        <Image src="/visa.svg" alt="Visa Logo" height={40} width={40} />
      </div>
      <div style={{ width: '80px', height: '80px', padding: '1px', borderRadius: '2px' }}>
        <Image src="/mastercard.svg" alt="Mastercard Logo" height={40} width={40} />
      </div>
    </div>
    <Mastercard />

   
    <div className="grid mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2" style={{ backgroundColor: '#ADD8E6' }}>
    <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-ss-lg md:border-e dark:bg-gray-800 dark:border-gray-700">
        <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
    
        <div className="flex justify-center">
            <Stars key="1" />
        </div>  
       <p className="my-4">Thank you for this, the experience I’ve had today with Imaginify has given me a huge dopamine rush a lot like I received from the early days of the internet!</p>
        </blockquote>
        <figcaption className="flex items-center justify-center ">
            <img className="rounded-full w-9 h-9" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png" alt="profile picture" />
            <div className="space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3">
                <div>Bonnie Green</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 ">Developer at Open AI</div>
            </div>
        </figcaption>    
    </figure>
    <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 md:rounded-se-lg dark:bg-gray-800 dark:border-gray-700">
        <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400 ">
        <div className="flex justify-center">
            <Stars key="1" />
        </div>        
            <p className="my-4">Designing with Figma components that can be easily translated to the utility classNamees of Tailwind CSS is a huge timesaver!</p>
        </blockquote>
        <figcaption className="flex items-center justify-center ">
            <img className="rounded-full w-9 h-9" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png" alt="profile picture" />
            <div className="space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3">
                <div>Roberta Casas</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Lead designer at Dropbox</div>
            </div>
        </figcaption>    
    </figure>
    <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 md:rounded-es-lg md:border-b-0 md:border-e dark:bg-gray-800 dark:border-gray-700">
    <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
    <div className="flex justify-center">
            <Stars key="1" />
        </div>  
        <p className="my-4">Aesthetically, the well-designed components are beautiful and will undoubtedly level up your next application.</p>
      </blockquote>
        <figcaption className="flex items-center justify-center ">
            <img className="rounded-full w-9 h-9" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="profile picture" />
            <div className="space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3">
                <div>Jese Leos</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Software Engineer at Facebook</div>
            </div>
        </figcaption>    
    </figure>
    <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border-gray-200 rounded-b-lg md:rounded-se-lg dark:bg-gray-800 dark:border-gray-700">
        <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
        <div className="flex justify-center">
            <Stars key="1" />
        </div>  
            <p className="my-4">You have many examples that can be used to create a fast prototype for your team.</p>
        </blockquote>
        <figcaption className="flex items-center justify-center ">
            <img className="rounded-full w-9 h-9" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png" alt="profile picture" />
            <div className="space-y-0.5 font-medium dark:text-white text-left rtl:text-right ms-3">
                <div>Joseph McFall</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">CTO at Google</div>
            </div>
        </figcaption>    
    </figure>
</div>
<FAQSection />
  </div>
    )
}