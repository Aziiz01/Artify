import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import axios from "axios";
import toast from 'react-hot-toast';

export async function Animation_post(userId: string, uploadedImage: File | null, passedImage: string, seed: number, cfg_scale: number,motion_bucket_id : number,fast_count: number) {
  const apiKey = "sk-5ZsXF8IuUTMG2CP7DBGqO978F5zCC3xJeQDnP836Fo87IXBp";

  const count = 3;

  try {
    const freeTrial = await checkApiLimit(userId, count);
    const isPro = await checkSubscription(userId);

    if (!isPro && !freeTrial) {
      return false;
    } else {
      const calcul = await countCredit(userId, count);

      if (!calcul) {
        toast.error("Your credit balance is insufficient!");
        return false;
      } else {
        let initImageBuffer;

        if (passedImage) {
          // If using passedImage, fetch base64 data from the URL
          const response = await axios.post('/api/data-fetch', { passedImage: passedImage });
          const base64Data = response.data;
          const blob = new Blob([Buffer.from(base64Data, 'base64')], { type: 'image/png' });
          initImageBuffer = new File([blob], 'passedImage.png', { type: 'image/png' });

        } else if (uploadedImage) {
          initImageBuffer = uploadedImage;
        } else {
          toast.error('Please upload an image or provide an image URL!');
          return -1;
        }


// to check


        const formData = new FormData();
        formData.append("image", initImageBuffer);
        formData.append('seed', String(seed));
        formData.append('cfg_scale', String(cfg_scale));
        formData.append('motion_bucket_id', String(motion_bucket_id));
        
        const options: RequestInit = {
            method: 'POST',
            headers: {
              authorization: `Bearer ${apiKey}`,
              'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
            },
            body: formData,
          };

        const response = await fetch('https://api.stability.ai/v2alpha/generation/image-to-video', options);

        if (!response.ok) {
          throw new Error(`Non-200 response: ${await response.text()}`);
        }

        const responseJSON = await response.json();

      
        // Return the id of the video
        return responseJSON.id;
      }
    }
  } catch (error) {
    console.error('Error while animating:', error);
    toast.error('Error while animating');
    return null;
  }
}
