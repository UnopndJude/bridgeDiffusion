// Replicate API integration for FLUX.1-Kontext-dev
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

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

// Process image with instruction-based editing (Demo version)
export async function processImageWithInpainting(imageBase64, prompt) {
  try {
    // For demo, directly use simulation
    return await simulateImageEditing(imageBase64, prompt);
  } catch (error) {
    console.error('Error processing image with instruction editing:', error);
    throw error;
  }
}

// FLUX.1-Kontext-dev via Replicate API (Instruction-based editing)
export async function processImageWithFluxBase64(imageBase64, prompt, replicateApiKey) {
  try {
    // Try Replicate API first
    if (replicateApiKey && replicateApiKey.trim()) {
      try {
        return await processWithReplicate(imageBase64, prompt, replicateApiKey);
      } catch (replicateError) {
        console.log('Replicate API failed, falling back to demo:', replicateError);
      }
    }
    
    // Fallback to demo simulation
    console.log('Using demo simulation for instruction:', prompt);
    return await simulateImageEditing(imageBase64, prompt);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Replicate API implementation for instruction-based editing
async function processWithReplicate(imageBase64, prompt, apiKey) {
  const response = await fetch(REPLICATE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "black-forest-labs/flux-1-kontext-dev",
      input: {
        image: `data:image/jpeg;base64,${imageBase64}`,
        prompt: prompt,
        guidance_scale: 2.5,
        num_inference_steps: 25,
        seed: 42
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate API failed: ${response.status} - ${errorText}`);
  }

  const prediction = await response.json();
  
  // Poll for completion
  return await pollReplicateResult(prediction.id, apiKey);
}

// Poll Replicate for result
async function pollReplicateResult(predictionId, apiKey) {
  const maxAttempts = 30;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check prediction status: ${response.status}`);
    }

    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction.output[0]; // Return the generated image URL
    } else if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }
    
    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Prediction timed out');
}

// Demo simulation for instruction-based image editing
async function simulateImageEditing(imageBase64, prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Apply visual effects based on instruction
        applyEditingEffect(ctx, img.width, img.height, prompt);
        
        // Add demo watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 300, 60);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`✨ Demo Edit: "${prompt}"`, 20, 30);
        ctx.fillText(`🚀 Real AI needs Replicate API key`, 20, 50);
        
        resolve(canvas.toDataURL());
      };
      img.src = `data:image/jpeg;base64,${imageBase64}`;
    }, 2000); // Simulate processing time
  });
}

// Apply visual effects based on editing instruction
function applyEditingEffect(ctx, width, height, prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Color temperature changes
  if (lowerPrompt.includes('warm') || lowerPrompt.includes('sunset') || lowerPrompt.includes('golden')) {
    ctx.fillStyle = 'rgba(255, 200, 100, 0.2)';
    ctx.fillRect(0, 0, width, height);
  } else if (lowerPrompt.includes('cold') || lowerPrompt.includes('blue') || lowerPrompt.includes('winter')) {
    ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.fillRect(0, 0, width, height);
  }
  
  // Brightness changes
  if (lowerPrompt.includes('darker') || lowerPrompt.includes('night')) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
  } else if (lowerPrompt.includes('brighter') || lowerPrompt.includes('sunny')) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, width, height);
  }
  
  // Style changes
  if (lowerPrompt.includes('vintage') || lowerPrompt.includes('sepia')) {
    ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
    ctx.fillRect(0, 0, width, height);
  } else if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
    ctx.fillStyle = 'rgba(255, 0, 255, 0.15)';
    ctx.fillRect(0, 0, width, height);
  }
  
  // Add simple overlay patterns
  if (lowerPrompt.includes('rain') || lowerPrompt.includes('storm')) {
    // Draw rain lines
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 5, y + 20);
      ctx.stroke();
    }
  }
}


// Test API key validity with a simple, reliable model
export async function testApiKey(apiKey) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Hello',
        options: { wait_for_model: true }
      }),
    });

    if (response.ok) {
      return { valid: true, message: 'API key is valid ✅' };
    } else {
      const errorText = await response.text();
      return { valid: false, message: `API key test failed: ${response.status} - ${errorText}` };
    }
  } catch (error) {
    return { valid: false, message: `API key test failed: ${error.message}` };
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