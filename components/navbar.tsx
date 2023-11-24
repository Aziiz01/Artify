
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { FreeCounter } from "./free-counter";

const Navbar = async () => {
  const { userId } : { userId: string | null } = auth();

  const apiLimitCount = await getApiLimitCount(userId);
  const isPro = await checkSubscription(userId);

  return ( 
    <nav className="w-full bg-gradient-to-br from-blue-900 to-gray-600" style={{backgroundColor: '#1a202c'}}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link href="/" className="flex items-center">
          <Image src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo"  width={100} height={100}/>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
      </Link>
      <div className="flex items-center">
          
          <UserButton/>

      </div>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
        <li>
            <Link href="/creations"  className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold" aria-current="page">My Creations</Link>
          </li>
          <li>
            <Link href="/dashboard"  className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold" aria-current="page">Gnerate Images</Link>
          </li>
          <li>
            <Link href="/image-to-image" className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold">Modify Images</Link>
          </li>
          <li>
            <Link href="/upscale" className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold">Upscale Images</Link>
          </li>
          <li>
            <Link href="/explore" className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold">Explore</Link>
          </li>
          <li>
            <Link href="/settings" className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold">Settings</Link>
          </li>
          <li>
            <Link href="/blog" className="block py-2 pl-3 pr-4 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-extrabold">Blog</Link>
          </li>
        </ul>
      
        <FreeCounter
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
      />
      </div>
      </div>
    </nav>
    
   );
}
 
export default Navbar;