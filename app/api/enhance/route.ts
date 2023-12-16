import { checkApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import axios from "axios";
import toast from "react-hot-toast";
import FormData from 'form-data';

export async function Enhance(userId: string, uploadedImage: File | null, passedImage: string, textInput: string, negativePrompt: string, image_strength: number, selectedSamples: number, selectedModel: string, selectedStyle: string, cfgScale: number, seed: number, steps: number, fast_count: number) {
  const apiKey = "sk-6NoWpvUXGEKd2J5M1G0bDgLNZTzPPvwOfzdXhgHqQGBptoBX";
  const count = (3 * selectedSamples) + fast_count;

  try {
    const freeTrial = await checkApiLimit(userId, count);
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
      return null;
    } else {
      const calcul = await countCredit(userId, count);

      if (!calcul) {
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
          return null;
        }

        const formData = new FormData();
        formData.append('init_image', initImageBuffer);
        formData.append('init_image_mode', "IMAGE_STRENGTH");
        formData.append('image_strength', image_strength);
        formData.append('steps', steps);
        formData.append('seed', seed);
        formData.append('cfg_scale', cfgScale);
        formData.append('samples', selectedSamples);
        formData.append(`text_prompts[${0}][text]`, textInput);
        formData.append(`text_prompts[${0}][weight]`, 1);

        if (selectedStyle !== '') {
          formData.append('style_preset', selectedStyle);
        }

        if (negativePrompt !== '') {
          formData.append(`text_prompts[${1}][text]`, negativePrompt);
          formData.append(`text_prompts[${1}][weight]`, -1);
        }

        const headers = {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        };

        const response = await fetch(
          `https://api.stability.ai/v1/generation/${selectedModel}/image-to-image`,
          {
            method: 'POST',
            headers: {
              ...formData.getHeaders,
              Accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
          }
        );

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
    console.error('Failed to generate Image-To-Image, Error:', error);
    return null;
  }
}
