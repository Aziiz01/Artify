import axios from 'axios';
import prismadb from '@/lib/prismadb'; // Import your Prisma Client instance
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
const apiKey = 'sk-ZArtaCDEPggaipkpUrrYJa31jo8giwqP2H0wdsLHmierPaHF';


// Create a function to make the API call and save the image
export async function SDXLv15(prompt: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number) {
  try {
    const request = buildGenerationRequest("stable-diffusion-v1-5", {
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
