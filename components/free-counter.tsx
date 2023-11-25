'use client'
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hook/use-pro-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
  credits = 0,
}: {
  isPro: boolean;
  apiLimitCount: number;
  credits: number;
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
    router.refresh();
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {isPro ? (
        <>
        <div className="flex text-center text-m text-white mt-2 ml-2 mr-3">
          <p>
            {credits} Credits left
          </p>
        </div>
          <Link href="/credits">
          <Button variant="premium">
            Get More Credits
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
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
