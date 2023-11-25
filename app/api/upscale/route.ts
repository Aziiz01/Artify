import axios from 'axios';
import prismadb from '@/lib/prismadb'; // Import your Prisma Client instance
import { NextResponse } from "next/server";
import * as Generation from "../../../app/generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../../../lib/helpers";
import { client, metadata } from "../../../lib/grpc-client";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import { useProModal } from "@/hook/use-pro-modal";
import toast from 'react-hot-toast';


export async function Upscale(userId : string,uploadedImage : File | null, passedImage : string, selectedModel : string, fast_count: number) {
  const count = (3 + fast_count) ;
  try {
    const freeTrial = await checkApiLimit(userId,count);
    const isPro = await checkSubscription(userId);

    if (!isPro && !freeTrial) {
      return false;
    } else {
      const calcul = await countCredit(userId, count);

      if (!calcul) {
        toast.error("Your credit balance is insufficient!");
         return false;
      } else {
        let initImageBuffer: Buffer;

        if (passedImage) {
          // If using passedImage, fetch base64 data from the URL
         
            const response = await axios.post('/api/data-fetch', { passedImage: passedImage }, { responseType: 'json' });
            const base64Data = response.data;
            initImageBuffer = Buffer.from(base64Data, 'base64');
          
        } else if (uploadedImage) {
          // If using uploadedImage, get base64 data from the file
          const file = uploadedImage as File;
          const arrayBuffer = await file.arrayBuffer();
          initImageBuffer = Buffer.from(arrayBuffer);
        } else {
          toast.error('Please upload an image or provide an image URL!');
          return -1;
        }
        const request = buildGenerationRequest(selectedModel, {
          type: "upscaling",
          upscaler: Generation.Upscaler.UPSCALER_ESRGAN,
          initImage: initImageBuffer! || null,
        });
    
            const response = await executeGenerationRequest(client, request, metadata);
    
            const generatedImages = onGenerationComplete(response);
    
          return generatedImages;
          }}
  }catch {
    toast.error('error while upscaling');
    return null;
  }
        
}
        
