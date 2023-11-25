import * as Generation from "../../../app/generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../../../lib/helpers";
import { client, metadata } from "../../../lib/grpc-client";
import { checkSubscription, countCredit } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import toast from "react-hot-toast";
import axios from "axios";



// Create a function to make the API call and save the image
export async function Enhance(userId : string,uploadedImage : File | null, passedImage: string, prompt: string, selectedSamples : number,cfgScale : number,seed :number, steps: number, fast_count: number ) {
    const imageStrength = 0.4;
    const count=(3*selectedSamples)+fast_count;

  try {

     const freeTrial = await checkApiLimit(userId,count);;
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
      return false;
      // proModal.onOpen();
     // setIsLoading(false);
    }
    const calcul =await countCredit(userId,count);
      if (!calcul){
        toast.error("Your credit balance is insufficient!");
        return false;
        //proModal.onOpen();
       // setIsLoading(false);
      } else {
        let initImageBuffer : Buffer;
        if (passedImage) {
            // If using passedImage, fetch base64 data from the URL
            
              const response = await axios.post('/api/data-fetch', { passedImage : passedImage}, { responseType: 'json' });
              const  base64Data  =  response.data;
            initImageBuffer = Buffer.from(base64Data, 'base64');
            
          } else if (uploadedImage) {
            // If using uploadedImage, get base64 data from the file
            const file = uploadedImage as File;
            const arrayBuffer = await file.arrayBuffer();
            initImageBuffer = Buffer.from(arrayBuffer);
          } else {
            toast.error('Please upload an image or provide an image URL!');
            return null;
            //setIsLoading(false);
          }
    const request = buildGenerationRequest("stable-diffusion-xl-1024-v1-0", {
      
      type: "image-to-image",
      prompts: [
        {
          text: prompt ,
        },
      ],
      
    stepScheduleStart: 1 - imageStrength,
    initImage: initImageBuffer! || null,
    seed: seed,
    samples: selectedSamples,
    cfgScale: cfgScale,
    steps: steps,
    sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
    });
    
    const response = await executeGenerationRequest(client, request, metadata);
        const generatedImageData = onGenerationComplete(response);
        return generatedImageData;
  } 

  } catch (error) {
    toast.error('Failed while enhancing image!');
    console.error('Failed to generate Image-To-Image, Error:', error);
    return null;
  }
}
