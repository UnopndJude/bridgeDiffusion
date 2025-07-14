<script>
  let processedImage = null;
  let isProcessing = false;
  let textPrompt = '';

  // Sample base image with circular edit area
  const sampleImage = 'data:image/svg+xml;base64,' + btoa(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="checkerboard" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="20" height="20" fill="#f0f0f0"/>
          <rect x="20" y="20" width="20" height="20" fill="#f0f0f0"/>
          <rect x="0" y="20" width="20" height="20" fill="#e0e0e0"/>
          <rect x="20" y="0" width="20" height="20" fill="#e0e0e0"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#checkerboard)"/>
      <circle cx="200" cy="200" r="80" fill="rgba(255,107,107,0.1)" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="8,4"/>
      <text x="200" y="205" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">Edit Area</text>
    </svg>
  `);

  function processImage() {
    if (!textPrompt.trim()) return;
    
    isProcessing = true;
    
    // TODO: Replace with actual Hugging Face API call
    setTimeout(() => {
      // Placeholder: For now, just show a sample processed image
      processedImage = sampleImage;
      isProcessing = false;
    }, 3000);
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
</script>

<main>
  <header>
    <h1>bridgeDiffusion Model Tester</h1>
    <p>Enter a text prompt to edit the circular area of the image</p>
  </header>

  <div class="image-container">
    <div class="image-panel">
      <h2>Original Image</h2>
      <div class="image-wrapper">
        <img src={sampleImage} alt="Sample image with edit area" />
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
    <div class="prompt-input">
      <textarea
        bind:value={textPrompt}
        on:keydown={handleKeyDown}
        placeholder="Enter your prompt to edit the circular area... (Press Enter to generate)"
        rows="3"
      ></textarea>
      <div class="input-actions">
        <button on:click={processImage} disabled={!textPrompt.trim() || isProcessing} class="generate-btn">
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
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .image-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .image-panel {
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #f9f9f9;
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
    border: 2px dashed #ccc;
    border-radius: 4px;
    background: white;
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
  }

  .prompt-input {
    border: 2px solid #ddd;
    border-radius: 12px;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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