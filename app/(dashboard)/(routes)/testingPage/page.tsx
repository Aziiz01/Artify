  import { revalidatePath } from 'next/cache';
  import React from 'react'
  import SideBarForm from '@/app/(dashboard)/(routes)/testingPage/sideBarForm';
  import Image from "next/image";
  import axios from 'axios';
  import ImageContainer from '@/components/ImageContainer';
import { response } from 'express';

  export interface imageData{
      text_prompts: string,
      style_preset : string,
      samples : number,
      algoModel:string,
      width:number,
      height:number,
      cfg_scale:number,
      steps:number,
      seed:number
      negativePrompt: string
      //fast_count:number|undefined
    }
    
    
    let theImageData: imageData = {
      text_prompts:"",
      style_preset: "",
      samples: 0,
      algoModel: "",
      width:1024 ,
      height: 1024,
      cfg_scale: 7,
      steps: 30,
      seed: 0,
      negativePrompt:"",
    };
    
    let base64Images: string[]=[];
    
    
    function generateRandomId() {
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000000);
      return `${timestamp}-${randomPart}`;
    }
    // const saveImagesInBackground = async (imagesData: string[], additionalParams: imageData) => {
    //   const saveImagesPromises = imagesData.map(async (imageInfo: string) => {
    //     const base64Data = imageInfo;
    //     const documentId = generateRandomId();
    
    //     try {
    //       const response = await fetch ('http://localhost/api/sdxlStorage', {
    //         method : 'POST',
    //         body: JSON.stringify({
    //             base64Data : base64Data,
    //             prompt : additionalParams.text_prompts,
    //             negativePrompt : additionalParams.negativePrompt,
    //             Model : additionalParams.algoModel,
    //             Style : additionalParams.style_preset,
    //             Samples : additionalParams.samples, 
    //             seed : additionalParams.seed,
    //             steps : additionalParams.steps,
    //             height : additionalParams.height,
    //             width : additionalParams.width,
    //             cfg_scale : additionalParams.cfg_scale,
    //             docID : documentId
    //         }),
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       if (response.ok) {
    //         const imageUrl = await response.json();
    //       } else {
    //         console.log("error !! ")
    //       }
    //     } catch (error) {
    //       console.error(error);
    //     }
    //     });
    
    //   try {
    //     await Promise.all(saveImagesPromises);
    //     console.log("Images saved successfully");
    //   } catch (error) {
    //     console.error("Error saving images:", error);
    //   }
    // };

    let imgData:any;

    function Test() {
      
      async function GenerateImage(data:FormData){
          "use server"
          // const userId= data.get("userId") as string;
          // const prompt= data.get("prompt") as string;
          // const style = data.get("style") as string;
          
          // const samples = data.get("samples") as string;
          // const samplesNbr = parseInt(samples);

          // const algoModel= data.get("algoModel") as string;
          // const negativePrompt= data.get("negativePrompt") as string;

          // const width = data.get("width") as string;
          // const widthNbr = parseInt(width);

          // const height = data.get("height") as string;
          // const heightNbr = parseInt(height);

          // const cfg = data.get("cfg") as string;
          // const cfgNbr = parseInt(cfg);

          // const steps = data.get("steps") as string;
          // const stepsNbr = parseInt(steps);

          // const seed = data.get("seed") as string;
          // const seedNbr = parseInt(seed);

          // const fast_count = data.get("fast_count") as string;
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
        
          // const newImageData: imageData ={
          //   text_prompts:prompt,
          //   algoModel: algoModel,
          //   style_preset : style,
          //   cfg_scale:cfgNbr,
          //   height: heightNbr,
          //   width: widthNbr,
          //   steps: stepsNbr,
          //   samples:samplesNbr,
          //   seed:seedNbr,
          //   negativePrompt: negativePrompt,
          // }
          // theImageData = newImageData;
          // // generateImageDatas.push(newImageData);
          // console.log(theImageData);
          // revalidatePath('/testingPage' ad);


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
            
            
            // if (base64Images.length > 0){
            //   saveImagesInBackground(base64Images,theImageData);
            // }
            // else{
            //   console.log("base64is empty "+base64Images[0]);
            // }
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
                    imageData={theImageData}
                  />
                </div> 
              </div>
          </div>
      </div>
    )
  }

  export default Test;