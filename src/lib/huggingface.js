// Replicate API integration for FLUX.1-Kontext-dev
const FLUX_KONTEXT_MODEL = 'black-forest-labs/flux-kontext-dev';



// FLUX.1-Kontext-dev via Replicate API (Instruction-based editing)
export async function processImageWithFluxBase64(imageBase64, prompt, replicateApiKey, logCallback) {
  try {
    // Try Replicate API first
    if (replicateApiKey && replicateApiKey.trim()) {
      try {
        logCallback?.('🔗 Using Replicate API with provided key', 'info');
        return await processWithReplicate(imageBase64, prompt, replicateApiKey, logCallback);
      } catch (replicateError) {
        logCallback?.(`❌ Replicate API failed: ${replicateError.message}`, 'error');
        logCallback?.('🔄 Falling back to demo mode', 'info');
      }
    }
    
    // Fallback to demo simulation
    logCallback?.('🎭 Using demo simulation mode', 'info');
    return await simulateImageEditing(imageBase64, prompt, logCallback);
  } catch (error) {
    logCallback?.(`❌ Processing failed: ${error.message}`, 'error');
    throw error;
  }
}

// Replicate API implementation for instruction-based editing
async function processWithReplicate(imageBase64, prompt, apiKey, logCallback) {
  // Convert base64 to data URL for Replicate
  const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
  
  logCallback?.('📡 Sending request via server proxy...', 'info');
  logCallback?.(`📝 Model: ${FLUX_KONTEXT_MODEL}`, 'info');
  logCallback?.(`💬 Prompt: "${prompt}"`, 'info');
  
  try {
    const response = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        input_image: imageDataUrl,
        api_key: apiKey
      })
    });
    
    logCallback?.(`📊 Response status: ${response.status}`, 'info');
    
    if (!response.ok) {
      const errorData = await response.json();
      logCallback?.(`❌ API Request failed: ${response.status}`, 'error');
      logCallback?.(`📄 Error details: ${errorData.error}`, 'error');
      throw new Error(`Server proxy failed: ${response.status} - ${errorData.error}`);
    }

    const prediction = await response.json();
    logCallback?.(`🆔 Prediction ID: ${prediction.id}`, 'info');
    logCallback?.(`📊 Status: ${prediction.status}`, 'info');
    
    // Poll for completion
    return await pollReplicateResult(prediction.id, apiKey, logCallback);
  } catch (fetchError) {
    logCallback?.(`❌ Fetch error: ${fetchError.message}`, 'error');
    logCallback?.(`🔍 Error type: ${fetchError.name}`, 'error');
    throw new Error(`Network error: ${fetchError.message}`);
  }
}

// Poll Replicate for result
async function pollReplicateResult(predictionId, apiKey, logCallback) {
  const maxAttempts = 30;
  let attempts = 0;
  
  logCallback?.('🔄 Starting to poll for results...', 'info');
  
  while (attempts < maxAttempts) {
    logCallback?.(`⏳ Polling attempt ${attempts + 1}/${maxAttempts}`, 'info');
    
    const response = await fetch(`/api/replicate/${predictionId}?api_key=${encodeURIComponent(apiKey)}`);

    if (!response.ok) {
      const errorData = await response.json();
      logCallback?.(`❌ Poll failed: ${response.status}`, 'error');
      logCallback?.(`📄 Error: ${errorData.error}`, 'error');
      throw new Error(`Failed to check prediction status: ${response.status}`);
    }

    const prediction = await response.json();
    logCallback?.(`📊 Status: ${prediction.status}`, 'info');
    
    if (prediction.status === 'succeeded') {
      logCallback?.('🎉 Prediction succeeded!', 'success');
      logCallback?.(`🖼️ Output: ${prediction.output}`, 'success');
      return prediction.output;
    } else if (prediction.status === 'failed') {
      logCallback?.(`❌ Prediction failed: ${prediction.error}`, 'error');
      throw new Error(`Prediction failed: ${prediction.error}`);
    }
    
    // Wait 2 seconds before next poll
    logCallback?.('⏸️ Waiting 2 seconds before next poll...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  logCallback?.('⏰ Prediction timed out after 30 attempts', 'error');
  throw new Error('Prediction timed out');
}

// Simple demo simulation (no hard-coded cases)
async function simulateImageEditing(imageBase64, prompt, logCallback) {
  return new Promise((resolve) => {
    logCallback?.('🎭 Starting demo simulation...', 'info');
    logCallback?.(`📝 Demo prompt: "${prompt}"`, 'info');
    logCallback?.('⏳ Simulating processing delay...', 'info');
    
    setTimeout(() => {
      logCallback?.('🎨 Generating demo result...', 'info');
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add demo watermark (no hard-coded editing effects)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 380, 80);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`✨ Demo Mode`, 20, 30);
        ctx.fillText(`📝 Instruction: "${prompt}"`, 20, 50);
        ctx.fillText(`🚀 Add Replicate API key for real AI editing`, 20, 70);
        
        logCallback?.('✅ Demo image generated', 'success');
        resolve(canvas.toDataURL());
      };
      img.src = `data:image/jpeg;base64,${imageBase64}`;
    }, 2000); // Simulate processing time
  });
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