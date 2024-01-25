  import { revalidatePath } from 'next/cache';
  import React from 'react'
  import SideBarForm from '@/app/(dashboard)/(routes)/testingPage/sideBarForm';
  import ImageContainer from '@/components/ImageContainer';

    
    let base64Images: string[]=[];
    
    
    function generateRandomId() {
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000000);
      return `${timestamp}-${randomPart}`;
    }

    let imgData:any;

    function Test() {
      
      async function GenerateImage(data:FormData){
          "use server"

          const rawFormData = {
            prompt : data.get('prompt') as string,
            style : data.get('style') as string,
            samples : data.get('samples') as string, 
            algoModel : data.get('algoModel') as string, 
            negativePrompt : data.get('negativePrompt') as string,
            width : data.get("width") as string,
            height : data.get("height") as string,
            cfg : data.get("cfg") as string,
            steps : data.get("steps") as string,
            seed : data.get("seed") as string,
          };
          
          imgData = rawFormData;
          
          if(!rawFormData.prompt || !rawFormData.algoModel) return;

          try {
            const path =`https://api.stability.ai/v1/generation/${rawFormData.algoModel}/text-to-image`;
            const apiKey = "sk-qtDY84TTmPaPU4LUNVatts6aGe8wibXE5K5LaCHum1LdX28Z";
            const headers = {
              Accept: "application/json",
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json", 
            };
      
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
              steps: parseInt(rawFormData.steps),
              width: parseInt(rawFormData.width),
              height: parseInt(rawFormData.height),
              seed: parseInt(rawFormData.seed),
              cfg_scale: parseInt(rawFormData.cfg),
              samples: parseInt(rawFormData.samples),
              text_prompts: [
                {
                  text: rawFormData.prompt,
                  weight: 1,
                },
              ],
            };
            if (rawFormData.style !== '') {
              body.style_preset = rawFormData.style;
            }
            if (rawFormData.negativePrompt !== '') {
              body.text_prompts.push({
                text: rawFormData.negativePrompt,
                weight: -1,
              });
            }
            const response = await fetch(path, {
              headers,
              method: "POST",
              body: JSON.stringify(body),
              cache: "no-store" 
            });

            if (!response.ok) {
                console.log("image generated with success"+ response);
                throw new Error(`Non-200 response: ${await response.text()}`);
            }

            const responseJSON = await response.json();

            base64Images = responseJSON.artifacts.map((image:any) => image.base64);
            
            if(base64Images){
                
            }

            revalidatePath("testingPage");


            return base64Images;

          }catch(error) {
            console.error('Failed to generate Text-To-Image, Error:', error);
            return null;
          }
        }


      return (
          <div style={{
              display:'grid',
              height:'2000px',
              gridTemplateColumns:'40% 60%'
            }}>

              
          <div className='side-bar'>
              <SideBarForm generateImage={GenerateImage}/>
          </div>
          <div className="px-4 lg:px-8 bg-transparent" style={{ height:'850px'  }}>
            <div className="bg-white rounded-lg p-4 mb-4 mt-4">
                <h2> theImageDataprompt </h2>
                <h2> {imgData?.samples} </h2>
                <h2> {imgData?.style} </h2>
              </div>
              <div>
                <div>
                  <ImageContainer
                    base64Images={base64Images}
                    imageData={imgData}
                  />
                </div> 
              </div>
          </div>
      </div>
    )
  }

  export default Test;