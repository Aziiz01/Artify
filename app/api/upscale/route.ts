import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import axios from "axios";
import toast from 'react-hot-toast';

export async function Upscale(userId: string, uploadedImage: File | null, passedImage: string, selectedModel: string, fast_count: number) {
  const apiKey = "sk-5ZsXF8IuUTMG2CP7DBGqO978F5zCC3xJeQDnP836Fo87IXBp";

  const count = 3;
  console.log("fast_count: " + fast_count)
  try {
    const formData = new FormData();

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

        const formData = new FormData();
        formData.append('image', initImageBuffer);

        const response = await fetch(`https://api.stability.ai/v1/generation/${selectedModel}/image-to-image/upscale`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Non-200 response: ${await response.text()}`);
        }

        const responseJSON = await response.json();

        // Create an array to store the HTML img elements
        const htmlImgElements: HTMLImageElement[] = [];

        responseJSON.artifacts.forEach((image: any, index: any) => {
          // Construct the data URL for the image
          const dataUrl = `data:image/png;base64,${image.base64}`;

          // Create an HTML img element
          const imgElement = document.createElement('img');
          imgElement.src = dataUrl;
          imgElement.alt = `Generated Image ${index + 1}`;

          // Push the img element to the array
          htmlImgElements.push(imgElement);
        });

        // Return the array of HTML img elements
        return htmlImgElements;
      }
    }
  } catch (error) {
    console.error('Error while upscaling:', error);
    toast.error('Error while upscaling');
    return null;
  }
}
