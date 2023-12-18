import { revalidatePath } from 'next/cache';
import React from 'react'
import SideBarForm from '@/app/(dashboard)/(routes)/testingPage/sideBarForm';

export interface imageData{
    prompt : string,
    style : string|undefined,
    samples : string|undefined,
    algoModel:string|undefined,
    negativePrompt:string|undefined,
    width:string|undefined,
    height:string|undefined,
    cfg:string|undefined,
    steps:string|undefined,
    seed:string|undefined
  }
  
  const generateImageDatas: imageData[]= [];

  export default function Test() {
    
    async function generateImage(data:FormData){
        "use server"
        const prompt= data.get("prompt")?.toString();
        const style = data.get("style")?.toString();
        const samples = data.get("samples")?.toString();
        const algoModel= data.get("style")?.toString();
        const negativePrompt= data.get("algoModel")?.toString();
        const width= data.get("width")?.toString();
        const height= data.get("height")?.toString();
        const cfg= data.get("cfg")?.toString();
        const steps= data.get("steps")?.toString();
        const seed= data.get("seed")?.toString();
        
        if(!prompt || !algoModel) return;
        const newImageData: imageData ={
          prompt,
          style,
          samples ,
          algoModel,
          negativePrompt,
          width,
          height,
          cfg,
          steps,
          seed
        }
        generateImageDatas.push(newImageData);
        revalidatePath('/testingPage');
      }
    return (
        <div style={{
            display:'grid',
            height:'2000px',
            gridTemplateRows:'50% 50%'
          }}>
             <div className="px-4 lg:px-8 bg-transparent" style={{ height:'850px'  }}>
                <div className="bg-white rounded-lg p-4 mb-4 mt-4">
                   <div>

                   </div>
                </div>
             </div>

             
        <div className='side-bar'>
            <SideBarForm generateImage={generateImage}/>
        </div>
        <div className='generate-section'>
            {generateImageDatas.map((data,index) =>(
                <div key={index}>
                    <h2>{data.prompt}</h2>
                    <h2>{data.style}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}
