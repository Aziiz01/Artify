import axios from 'axios';
import prismadb from '@/lib/prismadb'; // Import your Prisma Client instance
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define your API key
const apiKey = 'sk-9e2cyUTvElmetXgbPETM5ialGGB3FAcwtY0DX7Q2tsbEP9qG';
console.log('API Key:', apiKey);

// Create a function to make the API call and save the image
export async function SDXLv1(textInput: string) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [
          {
            text: textInput,
          },
        ],
        steps: 30,
        cfg_scale: 5,
        height: 1024,
        width: 1024,
        samples: 1,
        seed: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.status === 200) {
      const imageData = response.data.artifacts[0].base64;
      const imageUrl = imageData;
      /*
      try {
        await prismadb.image.create({
          data: {
            userId,
            imageUrl,
          },
        });
      } catch (error) {
        console.log('Error while saving in the database:', error);
        // Handle the error or log it as needed
      }*/
      return imageData;
      
      
    } else {
      console.error('Error:', response.statusText);
      return null;
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
