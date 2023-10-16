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
export async function SDXLv21(textInput: string, selectedStyle : string,height : number,width : number, selectedSamples : number,cfgScale : number,seed :number, steps: number) {
  try {
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
        return generatedImageData; // Return the generated image data

  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
