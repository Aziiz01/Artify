import { Code, ImageIcon, ArrowUpRightSquare , Music, VideoIcon, Sparkles } from "lucide-react";

export const MAX_FREE_COUNTS = 25;

export const tools = [
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: '/image',
  },
  {
    label: 'Enhance Your Creations',
    icon: Sparkles,
    href: '/image-to-image',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'Upscale Images',
    icon: ArrowUpRightSquare,
    href: '/upscale',
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  
  {
    label: 'Animation Generation',
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: '/video',
  },
  {
    label: 'Music Generation (coming soon)',
    icon: Music,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/music',
  },
];
