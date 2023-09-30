import axios from 'axios';

// Define your API key
const apiKey ='sk-9e2cyUTvElmetXgbPETM5ialGGB3FAcwtY0DX7Q2tsbEP9qG';
console.log('API Key:', apiKey);

// Create a function to make the API call
export async function SDXLv1(textInput: string) {
  try {
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [
          {
            text: textInput,
          },
        ],
        steps: 30,
        cfg_scale: 5,
        height: 1024,
        width: 1024,
        samples: 1,
        seed: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.status === 200) {
      const imageData = response.data.artifacts[0].base64;
      return imageData;
    } else {
      console.error('Error:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
