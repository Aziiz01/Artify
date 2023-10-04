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
const apiKey = 'sk-lMZmjzn1bSEdbyFNokTgYtCDP0yE09M4xYQ3WLQNgFCg9Gvf';
console.log('API Key:', apiKey);

// Create a function to make the API call and save the image
export async function SDXLv21(prompt: string) {
  try {
    const request = buildGenerationRequest("stable-diffusion-512-v2-1", {
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
