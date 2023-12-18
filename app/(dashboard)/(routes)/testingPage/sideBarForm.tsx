"use client"
import React,{useState} from 'react'

export interface GenerateImageProp{
    generateImage: (data:FormData)=> Promise<void>
}

function SideBarForm({generateImage}:{generateImage:GenerateImageProp}) {
    const [prompt, setPrompt] = useState<string>("");
    const [style, setStyle] = useState<string | undefined>(undefined);
    const [samples, setSamples] = useState<string | undefined>(undefined);
    const [algoModel, setAlgoModel] = useState<string | undefined>(undefined);
    const [negativePrompt, setNegativePrompt] = useState<string | undefined>(undefined);
    const [width, setWidth] = useState<string | undefined>(undefined);
    const [height, setHeight] = useState<string | undefined>(undefined);
    const [cfg, setCfg] = useState<string | undefined>(undefined);
    const [steps, setSteps] = useState<string | undefined>(undefined);
    const [seed, setSeed] = useState<string | undefined>(undefined);

  return (
    <div>
        <form onSubmit={generateImage}>
          {/* Use "hidden" style to hide the inputs visually */}
          <input
            type="text"
            name="prompt"
            value={prompt}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="style"
            value={style}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="samples"
            value={samples}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="algoModel"
            value={algoModel}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="negativePrompt"
            value={negativePrompt}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="width"
            value={width}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="height"
            value={height}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="cfg"
            value={cfg}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="steps"
            value={steps}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="seed"
            value={seed}
            style={{ display: 'none' }}
          />
          <button type="submit">Generate</button>
        </form>
    </div>
  )
}

export default SideBarForm
