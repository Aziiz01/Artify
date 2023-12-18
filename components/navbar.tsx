
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
import "./css/nav.css"


const font = Montserrat({ weight: '600', subsets: ['latin'] });

 const Navbar = async () => {
  const { userId } : { userId: string | null } = auth();
  const apiLimitCount = await getApiLimitCount(userId);
  const isPro = await checkSubscription(userId);
  const credits = await getCredits();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <div id="logo" className="flex items-center gap-10">
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-8 mr-4" >
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
            `}>
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
            `}>
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
            `}>
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
            `}>
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
            `}>
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
            `}>
            Settings     
             <FontAwesomeIcon icon={faCog} className="ml-2" />
          </Button>
        </Link>
      </div>

        <FreeCounter
          apiLimitCount={apiLimitCount} 
          isPro={isPro}
          initialCredits={credits}
        />

        <div className="ml-2">
          <UserButton />
        </div>
    </nav>
  )
}
export default Navbar;