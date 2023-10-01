"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { tools } from "@/constants";
import { useProModal } from "@/hooks/use-pro-modal";
import Modal from 'react-modal'; // Import react-modal
import { Button } from "@/components/ui/button"; // Import the Button component
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { Download, ImageIcon } from "lucide-react";
import { SDXLv1 } from '../../../api/sdxl-v1/route'; // Import the function
import { SDXLv09 } from "@/app/api/sdxl-v0.9/route"; 
import { SDXLv08 } from "@/app/api/sdxl-v0.8/route";
import { SDXLv15 } from "@/app/api/sdxl-v1.5/route";
import { SDXLv21 } from "@/app/api/sdxl-v2.1/route";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import {promptOptions} from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import {SelectItem} from "@/components/ui/select"
export default function HomePage() {
  const router = useRouter();
  const proModal = useProModal();
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedModel, setSelectedModel] = useState('Stable Diffusion 2.1');

  type SDXLModelApiMapping = {
    [key: string]: (textInput: string) => Promise<any>;
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    }
  });
  const SDXLmodelApiMapping : SDXLModelApiMapping  = {
    "Stable Diffusion XL 1.0": SDXLv1,
    "Stable Diffusion XL 0.9": SDXLv09,
    "Stable Diffusion XL 0.8": SDXLv08,
    "Stable Diffusion 2.1": SDXLv21,
    "Stable Diffusion 1.5": SDXLv15,
  };
  
  const handleStyleChange = (event: any) => {
    setSelectedStyle(event.target.value);
  };
  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };
  const getRandomPromptIndex = () => {
    const randomIndex = Math.floor(Math.random() * promptOptions.length);
    return randomIndex;
  };
  const handleSurpriseMeClick = () => {
    const randomIndex = getRandomPromptIndex();

    // Set the selected prompt in the user input bar
    if (randomIndex !== null) {
      setTextInput(promptOptions[randomIndex]);
    }
  };
  const values = {
    prompt:`${textInput} , ${selectedStyle}`,
    amount: "1",
   resolution: "512x512"
  }
  const DALLE = async (values : any) => {
    try {
      setPhotos([]);

      const prompt = `${textInput} , ${selectedStyle}`;
      const response = await axios.post('/api/image', values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setPhotos(urls);

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }
  };
  const generateImage = async () => {
    setIsLoading(true);
  
    const prompt = `${textInput} , ${selectedStyle}`;
    try {
      if (selectedModel === 'DALL E2') {
        await DALLE(values);
      } else {
        // Use the selected model to determine which API to call
        const selectedApi = SDXLmodelApiMapping[selectedModel];
        console.log(selectedApi);
        if (selectedApi) {
          const imageData = await selectedApi(prompt);
          if (imageData !== null) {
            setImage(imageData);
          }
        } else {
          // Handle the case where the selected model doesn't have a corresponding API
          // You can display an error message or take other appropriate actions.
          console.error(`API for model ${selectedModel} not found.`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleGenerate = () => {
    generateImage();
  };
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-4xl font-bold">
          Explore the Power of AI
        </h2>
        <p className="text-gray-500 text-lg">
          Chat with the Smartest AI - Experience the Power of AI
        </p>
      </div>
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
        <option value="">No Style</option>
          <option value="Realistic">Realistic</option>
          <option value="Anime">Anime</option>
          <option value="Cosmic">Cosmic</option>
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
        <p>Selected Style: {selectedModel}</p>
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
        {image == null  && !isLoading && photos == null && (
          <Empty label="No images generated." />
        )}
        {image && (
          <Card className="rounded-lg overflow-hidden">
            <div className="relative aspect-square">
            <Image
              fill
              alt="Generated"
              src={`data:image/png;base64,${image}`}
/>
            </div>
            
            <CardFooter className="p-2">
              <Button onClick={() => {
                const newWindow = window.open();
                if (newWindow) {
                  newWindow.document.write(`<img src="data:image/png;base64,${image}" alt="Generated Image"/>`);
                } else {
                  // Handle the case where the new window couldn't be opened
                  alert('Failed to open a new window.');
                }
              }} variant="secondary" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Open Image
              </Button>
            </CardFooter>
          </Card>
        )}


      </div>{/*DALLE PHOTOS */}
      {photos && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {photos.map((src) => (
            <Card key={src} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  fill
                  alt="Generated"
                  src={src}
                />
              </div>
              <CardFooter className="p-2">
                <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Open Image
                </Button>
              </CardFooter>
            </Card>
          ))}
          </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Help Modal"
      >
        {/* Modal content here */}
        <h2 className="text-2xl font-bold mb-4">All about text prompts</h2>
        <p className="text-gray-500">
          The text prompt is a place for you to describe - in words - what you want the AI to create.

          Use shuffle icon to generate random prompts. Try it. its fun!

          Use grandiose words to get the AI to understand exactly what it is you want it to generate. For example, the term garden is a good prompt but lush garden or celestial garden better describes to the AI what it is exactly you would like it to make. If you’re still looking for more inspiration, try the random or choose options to create with one of our pre-written prompts.

          Styles (Presets and Modifiers)
          Modifiers are the descriptive words in a text prompt that describe to the AI what you want to make and how you want it to look. What art style are you going for? Oil painting? Pencil sketch? Art Deco? What color pallete do you want to show through the most? Do you want it to look more animated or realistic? Modifiers are how you can direct this all. If you’re still feeling uninspired, try our list of modifiers under the add modifiers button.

          Presets are simply a bunch of modifiers, chosen by us, that are well tested and likely to achieve a good result.

          Coherent
          When using the Coherent algorithm, try to be more blunt and to the point when describing what it is you’d like to create. This helps to prevent the AI from straying off the path of what the subject of the creation is.

          Artistic
          When using the Artistic algorithm, try to describe as accurately as possible what it is you want to create. What artist styles, scenes, subjects, colors, and/or textures do you want to see in the final image? For example, the term garden can be used as a prompt but lush colorful garden full of flowers during a light drizzle or celestial garden with alien vegetation during an outdoor picnic better describes to the AI what it is exactly you would like it to make.

          Try multiple prompt sets
          In Advanced mode, turning on Try multiple prompt sets allows you to generate multiple creations in one go. One creation will be generated for each prompt set you specify.

          Note that the reason its a prompt set and not just Try multiple prompts is that a single creation can itself have multiple prompts. That means that each prompt set will result in a single creation made up of one or more prompts.

          When Try multiple prompt sets is turned on, you can duplicate an existing prompt set and then make whatever changes you like. For example, you might use a different modifier, or slightly change the prompt in other ways.        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
          onClick={closeModal}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}
