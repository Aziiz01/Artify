"use client"
import React ,{useState, useEffect} from 'react'
import { promptOptions} from './const';
import { faExpand, faLightbulb, faWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PickStyle from "@/components/ui/pickStyle";
import { Clock, Download} from "lucide-react";
import { Button } from "@/components/ui/button"; // Import the Button component



type GenerateImageProp = (data: FormData) => Promise<string[] | null | undefined>;

function SideBarForm({generateImage}:{generateImage:GenerateImageProp}) {
  
  const [prompt, setPrompt] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [samples, setSamples] = useState<number>(1);
  const [algoModel, setAlgoModel] = useState<string>("stable-diffusion-v1-6");
  const [negativePrompt, setNegativePrompt] = useState<string | undefined>(undefined);
  const [width, setWidth] = useState<number>(512);
  const [height, setHeight] = useState<number>(512);
  const [cfg, setCfg] = useState<number>(7);
  const [steps, setSteps] = useState<number>(30);
  const [seed, setSeed] = useState<number>(0);

  const [mobileSize, setMobileSize] = useState(false);  
  const [clicked, setClicked] = useState(false);
  const [displayImagesImmediately, setDisplayImagesImmediately] = useState(false);
  const [fast_count, setCount] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("");
  const [selectedDimensions, setSelectedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {    
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileSize(isMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);

  const getRandomPromptIndex = () => {
    const randomIndex = Math.floor(Math.random() * promptOptions.length);
    return randomIndex;
  };

  const handleSurpriseMeClick = () => {
    const randomIndex = getRandomPromptIndex();
    if (randomIndex !== null) {
      setPrompt(promptOptions[randomIndex]);
    }
  };

  const handleSelectedStyleChange = (newSelectedStyle: string) => {
    setStyle(newSelectedStyle);
  };
  
  const handleSeed = (event: any) => {
    setSeed(event.target.value);
  };

  const handleSamples = (value : any) => {
    setSamples(value);
    console.log(value);
  };
  
  const handleModelChange = (event: any) => {
    setAlgoModel(event.target.value);
  };
  const handleButtonClick = () => {
    setClicked(!clicked);
    setDisplayImagesImmediately(!displayImagesImmediately)
    const newCount = clicked ? 0 : 2;
    setCount(newCount);
  };

  const handleCFG = (event: any) => {
    // Get the selected cfg_scale value from the event
    const selectedCFG = event.target.value;

    // Set the cfgScale state variable with its setter
    setCfg(selectedCFG);
  };
  
  const handleSteps = (event: any) => {
    // Get the selected cfg_scale value from the event
    const selectedSteps = event.target.value;

    // Set the cfgScale state variable with its setter
    setSteps(selectedSteps);
  };

  const ratioMappings: { [key: string]: { width: number; height: number; selectable: boolean } } = {
    '1:1': { 
      width: algoModel === "stable-diffusion-xl-1024-v1-0" || algoModel === "stable-diffusion-xl-1024-v0-9" ? 1024 : 512,
      height: algoModel === "stable-diffusion-xl-1024-v1-0" || algoModel === "stable-diffusion-xl-1024-v0-9" ? 1024 : 512,
      selectable: true 
    },
    '4:3': { width: 1152, height: 896, selectable: algoModel === "stable-diffusion-xl-1024-v1-0" || algoModel === "stable-diffusion-xl-1024-v0-9" },
    '16:9': { width: 1344, height: 768, selectable: algoModel === "stable-diffusion-xl-1024-v1-0" || algoModel === "stable-diffusion-xl-1024-v0-9" },
    '9:16': { width: 768, height: 1344, selectable: algoModel === "stable-diffusion-xl-1024-v1-0" || algoModel === "stable-diffusion-xl-1024-v0-9" },
    '3:4': { width: 896, height: 1152, selectable: algoModel === "stable-diffusion-xl-1024-v1-0" || algoModel === "stable-diffusion-xl-1024-v0-9" },
  };
  
  const handleRatioClick = (ratio: string) => {
    const dimensions = ratioMappings[ratio];
    if (dimensions) {
      setSelectedDimensions(dimensions);
      setWidth(dimensions.width);
      setHeight(dimensions.height);
      setSelectedRatio(ratio);

    }
  };


  return (
    <div>
      <div className="px-4 lg:px-8 bg-transparent" style={{ overflowY: !mobileSize ? 'scroll' : undefined, height:'850px'  }}>
          <div className="form p-4 mb-4 mt-4">
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="span">Text Prompt</div>
                <button
                  className="button-surprise ml-auto mb-1"
                  onClick={handleSurpriseMeClick}
                >
                <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
                  Surprise Me
                </button>
              </div>
              <input className="input"
                type="text"
                placeholder="Describe what you want the AI to create"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)} />
            </div> 
            <div className="flex flex-col">
              <div className="span">Pick a Style: {style}</div>
              <div className="ml-auto">
                <PickStyle onSelectedStyleChange={handleSelectedStyleChange} />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="span">Samples</div>
              <div className="flex gap-2">
                <div className="login-with">
                  {[1, 2, 6, 8, 10].map((value) => (
                    <div
                      className={`button-log ${samples === value ? 'selected' : ''}`}
                      onClick={() => handleSamples(value)}
                      key={value}
                    >
                      <b>{value}</b>
                    </div>
                  ))}
                </div>  
              </div>
            </div>
            <div className="flex gap-3">
              <div className="span mt-2">Algorithm Model</div>
                <div>
                  <select className="bloc w-200 px-4 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={algoModel} onChange={handleModelChange}>
                    <option value="stable-diffusion-xl-1024-v1-0">Stable Diffusion XL 1.0 (Pro only)</option>
                    <option value="stable-diffusion-xl-1024-v0-9">Stable Diffusion XL 0.9 (Pro only)</option>
                    <option value="stable-diffusion-v1-6">Stable Diffusion 1.6</option>
                    <option value="DALL E2">DALL E2</option>
                  </select>
                </div>
              </div>
              <div
                className={`save-time-container ${clicked ? "clicked" : ""}`}
                onClick={handleButtonClick}
              >
                <div className="inner-effect mt-3"></div>
                <p>Fast Process (+2 credits)</p>
                <Clock/>
              </div>
              <label>
                <div className="flex items-center">
                  <div className="span mr-5">Show Advanced Options</div>
                  <div>
                    <input
                      id="checkbox"
                      type="checkbox"
                      name="checkbox"
                      checked={showAdvancedOptions}
                      onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    />
                    <label className="label" htmlFor="checkbox"></label>
                  </div>
                </div>
              </label>
              {showAdvancedOptions && (
              <>
                <div className="flex flex-col">
                  <div className="span">Negative Prompt</div>
                  <input className="input"
                  type="text"
                  placeholder="Describe what you want the AI to avoid"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <div className="span">Aspect Ratio</div>
                  {Object.entries(ratioMappings).map(([ratio, { width, height, selectable }]) => (
                  <button
                    key={ratio}
                    className={`bloc w-16 text-base rounded-lg ${
                      !selectable
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                        : ratio === selectedRatio
                        ? 'bg-gray-300 text-gray-700 border border-gray-500'
                        : 'bg-gray-50 text-gray-900 focus:ring-blue-900 focus:border-red-500 border border-gray-300'
                    } dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    onClick={() => selectable && handleRatioClick(ratio)}
                    disabled={!selectable}
                    >
                    {ratio}
                  </button>
                  ))} 
                </div>
                <div className="flex gap-3">
                  <div className="span">CFG Scale</div>
                  <input
                  className="slider mt-2"
                    type="range"
                    id="myRange"
                    name="cfgScale"
                    min={0}
                    max={35}
                    value={cfg}
                    onChange={handleCFG}
                  />
                  <p>{cfg}</p>    
                  <div className="tooltip">
                    <div className="icon">i</div>
                    <div className="tooltiptext">How closely the process follows the given prompt text (higher values bring your image closer to the prompt)</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="span">Steps</div>
                  <input id="myRange" className="slider mt-2" value={steps} max="150" min="10" type="range" onChange={handleSteps} />
                  <p>{steps}</p> 
                  <div className="tooltip">
                    <div className="icon">i</div>
                    <div className="tooltiptext">Number of diffusion steps to run</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="span">Seed <div className="tooltip">
                      <div className="icon">i</div>
                      <div className="tooltiptext">Choose either to exclude this option or input 0 to use a random seed for noise</div>
                    </div>
                  </div>
                  <input className="input"
                    type="text"
                    placeholder="0 for optimized generation"
                    value={seed}
                    onChange={handleSeed} />
                </div>
              </>
              )}
            </div>
            <form action={generateImage}>
              <input
                type="text"
                name="prompt"
                defaultValue={prompt}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="style"
                defaultValue={style}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="samples"
                defaultValue={samples}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="algoModel"
                defaultValue={algoModel}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="negativePrompt"
                defaultValue={negativePrompt}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="width"
                defaultValue={width}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="height"
                defaultValue={height}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="cfg"
                defaultValue={cfg}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="steps"
                defaultValue={steps}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                name="seed"
                defaultValue={seed}
                style={{ display: 'none' }}
              />
              <button
                type="submit"
                className="mt-4 w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-black   dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                > 
                <span>
                  {isLoading ? 'Generating...' : `Generate`}
                </span>
              </button>
          </form>
          </div>
    </div>
  )
}
export default SideBarForm;