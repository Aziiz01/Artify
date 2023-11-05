import { UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { getCredits } from "@/lib/credits";
import './css.css'
import Link from "next/link";
import {  Search, Settings, PartyPopper, Wallet } from "lucide-react"; // Import Lucide icons

const Navbar = async () => {
  const { userId }: { userId: string | null } = auth();
  const credits = await getCredits();
  const apiLimitCount = await getApiLimitCount(userId);
  const isPro = await checkSubscription(userId);

  return (
    <div className="navbar-container">

    <div className="flex items-center p-4">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      
      <div className="flex w-full justify-center ml-10">
        <Link href='/settings'>      
          <button className="navbar-button">Settings <Settings size={20}/></button>
        </Link>
        <Link href='/credits'> 
        <button className="navbar-button">Get Credits <Wallet size={20}/></button>
        </Link>

        <Link href='/explore'> 
        <button className="navbar-button">Explore <Search size={20} /></button>
        </Link>
        <Link href='/'> 
        <button className="navbar-button">
        My Creations  <PartyPopper size={20} /></button>
        </Link>
  
      </div>
      
      <div className="flex w-full justify-end">
        Remaining Credits: {credits}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
    </div>
  );
};

export default Navbar;
