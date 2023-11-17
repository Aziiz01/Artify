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

// Create a function to make the API call and save the image
export async function SDXLv21(userId : string,prompt: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number) {
  try {
    const count=1*selectedSamples;
    const freeTrial = await checkApiLimit(userId);
    const isPro = await checkSubscription(userId);
    if (!freeTrial && !isPro) {
      return null;
    }
    const calcul =await countCredit(userId,count);
    console.log(calcul)
      if (!calcul){
        return false;
      } else {
    const request = buildGenerationRequest("stable-diffusion-512-v2-1", {
      type: "text-to-image",
      prompts: [
        {
          text: prompt ,
        },
      ],
      width: width,
      height: height,
      samples: selectedSamples,
      cfgScale: cfgScale,
      steps: steps,
      seed: seed,
      sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
    });
    
    const response = await executeGenerationRequest(client, request, metadata);
        const generatedImageData = onGenerationComplete(response);        
        return generatedImageData; // Return the generated image data
  }
  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
