import { json } from '@sveltejs/kit';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
  try {
    const { id } = params;
    const api_key = url.searchParams.get('api_key');
    
    if (!api_key) {
      return json({ error: 'API key is required' }, { status: 400 });
    }

    const response = await fetch(`${REPLICATE_API_URL}/${id}`, {
      headers: {
        'Authorization': `Token ${api_key}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json({ 
        error: `Failed to check prediction status: ${response.status} - ${errorText}` 
      }, { status: response.status });
    }

    const prediction = await response.json();
    return json(prediction);
    
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}