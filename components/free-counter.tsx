'use client'
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hook/use-pro-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Special_button } from "./ui/special_button";

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
  initialCredits ,
}: {
  isPro: boolean;
  apiLimitCount: number;
  initialCredits: any;
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();
  const [toastShown, setToastShown] = useState(false); 
  const [credits, setCredits] = useState(initialCredits);

  useEffect(() => {
    setMounted(true);
    //router.refresh();
  }, [proModal,toastShown,credits]);

  if (!mounted) {
    return null;
  }
  if (credits === 0 && !toastShown ) {
    // toast.error('You have no more credits!');
     //proModal.onOpen()
     setToastShown(true); 
     setCredits('0 credits left');
     
   }
   /// problem with initialImage is being empty an not filled with the return of getCredits
  return (
    <>
      {isPro ? (
        <>
      
          <Link href="/credits">
        <Special_button buttonText="Get More Credits"/>
          </Link>
        </>
      ) : (
        <>
        <div className="text-center text-sm text-white ml-2 mr-3">
          <p>
            {apiLimitCount} / {MAX_FREE_COUNTS} Credits left
          </p>
          <Progress className="h-3" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
        </div>
        <Button onClick={proModal.onOpen} variant="premium">
        Upgrade
        <Zap className="w-4 h-4 ml-2 fill-white" />
      </Button>
      </>
      )}

     
    </>
  );
};
