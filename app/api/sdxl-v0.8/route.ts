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
import { checkSubscription } from '@/lib/subscription';
import { incrementApiLimit } from '@/lib/api-limit';
import {doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';

export async function SDXLv08(userId: string, prompt: string, selectedStyle: string, height: number, width: number, selectedSamples: number, cfgScale: number, seed: number, steps: number) {
  const freeTrial = await checkApiLimit(userId);
  const isPro = await checkSubscription(userId);

  if (!freeTrial && !isPro) {
    // Return a 403 response immediately
    return null;
  }

  try {
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

    if (!isPro) {
      await incrementApiLimit(userId);
    } else {
      try {
        const docRef = await getDoc(doc(db, "UserCredits", userId));
        if (docRef.exists()) {
          const productData = docRef.data();
          const currentCredits = parseInt(productData.count, 10);
          const updatedCredits = (currentCredits - 2).toString();
          console.log(updatedCredits);
          await updateDoc(doc(db, "UserCredits", userId), {
            count: updatedCredits,
          });
          console.log("document updated");
        }
      } catch (error) {
        console.log('Error while decrementing credits:', error);
      }
    }
    return generatedImageData ; // Return an empty array if image data is not available
  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
