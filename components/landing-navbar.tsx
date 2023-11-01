"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import {TbPhotoSearch} from 'react-icons/tb'
import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <div className="flex gap-10">
        <Link href="/" className="flex items-center ">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold text-white", font.className)}>
            Genius
          </h1>
        </Link>
        <div className="group">
          <Link href="/explore" className="flex items-center p-1 border border-white border-1 rounded-lg hover:bg-gray-200">
            <div className="justify-between items-center">
              <TbPhotoSearch className="text-white text-base transition duration-300 group-hover:text-purlpe-900" />
            </div>
            <h6 className={cn("text-2 text-white transition duration-300 group-hover:text-purple-900", font.className)}>
              Explore
            </h6>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="outline" className="rounded-full hover:text-white hover:bg-purple-900">
            SignUp / LogIn
          </Button>
        </Link>
      </div>
    </nav>
  )
}