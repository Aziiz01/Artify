import { checkSubscription, countCredit } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";


export async function SDXL(userId : string,textInput: string,negativePrompt:string, selectedStyle : string,selectedSamples : number,height : number,width : number, selectedModel:string,cfgScale : number,seed :number, steps: number, fast_count: number ) {

  try {
     const path =`https://api.stability.ai/v1/generation/${selectedModel}/text-to-image`;
     const apiKey = "sk-hfHFcGo7XF9HI8F1DJKRyfQZFBkj8nSGSeT1TXhwRKHsGdps";
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json", 
      };
    const count=selectedSamples+fast_count;

     const freeTrial = await checkApiLimit(userId,count);;
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
      return null;
    }
    const calcul =await countCredit(userId,count);
      if (!calcul){
        return false;
      } else {   
        const body: {
          steps: number;
          width: number;
          height: number;
          seed: number;
          cfg_scale: number;
          samples: number;
          text_prompts: { text: string; weight: number }[];
          style_preset?: string; 
        } = {
          steps: steps,
          width: width,
          height: height,
          seed: seed,
          cfg_scale: cfgScale,
          samples: selectedSamples,
          text_prompts: [
            {
              text: textInput,
              weight: 1,
            },
          ],
        };
  
        if (selectedStyle !== '') {
          body.style_preset = selectedStyle ;
        }
        if (negativePrompt !== '') {
          body.text_prompts.push({
            text: negativePrompt,
            weight: -1,
          });
        }
   
      const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify(body),
      });

      
      if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`)
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

  } catch (error) {
    console.error('Failed to generate Text-To-Image, Error:', error);
    return null;
  }
}
