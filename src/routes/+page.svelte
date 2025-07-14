<script>
  let originalImage = null;
  let processedImage = null;
  let isProcessing = false;
  let fileInput;

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        originalImage = e.target.result;
        processedImage = null;
      };
      reader.readAsDataURL(file);
    }
  }

  function processImage() {
    if (!originalImage) return;

    isProcessing = true;

    // Simulate model processing with a delay
    setTimeout(() => {
      // For now, just copy the original image as a placeholder
      processedImage = originalImage;
      isProcessing = false;
    }, 2000);
  }

  function clearImages() {
    originalImage = null;
    processedImage = null;
    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<main>
  <header>
    <h1>bridgeDiffusion Model Tester</h1>
    <p>Upload an image to test the diffusion model</p>
  </header>

  <div class="controls">
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      on:change={handleFileSelect}
      class="file-input"
    />
    <button on:click={processImage} disabled={!originalImage || isProcessing} class="process-btn">
      {isProcessing ? 'Processing...' : 'Process Image'}
    </button>
    <button on:click={clearImages} disabled={!originalImage} class="clear-btn"> Clear </button>
  </div>

  <div class="image-container">
    <div class="image-panel">
      <h2>Original Image</h2>
      <div class="image-wrapper">
        {#if originalImage}
          <img src={originalImage} alt="Original" />
        {:else}
          <div class="placeholder">
            <p>Select an image to upload</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="image-panel">
      <h2>Processed Image</h2>
      <div class="image-wrapper">
        {#if isProcessing}
          <div class="loading">
            <div class="spinner"></div>
            <p>Processing image...</p>
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

  .controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .file-input {
    padding: 0.5rem;
    border: 2px solid #ddd;
    border-radius: 4px;
    background: white;
  }

  .process-btn,
  .clear-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .process-btn {
    background: #007bff;
    color: white;
  }

  .process-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  .process-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .clear-btn {
    background: #dc3545;
    color: white;
  }

  .clear-btn:hover:not(:disabled) {
    background: #c82333;
  }

  .clear-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .image-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
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

  @media (max-width: 768px) {
    .image-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .controls {
      flex-direction: column;
      align-items: center;
    }

    main {
      padding: 1rem;
    }
  }
</style>
