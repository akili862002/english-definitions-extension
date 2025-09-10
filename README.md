# AI Translator Browser Extension

A browser extension that provides instant AI-powered translation and interpretation of selected text using OpenAI's GPT models.

## Features

- **Instant Translation**: Automatically translates text selected on any webpage
- **Detailed Interpretations**: Provides meanings and examples for translated words/phrases
- **Custom API Key**: Use your own OpenAI API key for translations
- **Modern UI**: Clean, responsive interface with Tailwind CSS
- **Secure**: API keys are stored locally in your browser

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API via ai-sdk
- **Build Tool**: Vite
- **Browser API**: Chrome Extension API

## Installation

### Development Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd translator-extension
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

### Loading the Extension in Chrome

1. Build the extension:

   ```bash
   npm run build
   # or
   bun run build
   ```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `dist` folder from this project
5. The extension should now appear in your browser toolbar

## Usage

1. Select text on any webpage
2. Click the extension icon in your browser toolbar
3. The extension will automatically translate the selected text
4. Alternatively, type text directly into the input field and click "Translate"

## Configuration

1. Click the settings icon in the extension popup
2. Enter your OpenAI API key
3. Click "Save"

## Development

### Project Structure

- `src/` - Source code
  - `App.tsx` - Main application component
  - `components/` - React components
    - `Settings.tsx` - Settings modal component
  - `icons.tsx` - SVG icons used in the UI
  - `main.tsx` - Entry point
- `public/` - Static assets and manifest.json
- `dist/` - Build output

### Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Security

Your OpenAI API key is stored securely in Chrome's sync storage and is never sent to any server other than OpenAI's API endpoints.

## License

[MIT](LICENSE)
