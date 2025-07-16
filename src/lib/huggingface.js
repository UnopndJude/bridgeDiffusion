// Hugging Face API integration for Stable Diffusion Inpainting
const HF_API_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-inpainting';

// Create circular mask for inpainting
function createCircularMask(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Fill with black (areas to keep)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  
  // Draw white circle (area to inpaint)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, Math.min(width, height) / 4, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

// Process image with Stable Diffusion Inpainting
export async function processImageWithInpainting(imageBase64, prompt, apiKey) {
  if (!apiKey) {
    throw new Error('Hugging Face API key is required');
  }

  try {
    // Create a temporary image to get dimensions
    const img = new Image();
    img.src = `data:image/jpeg;base64,${imageBase64}`;
    await new Promise((resolve) => img.onload = resolve);
    
    // Create mask for circular area
    const maskBase64 = createCircularMask(img.width, img.height).split(',')[1];
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          prompt: prompt,
          image: imageBase64,
          mask: maskBase64,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    return imageUrl;
  } catch (error) {
    console.error('Error processing image with Stable Diffusion:', error);
    throw error;
  }
}

// Alternative: Using base64 response
export async function processImageWithFluxBase64(imageBase64, prompt, apiKey) {
  if (!apiKey) {
    throw new Error('Hugging Face API key is required');
  }

  try {
    // Create a temporary image to get dimensions
    const img = new Image();
    img.src = `data:image/jpeg;base64,${imageBase64}`;
    await new Promise((resolve) => img.onload = resolve);
    
    // Create mask for circular area
    const maskBase64 = createCircularMask(img.width, img.height).split(',')[1];
    
    // Using FormData for inpainting
    const formData = new FormData();
    
    // Convert base64 to blob
    const imageBlob = await fetch(`data:image/jpeg;base64,${imageBase64}`).then(res => res.blob());
    const maskBlob = await fetch(`data:image/png;base64,${maskBase64}`).then(res => res.blob());
    
    formData.append('inputs', prompt);
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    return imageUrl;
  } catch (error) {
    console.error('Error processing image with Stable Diffusion:', error);
    throw error;
  }
}

// Convert image URL to base64
export async function imageUrlToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}