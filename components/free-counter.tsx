'use client'
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hook/use-pro-modal";
import { useRouter } from "next/navigation";
export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
}: {
  isPro: boolean;
  apiLimitCount: number;
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
    router.refresh;
  }, [router]);

  if (!mounted || isPro) {
    return null;
  }

  return (
    <>
      <div className="text-center text-sm text-white ml-2 mr-1">
        <p>
          {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
        </p>
        <Progress className="h-3" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
      </div>
      <Button onClick={proModal.onOpen} variant="premium">
        Upgrade
        <Zap className="w-4 h-4 ml-2 fill-white" />
      </Button>
    </>
  );
};
