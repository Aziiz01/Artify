import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription, countCredit } from "@/lib/subscription";
import axios from "axios";
import toast from 'react-hot-toast';

export async function Result(id :string) {
  const apiKey = "sk-5ZsXF8IuUTMG2CP7DBGqO978F5zCC3xJeQDnP836Fo87IXBp";


  try {
 
    const options: RequestInit = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${apiKey}`
        }};


// to check

        const response = await fetch(`https://api.stability.ai/v2alpha/generation/image-to-video/result/${id}`, options);

        if (!response.ok) {
          throw new Error(`Non-200 response: ${await response.text()}`);
        }

      const  status = response.status;

        if (status === 202) {
          toast.loading("Video is Processing");
        } else if (status === 200) {
            const responseData = await response.json();

            // Assuming the video data is in the "video" field of the response JSON
            const videoData = responseData.video;
    
            // Create a Blob from the base64-encoded video data
            const videoBlob = new Blob([Uint8Array.from(atob(videoData), c => c.charCodeAt(0))], { type: 'video/mp4' });
    
            // Create a video URL from the Blob
            const videoUrl = URL.createObjectURL(videoBlob);
    
            // Return the video URL
            return videoUrl;
        }
      
  
  } catch (error) {
    console.error('Error while animating:', error);
    toast.error('Error while animating, Please try again or Contact support');
    return null;
  }
}
