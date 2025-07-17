import { json } from '@sveltejs/kit';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { prompt, input_image, api_key } = await request.json();
    
    if (!api_key) {
      return json({ error: 'API key is required' }, { status: 400 });
    }

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '85723d503c17da3f9fd9cecfb9987a8bf60ef747fd8f68a25d7636f88260eb59',
        input: {
          prompt: prompt,
          input_image: input_image,
          aspect_ratio: "1:1",
          output_format: "png",
          safety_tolerance: 2,
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json({ 
        error: `Replicate API failed: ${response.status} - ${errorText}` 
      }, { status: response.status });
    }

    const prediction = await response.json();
    return json(prediction);
    
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}