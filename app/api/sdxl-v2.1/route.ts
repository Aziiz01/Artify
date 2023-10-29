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
import { checkSubscription } from "@/lib/subscription";
import {  getDoc , doc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase'

// Create a function to make the API call and save the image
export async function SDXLv21(userId : string,textInput: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number) {
  try {
   /* const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
   
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }*/
    const request = buildGenerationRequest("stable-diffusion-512-v2-1", {
      type: "text-to-image",
      prompts: [
        {
          text: `${textInput},${selectedStyle}` ,
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
      /*  if (!isPro) {
          await incrementApiLimit();
        }*/
       
        
        return generatedImageData; // Return the generated image data

  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
