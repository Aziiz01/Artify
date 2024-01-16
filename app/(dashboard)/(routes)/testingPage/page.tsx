import { revalidatePath } from 'next/cache';
import React from 'react'
import SideBarForm from '@/app/(dashboard)/(routes)/testingPage/sideBarForm';
import { SDXL } from '../../../api/sdxl-v1/route'; // Import the function
import { string } from 'zod';
import axios from 'axios';
import Image from "next/image";

export interface imageDataResponse{
  artifacts: Array<{
    base64: string
    seed: number
    finishReason: string
  }>
}

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
  
  const generateImageDatas: imageData[]= [];
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
   
  let theImageDataResponse:imageDataResponse ={
    artifacts: [], // Start with an empty array of artifacts
  };

  //const htmlImgElements: HTMLImageElement[] = [];
  let base64Images: string[]=[];
  
  export default function Test() {
    
    async function generateImage(data:FormData){
        "use server"
        const userId= data.get("userId")?.toString();
        const prompt= data.get("prompt")?.toString();
        const style = data.get("style")?.toString();
        const samples = data.get("samples ") ? parseInt(data.get("samples")!.toString(), 10) : undefined;
        const algoModel= data.get("algoModel")?.toString();
        const negativePrompt= data.get("negativePrompt")?.toString();
        const width = data.get("width") ? parseInt(data.get("width")!.toString(), 10) : undefined;
        const height = data.get("height") ? parseInt(data.get("height")!.toString(), 10) : undefined;
        const cfg = data.get("cfg") ? parseInt(data.get("cfg")!.toString(), 10) : undefined;
        const steps = data.get("steps") ? parseInt(data.get("steps")!.toString(), 10) : undefined;
        const seed = data.get("seed") ? parseInt(data.get("seed")!.toString(), 10) : undefined;
        const fast_count = data.get("fast_count") ? parseInt(data.get("fast_count")!.toString(), 10) : undefined;

        if(!prompt || !algoModel) return;
        const newImageData: imageData ={
          text_prompts:prompt,
          algoModel: algoModel? algoModel: "stable-diffusion-v1-6",
          style_preset : style? style : "",
          cfg_scale:cfg? cfg : 7,
          height: height? height : 1024 ,
          width: width? width: 1024,
          steps: steps? steps: 30,
          samples : samples? samples : 1,
          seed:seed? seed: 0,
          negativePrompt: negativePrompt? negativePrompt : ""
        }
        theImageData = newImageData;
        generateImageDatas.push(newImageData);

        try {
          const path =`https://api.stability.ai/v1/generation/${theImageData.algoModel}/text-to-image`;
          const apiKey = "sk-BaEwtEhRzUIH4odaU5jcjFcvTr9CH2xsZNElGYRWa5BLycos";
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
            steps: theImageData.steps,
            width: theImageData.width,
            height: theImageData.height,
            seed: theImageData.seed,
            cfg_scale: theImageData.cfg_scale,
            samples: theImageData.cfg_scale,
            text_prompts: [
              {
                text: theImageData.text_prompts,
                weight: 1,
              },
            ],
          };
          if (theImageData.style_preset !== '') {
            body.style_preset = theImageData.style_preset;
          }
          if (theImageData.negativePrompt!== '') {
            body.text_prompts.push({
              text: theImageData.negativePrompt,
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
            throw new Error(`Non-200 response: ${await response.text()}`)
            console.log("image generated with success"+ response);
          }
          
          const responseJSON = await response.json();

          base64Images = responseJSON.artifacts.map((image:any) => image.base64);

          // responseJSON.artifacts.forEach((image: any, index: any) => {
          //   // Construct the data URL for the image
          //   const dataUrl = `data:image/png;base64,${image.base64}`;
    
          //   // Create an HTML img element
          //   const imgElement = document.createElement('img');
          //   imgElement.src = dataUrl;
          //   imgElement.alt = `Generated Image ${index + 1}`;
    
          //   // Push the img element to the array
          //   htmlImgElements.push(imgElement);
            
//          });
          
          revalidatePath('/testingPage');
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
            gridTemplateColumns:'50% 50%'
          }}>

             
        <div className='side-bar'>
            <SideBarForm generateImage={generateImage}/>
        </div>
        <div className="px-4 lg:px-8 bg-transparent" style={{ height:'850px'  }}>
           <div className="bg-white rounded-lg p-4 mb-4 mt-4">
              <h2> theImageDataprompt </h2>
              <h2> {theImageData.samples} </h2>
            </div>
            <div>
              <h1>Artifacts</h1>
              <div>
              {base64Images.map((base64, index) => (
                  <Image 
                  key={index} 
                  src={`data:image/png;base64,${base64}`} 
                  alt={`Generated Image ${index + 1}`}             
                  height={1024}
                  width={1024}/>
                ))}
              </div>
            </div>
         </div>
    </div>
  )
}
