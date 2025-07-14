# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bridgeDiffusion is a web application for testing diffusion models. The app displays original images on the left and model-processed images on the right, allowing side-by-side comparison.

## Technology Stack

- **Framework**: Svelte/SvelteKit
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Vite (bundled with SvelteKit)

## Development Commands

```bash
pnpm install      # Install dependencies
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm preview     # Preview production build
pnpm lint        # Run ESLint
pnpm format      # Run Prettier
pnpm test        # Run tests (when configured)
```

## Project Structure

```
bridgeDiffusion/
├── src/
│   ├── routes/          # SvelteKit routes
│   │   └── +page.svelte # Main page with image comparison
│   ├── lib/             # Shared components and utilities
│   └── app.html         # HTML template
├── static/              # Static assets (images, etc.)
├── tests/               # Test files
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json         # Project dependencies
├── svelte.config.js     # Svelte configuration
└── vite.config.js       # Vite configuration
```

## Key Features

- Single-page application with side-by-side image comparison
- Left panel: Original image upload/display
- Right panel: Processed image display after model inference
- Image upload functionality
- Model integration for image processing

## Development Guidelines

- Use Svelte's reactive declarations for state management
- Follow the SvelteKit file-based routing convention
- Ensure all code passes ESLint and Prettier checks before committing
- Keep components modular and reusable in `src/lib/`
