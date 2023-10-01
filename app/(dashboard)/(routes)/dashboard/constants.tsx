import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Photo prompt is required"
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 Photo"
  },
  {
    value: "2",
    label: "2 Photos"
  },
  {
    value: "3",
    label: "3 Photos"
  },
  {
    value: "4",
    label: "4 Photos"
  },
  {
    value: "5",
    label: "5 Photos"
  }
];

export const resolutionOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];
export const promptOptions = [
  "Futuristic cityscape with neon lights and flying cars",
  "Fantasy landscape with floating islands and magical creatures",
  "Abstract expressionist painting with vibrant colors and dynamic shapes",
  "Portrait of a famous historical figure using a modern art style",
  "Dreamy underwater scene with bioluminescent sea creatures",
  "Cyberpunk character in a dystopian future setting",
  "Surreal scene where everyday objects come to life",
  "Psychedelic artwork inspired by music and visual distortions",
  "Steampunk-inspired machine or gadget with intricate details",
  "Digital collage combining elements from different time periods",
  "Minimalist artwork with a focus on clean lines and simplicity",
  "Artwork inspired by outer space, featuring galaxies and cosmic phenomena",
  "Artwork that captures the essence of a specific emotion, like joy or melancholy",
  "Nature-inspired piece showcasing the beauty of the wilderness",
  "Pop art-style portrait of a contemporary celebrity",
  "Scene from a classic literature work using a modern twist",
  "Artwork that visualizes a concept, such as freedom or hope",
  "Retro-futuristic illustration reminiscent of the 1980s",
  "Whimsical and colorful fantasy creature",
  "Artwork that combines both realism and abstraction in a unique way",
];
export const StyleOptions = [
  {
    value: "",
    label: "No Style"
  },
  {
    value: "Realistic",
    label: "Realistic"
  },
  {
    value: "Anime",
    label: "Anime"
  },
  {
    value: "Cosmic",
    label: "Cosmic"
  },
];