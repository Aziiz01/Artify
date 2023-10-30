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

export async function imgtoimg(userId: string, textInput: string, initImage: Buffer, selectedSamples: number, cfgScale: number, seed: number, steps: number) {
  const freeTrial = await checkApiLimit(userId);
  const isPro = await checkSubscription(userId);

  if (!freeTrial && !isPro) {
    // Return a 403 response immediately
    return -1;
  }
  const imageStrength = 0.4;

  try {
    const request = buildGenerationRequest("stable-diffusion-xl-1024-v1-0", {
        type: "image-to-image",
        prompts: [
          {
            text: textInput,
          },
        ],
        stepScheduleStart: 1 - imageStrength,
        initImage, // Assign the value here
        seed: seed,
        samples: selectedSamples,
        cfgScale: cfgScale,
        steps: steps,
        sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
      });
    
        const response = await executeGenerationRequest(client, request, metadata);
    
        const generatedImages = onGenerationComplete(response);
    
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
        return generatedImages;
     } catch (error) {
        console.error('Failed to generate Text-To-Image, Error:', error);
        return null;
      }
}
