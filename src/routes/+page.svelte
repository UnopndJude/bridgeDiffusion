<script>
  import { processImageWithFluxBase64, imageUrlToBase64 } from '$lib/huggingface.js';

  let processedImage = null;
  let isProcessing = false;
  let textPrompt = '';
  let errorMessage = '';
  let replicateApiKey = '';

  // Sample image from static folder
  const sampleImageUrl = '/photo-1579353977828-2a4eab540b9a.jpeg';

  // Load API key from localStorage
  $: {
    if (typeof window !== 'undefined') {
      replicateApiKey = localStorage.getItem('replicate_api_key') || '';
    }
  }

  async function processImage() {
    if (!textPrompt.trim()) return;

    isProcessing = true;
    errorMessage = '';

    try {
      // Convert sample image to base64
      const imageBase64 = await imageUrlToBase64(sampleImageUrl);

      // Call FLUX.1-Kontext-dev via Replicate API
      const resultImageUrl = await processImageWithFluxBase64(imageBase64, textPrompt, replicateApiKey);

      processedImage = resultImageUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      errorMessage = `Failed to process image: ${error.message}`;
    } finally {
      isProcessing = false;
    }
  }

  function clearResult() {
    processedImage = null;
    textPrompt = '';
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      processImage();
    }
  }

  function saveApiKey() {
    if (typeof window !== 'undefined' && replicateApiKey.trim()) {
      localStorage.setItem('replicate_api_key', replicateApiKey.trim());
    }
  }
</script>

<main>
  <header>
    <h1>FLUX.1-Kontext Image Editing</h1>
    <p>Enter an instruction to modify the entire image</p>
    <p style="font-size: 0.9em; color: rgba(255,255,255,0.8);">🚀 Real AI via Replicate API or Demo Mode</p>
  </header>

  <div class="image-container">
    <div class="image-panel">
      <h2>Original Image</h2>
      <div class="image-wrapper">
        <img src={sampleImageUrl} alt="Original image" class="sample-image" />
      </div>
    </div>

    <div class="image-panel">
      <h2>Processed Image</h2>
      <div class="image-wrapper">
        {#if isProcessing}
          <div class="loading">
            <div class="spinner"></div>
            <p>Processing with bridge diffusion...</p>
          </div>
        {:else if processedImage}
          <img src={processedImage} alt="Processed" />
        {:else}
          <div class="placeholder">
            <p>Processed image will appear here</p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="input-container">
    <!-- API Key Input -->
    <div class="api-key-input">
      <input
        type="password"
        bind:value={replicateApiKey}
        on:blur={saveApiKey}
        placeholder="Enter Replicate API key (optional - for real AI)"
        class="api-input"
      />
      <p class="api-help">
        Get your <strong>FREE</strong> API key from <a href="https://replicate.com" target="_blank">Replicate</a>
        (Sign up → Account → API Tokens) or leave empty for demo mode
      </p>
    </div>

    <!-- Prompt Input -->
    <div class="prompt-input">
      <textarea
        bind:value={textPrompt}
        on:keydown={handleKeyDown}
        placeholder="Enter editing instruction... (e.g., 'make it warmer', 'add rain', 'make it vintage')"
        rows="3"
      ></textarea>

      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}

      <div class="input-actions">
        <button
          on:click={processImage}
          disabled={!textPrompt.trim() || isProcessing}
          class="generate-btn"
        >
          {isProcessing ? 'Generating...' : 'Generate'}
        </button>
        <button on:click={clearResult} disabled={!processedImage && !textPrompt} class="clear-btn">
          Clear
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  :global(body) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    margin: 0;
  }

  :global(body::before) {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    position: relative;
    z-index: 1;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  h1 {
    color: white;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
    font-weight: 300;
    letter-spacing: 1px;
  }

  header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    font-weight: 300;
  }

  .image-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .image-panel {
    border: none;
    border-radius: 16px;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .image-panel h2 {
    text-align: center;
    margin-bottom: 1rem;
    color: #555;
  }

  .image-wrapper {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
  }

  .sample-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 8px;
  }

  .image-wrapper img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }

  .placeholder {
    text-align: center;
    color: #999;
    padding: 2rem;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #666;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .input-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .api-key-input {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .api-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
  }

  .api-input:focus {
    outline: none;
    border-color: #007bff;
    background: white;
  }

  .api-help {
    margin: 0;
    font-size: 12px;
    color: #666;
  }

  .api-help a {
    color: #007bff;
    text-decoration: none;
  }

  .api-help a:hover {
    text-decoration: underline;
  }

  .api-actions {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .test-api-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #007bff;
    border-radius: 6px;
    background: transparent;
    color: #007bff;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .test-api-btn:hover:not(:disabled) {
    background: #007bff;
    color: white;
  }

  .test-api-btn:disabled {
    border-color: #ccc;
    color: #ccc;
    cursor: not-allowed;
  }

  .api-status {
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 12px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .api-status.success {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.2);
  }

  .api-status.error {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    border: 1px solid rgba(220, 53, 69, 0.2);
  }

  .error-message {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    border: 1px solid rgba(220, 53, 69, 0.2);
    font-size: 14px;
  }

  .prompt-input {
    border: none;
    border-radius: 16px;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .prompt-input textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: vertical;
    min-height: 60px;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    background: transparent;
  }

  .prompt-input textarea::placeholder {
    color: #999;
  }

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #eee;
  }

  .generate-btn,
  .clear-btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .generate-btn {
    background: #007bff;
    color: white;
  }

  .generate-btn:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .generate-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .clear-btn {
    background: #f8f9fa;
    color: #6c757d;
    border: 1px solid #ddd;
  }

  .clear-btn:hover:not(:disabled) {
    background: #e9ecef;
    color: #495057;
  }

  .clear-btn:disabled {
    background: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .image-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    main {
      padding: 1rem;
    }

    .input-actions {
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
    }

    .generate-btn,
    .clear-btn {
      width: 100%;
    }
  }
</style>
