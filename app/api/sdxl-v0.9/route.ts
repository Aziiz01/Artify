import * as Generation from "../../../app/generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../../../lib/helpers";
import { client, metadata } from "../../../lib/grpc-client";
import { checkApiLimit } from '@/lib/api-limit';
import { checkSubscription, countCredit } from '@/lib/subscription';
import { incrementApiLimit } from '@/lib/api-limit';
import {doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';

// Create a function to make the API call and save the image
export async function SDXLv09(userId : string, prompt: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number, fast_count : number) {
  try {
    let height_n,width_n;
    if (height == 512 && width ==512){
     height_n = 1024;
     width_n = 1024;
    }
    const count=(3*selectedSamples)+fast_count;

     const freeTrial = await checkApiLimit(userId,count);;
    const isPro = await checkSubscription(userId);
  

    if (!freeTrial && !isPro) {
      // Return a 403 response immediately
      return null;
    }
    const calcul =await countCredit(userId,count);
      if (!calcul){
        return false;
      } else {
    const request = buildGenerationRequest("stable-diffusion-xl-1024-v0-9", {
      type: "text-to-image",
      prompts: [
        {
          text: prompt ,
        },
      ],
      width: width_n,
      height: height_n,
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
