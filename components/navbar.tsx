"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { UserButton, auth, useUser } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faRocket, faPalette, faCog, faExpand, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { FreeCounter } from "./free-counter";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { getCredits } from "@/lib/credits";
import { cn } from "@/lib/utils";
import FullScreenModal from "./fullScreenModal";
import { RxHamburgerMenu } from "react-icons/rx";
import { HoverImageLinks } from './HoverImageLinks';
import "./css/nav.css"


const font = Montserrat({ weight: '600', subsets: ['latin'] });

const Navbar = () => {
 //const { userId }: { userId: string | null } = auth();
  const [apiLimitCount, setApiLimitCount] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(0);
  const { isSignedIn, user, isLoaded } = useUser();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);



  useEffect(() => {
    if (isSignedIn) {
      const userId = user.id; 
    const fetchData = async () => {
      try {
        const limitCount = await getApiLimitCount(userId);
        setApiLimitCount(limitCount);

        const subscriptionStatus = await checkSubscription(userId);
        setIsPro(subscriptionStatus);

        const userCredits = await getCredits();
        setCredits(userCredits);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
      fetchData();
  }
  }, [isSignedIn,user]);



  useEffect(() => {    
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);


  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLinkClicked = () => {
    setIsModalOpen(false);
  }

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <div id="logo" className="flex items-center gap-10">
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-8 mr-4" onClick={handleLinkClicked}>
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold text-white", font.className)}>
            Imaginify
          </h1>
        </Link>
      </div>
      <div id="links" className="flex items-center gap-x-2 justify-center mr-3">
       
        <Link href="/dashboard">
          <Button variant="outline" className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `} onClick={handleLinkClicked}>
            Generate Art     
             <FontAwesomeIcon icon={faRocket} className="ml-2" />
          </Button>
        </Link>
        <Link href="/image-to-image">
          <Button variant="outline"  className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `} onClick={handleLinkClicked}>
            Enhance      
             <FontAwesomeIcon icon={faWandSparkles} className="ml-2" />
          </Button>
        </Link>
        <Link href="/upscale">
          <Button variant="outline"  className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `} onClick={handleLinkClicked}>
            Upscale     
             <FontAwesomeIcon icon={faExpand} className="ml-2" />
          </Button>
        </Link>
        <Link href="/creations">
          <Button variant="outline"  className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `} onClick={handleLinkClicked}>
            My Creations     
             <FontAwesomeIcon icon={faPalette} className="ml-2" />
          </Button>
        </Link>
        
        <Link href="/explore">
          <Button variant="outline"  className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `} onClick={handleLinkClicked}>
            Explore     
             <FontAwesomeIcon icon={faSearch} className="ml-2" />
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="outline" className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `} onClick={handleLinkClicked}>
            Settings     
             <FontAwesomeIcon icon={faCog} className="ml-2" />
          </Button>
        </Link>
      </div>

        <FreeCounter
          apiLimitCount={apiLimitCount} 
          isPro={isPro}
          credits={credits}
        />

        <div id="userbtn" className="ml-2" >
          <UserButton />
        </div>
      <div className={`ml-2 ${isMobile ? 'flex' : 'hidden'}`}>
        <Button variant="outline" className="rounded-full" onClick={handleToggleModal}>
          <RxHamburgerMenu style={{width:'30px', height:'30px'}} />
        </Button>
      </div>
      {isModalOpen && (
        <FullScreenModal
          onClose={handleToggleModal}
          content={
           <HoverImageLinks/>
          }
        />
      )}
    </nav>
  )
}
export default Navbar;