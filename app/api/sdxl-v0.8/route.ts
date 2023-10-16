import axios from 'axios';
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import * as Generation from "../../../app/generation/generation_pb";
import {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete,
} from "../../../lib/helpers";
import { client, metadata } from "../../../lib/grpc-client";

// Define your API key
const apiKey = 'sk-ibngopyoB22ObtegplMJ1XEHnXeV4PlpI2WEx3pExcs24cQH';
console.log('API Key:', apiKey);

// Create a function to make the API call and save the image
export async function SDXLv08(prompt: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number) {
  try {
    const request = buildGenerationRequest("stable-diffusion-xl-beta-v2-2-2", {
      type: "text-to-image",
      prompts: [
        {
          text: prompt ,
        },
      ],
      width: 512,
      height: 512,
      samples: 1,
      cfgScale: 5,
      steps: 30,
      seed: 0,
      sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
    });
    
    const response = await executeGenerationRequest(client, request, metadata);
        const generatedImageData = onGenerationComplete(response);
        return generatedImageData; // Return the generated image data

  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
