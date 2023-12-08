"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import {TbPhotoSearch} from 'react-icons/tb'
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between" >
      <div className="flex gap-10">
        <Link href="/" className="flex items-center ">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold text-white", font.className)}>
            Imaginify
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
      <Link href="/explore">
          <Button variant="outline"  className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `}>
            Explore     
             <FontAwesomeIcon icon={faSearch} className="ml-2" />

          </Button>
        </Link>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
        <Button variant="outline"  className={`
                px-4 py-2 rounded-full 
                flex items-center gap-2 
                text-slate-500
                shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
                transition-all
                hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
               hover:text-violet-500
            `}>
            Dashboard      <FontAwesomeIcon icon={faRocket} className="ml-2" />
          </Button>
        </Link>
      </div>
      
    </nav>
  )
}