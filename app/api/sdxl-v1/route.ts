import * as Generation from "../../../app/generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../../../lib/helpers";
import { client, metadata } from "../../../lib/grpc-client";
import { checkSubscription, countCredit } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";



// Create a function to make the API call and save the image
export async function SDXLv1(userId : string,prompt: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number, fast_count: number ) {

  try {
    const count=(3*selectedSamples)+fast_count;

     const freeTrial = await checkApiLimit(userId,count);;
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
      return null;
    }
    const calcul =await countCredit(userId,count);
      if (!calcul){
        return true;
      } else {
    const request = buildGenerationRequest("stable-diffusion-xl-1024-v1-0", {
      
      type: "text-to-image",
      prompts: [
        {
          text: prompt ,
        },
      ],
      width: 1024,
      height: 1024,
      samples: 4,
      cfgScale: cfgScale,
      steps: steps,
      seed: seed,
      sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
    });
    
    const response = await executeGenerationRequest(client, request, metadata);
        const generatedImageData = onGenerationComplete(response);
        return generatedImageData;
  } 

  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
