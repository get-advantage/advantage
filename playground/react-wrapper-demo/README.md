# React Wrapper Demo

Simple React application demonstrating the Advantage React wrapper component.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the displayed URL (usually http://localhost:5173)

## Features

- **Format Selection**: Switch between WELCOME_PAGE, TOPSCROLL, and MIDSCROLL formats
- **Ad Loading**: Load and reset ads dynamically
- **Event Logging**: See real-time events from the Advantage wrapper
- **Realistic Layout**: Sample news article with contextual ad placement

## Usage

1. Select an ad format using the buttons
2. Click "Load Ad" to display a demo ad in the selected format
3. Watch the event log to see wrapper interactions
4. Use "Reset" to clear the ad and try different formats

The demo uses placeholder ads with gradient backgrounds. In a real implementation, the Advantage library would load actual ad content.

## Import Usage

The app demonstrates importing the React wrapper:

```tsx
import { AdvantageWrapper } from '@get-advantage/advantage/react';
```

This uses the Vite alias configured in `vite.config.ts` to resolve to the actual wrapper component in the main project.
