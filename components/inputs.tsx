import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { promptOptions } from "../app/(dashboard)/(routes)/dashboard/constants";

interface DashboardInputsProps {
  textInput: string;
  selectedStyle: string;
  selectedModel: string;
  selectedSamples : string;
  height: number;
  width: number;
  cfgScale :number;
  seed : number;
  steps : number;
  setTextInput: (value: string) => void;
  handleStyleChange: (event: any) => void;
  handleSamplesChange: (event: any) => void;
  handleModelChange: (event: any) => void;
  handleDimensions : (event: any) => void;
  handleSamples : (event: any) => void;
  handleCFG : (event: any) => void;
  handleSteps : (event: any) => void;
  handleSeed : (event: any) => void;
}


const DashboardInputs: React.FC<DashboardInputsProps> = ({
  textInput,
  selectedStyle,
  selectedModel,
  selectedSamples,
  height,
  width,
  cfgScale,
  seed,
  steps,
  setTextInput,
  handleStyleChange,
  handleModelChange,
  handleDimensions,
  handleSamples,
  handleCFG,
  handleSteps,
  handleSeed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const handleSurpriseMeClick = () => {
    const randomIndex = getRandomPromptIndex();

    // Set the selected prompt in the user input bar
    if (randomIndex !== null) {
      setTextInput(promptOptions[randomIndex]);
    }
  };
  const getRandomPromptIndex = () => {
    const randomIndex = Math.floor(Math.random() * promptOptions.length);
    return randomIndex;
  };
  return (
    <div className="">
    <div className="flex items-center">
      <h2 className="text-2xl font-bold">
        Text Prompt
      </h2>
      <button
        className="ml-2 text-gray-500 hover:text-blue-500"
        onClick={openModal}>
        <span role="img" aria-label="Help">
          ❓
        </span>
      </button>
    </div>
    <div className="relative flex items-center">
      <p className="text-gray-500 text-lg ">
        Describe what you want the AI to create
      </p>
      {/* Add the "Surprise Me" button with Font Awesome icon */}
      <button
        className="bg-gray-200 text-gray-500 py-1 px-2 rounded-md ml-auto"
        onClick={handleSurpriseMeClick}
      >
        <FontAwesomeIcon icon={faLightbulb} className="mr-1" /> {/* Font Awesome icon */}
        Surprise Me
      </button>
    </div>
    <input
      className="border rounded-md px-4 py-2 w-full" // Remove left padding
      type="text"
      placeholder="Your text prompt"
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
    />

    <h2 className="text-2xl font-bold">
      Choose a style
    </h2>
    <select value={selectedStyle} onChange={handleStyleChange}>
      <option value="">many others to add </option>
      <option value="3d-model">3d-model</option>
      <option value="analog-film">analog-film </option>
      <option value="anime cinematic">anime</option>
      <option value="cinematic">cinematic</option>
    </select>
    <p>Selected Style: {selectedStyle}</p>

    <h2 className="text-2xl font-bold">
      Algorithm Model
    </h2>
    <select value={selectedModel} onChange={handleModelChange}>
      <option value="Stable Diffusion XL 1.0">Stable Diffusion XL 1.0 (Pro only)</option>
      <option value="Stable Diffusion XL 0.9">Stable Diffusion XL 0.9 (Pro only)</option>
      <option value="Stable Diffusion XL 0.8">Stable Diffusion XL 0.8</option>
      <option value="Stable Diffusion 2.1">Stable Diffusion 2.1</option>
      <option value="Stable Diffusion 1.5">Stable Diffusion 1.5</option>
      <option value="DALL E2">DALL E2</option>
    </select>
    <p>Selected Model: {selectedModel}</p>
    <h2 className="text-2xl font-bold">
      Dimensions
    </h2>
    <select value={`${height}*${width}`} onChange={handleDimensions}>
      <option value="512*512">512*512</option>
      <option value="1024*1024">1024*1024</option>
      <option value="2048*2048">2K</option>
    </select>
    <h2 className="text-2xl font-bold">
      Samples
    </h2>
    <select value={selectedSamples} onChange={handleSamples}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="4">4</option>
      <option value="6">6</option>
      <option value="8">8</option>
      <option value="10">10</option>
    </select>
    <h2 className="text-2xl font-bold">
      CFG_Scale
    </h2>
    <input
      type="range"
      id="cfgScale"
      name="cfgScale"
      min={0}
      max={35}
      value={cfgScale}
      onChange={handleCFG}
    />
    <p>{cfgScale}</p>
    <h2 className="text-2xl font-bold">
      Steps
    </h2>
    <input
      type="range"
      id="steps"
      name="steps"
      min={10}
      max={150}
      value={steps}
      onChange={handleSteps}
    />
    <p>{steps}</p>
    <h2 className="text-2xl font-bold">
      Seed
    </h2>
    <input
      className="" // Remove left padding
      type="text"
      placeholder="Seed"
      value={seed}
      onChange={handleSeed}
    />

    <Button
      onClick={handleGenerate} disabled={isLoading}
      className="bg-black text-white py-2 px-4 rounded-md mt-4 w-full"
    // Attach the click event handler
    >
      {isLoading ? 'Generating...' : 'Generate'}
    </Button>
    {isLoading && (
<div className="p-20">
<Loader />
</div>
)}

{(!image || image.length === 0) && !isLoading && photos === null && (
<Empty label="No images generated." />
)}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
{(Array.isArray(image) && image.length > 0) ? (
image.map((img, index) => (
  <Card key={index} className="">
    <div className="relative aspect-square">
      <Image
        fill
        src={img.src}
        alt={`Generated Image ${index + 1}`}
      />
    </div>
    <CardFooter className="p-2">
      <Button onClick={() => window.open(img.src)} variant="secondary" className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Open Image
      </Button>
      <Button onClick={handleEnhance}> Enhance </Button>
      <Button onClick={handleUpscale}> Upscale </Button>
      <PublishButton imageId={imageId} />
    </CardFooter>
  </Card>
))
) : !isLoading && photos === null ? (
<Empty label="No images generated." />
) : null}
</div>

  </div>
  );
};
