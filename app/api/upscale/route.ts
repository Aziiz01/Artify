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
export async function Upscale(userId : string,uploadedImage : File | null) {
  try {
    if (uploadedImage) {
       
          const imageElement = document.createElement("img");
          imageElement.src = URL.createObjectURL(uploadedImage);
    
          imageElement.onload = async () => {
            const width = imageElement.width;
            const height = imageElement.height;
    
            let selectedModel = null;
    
            if (width === 512 && height === 512) {
              selectedModel = "stable-diffusion-x4-latent-upscaler";
              console.log(selectedModel)
            } else if (width === 1024 && height === 1024) {
              selectedModel = "esrgan-v1-x2plus";
              console.log(selectedModel)
            } else {
              console.error("Invalid image dimensions. Expected 512x512 or 1024x1024.");
              return;
            }
    
            const request = buildGenerationRequest(selectedModel, {
              type: 'upscaling',
              upscaler: Generation.Upscaler.UPSCALER_ESRGAN,
              initImage: Buffer.from(await uploadedImage.arrayBuffer()),
            });
    
            const response = await executeGenerationRequest(client, request, metadata);
    
            const generatedImages = onGenerationComplete(response);
    
          return generatedImages;
          }}}
          catch (error) {
            console.error('Failed to generate Image-To-Image, Error:', error);
            return null;
          }}
        
  

