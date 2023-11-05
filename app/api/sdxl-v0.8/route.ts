import axios from 'axios';
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
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

export async function SDXLv08(userId: string, prompt: string, selectedStyle: string, height: number, width: number, selectedSamples: number, cfgScale: number, seed: number, steps: number) {
 try{
  const freeTrial = await checkApiLimit(userId);
  const isPro = await checkSubscription(userId);
  const count=1*selectedSamples;

  if (!freeTrial && !isPro) {
    // Return a 403 response immediately
    return null;
  }
  const calcul =await countCredit(userId,count);
    if (!calcul){
      return false;
    } else {
  
    const request = buildGenerationRequest("stable-diffusion-xl-beta-v2-2-2", {
      type: "text-to-image",
      prompts: [
        {
          text: prompt,
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
    return generatedImageData ; 
  }
  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
