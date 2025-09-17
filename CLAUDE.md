# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Advantage is a JavaScript/TypeScript library that provides a unified API for integrating high-impact advertising formats into websites. It acts as a bridge between publishers and advertising creatives, facilitating secure and standardized communication through a messaging system.

## Common Development Commands

### Build & Development
- `npm run dev` - Start the development server with Vite
- `npm run build` - Build the library (runs TypeScript compiler, Vite build, and generates bundles)
- `npm run bundle` - Create bundled version of the main library
- `npm run bundle:creative` - Create bundled version for creative-side integration

### Testing
- `npm test` - Run Jest tests for unit testing
- `npm run test-server` - Start the test server
- Cypress tests are available for e2e testing

### Documentation
- `npm run docs:dev` - Start VitePress documentation server
- `npm run docs:build` - Build documentation with TypeDoc and VitePress

### Release
- `npm run release` - Create a new release
- `npm run release:next` - Create a pre-release version

### Type Checking
- `tsc --noEmit` - Run TypeScript compiler for type checking without emitting files

## Code Architecture

### Core Components

1. **Formats** (`src/advantage/formats/`)
   - Built-in advertising formats: topscroll, midscroll, welcome page, double midscroll
   - Each format extends a base format helper
   - Formats define behavior for different ad placements

2. **Messaging System** (`src/advantage/messaging/`)
   - **Publisher Side** (`publisher-side.ts`): Handles communication from the publisher's webpage
   - **Creative Side** (`creative-side.ts`): Handles communication from within advertising creatives
   - Provides secure cross-frame communication between publishers and ad creatives

3. **Web Components**
   - `AdvantageWrapper` - Custom element for wrapping ad slots
   - `AdvantageUILayer` - Custom element for UI overlay functionality

4. **Utilities** (`src/utils/`)
   - `wrapping-helper.ts` - Helper for wrapping ad slot elements
   - `messaging.ts` - Core messaging utilities
   - `logging.ts` - Centralized logging system

### Module Exports

The library provides multiple entry points via package.json exports:
- Main: `@get-advantage/advantage` - Core library functionality
- Types: `@get-advantage/advantage/types` - TypeScript type definitions
- Messaging: `@get-advantage/advantage/messaging` - Full messaging system
- Creative: `@get-advantage/advantage/creative` - Creative-side only
- Publisher: `@get-advantage/advantage/publisher` - Publisher-side only
- Utils: `@get-advantage/advantage/utils` - Utility functions

### Build Configuration

- Uses Vite with TypeScript for development and production builds
- Supports both ES modules and CommonJS output formats
- Bundle builds available for IIFE/UMD distribution
- LightningCSS for CSS processing with browser target support
- Source maps generated for debugging

## Code Style

- TypeScript strict mode enabled
- Prettier configuration:
  - 4 spaces for indentation
  - No trailing commas
  - Double quotes for strings
  - Semicolons required

## Testing Approach

- Unit tests use Jest with ts-jest for TypeScript support
- E2E tests use Cypress for integration testing
- Test files follow `*.test.ts` or `*.spec.ts` naming convention