<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7c3bb558-8462-40b3-a979-29b3b5804ac4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file in the project root and add your Gemini API key:
   `GEMINI_API_KEY=your_api_key`
   Keep this file private; do not commit or share your key.
3. Run the app (restart it after changing the key):
   `npm run dev`

Without a key, the chat uses a limited local knowledge base and will identify itself as local mode.

If Gemini returns an error, check the server terminal for the Google API details. HTTP 401/403 usually means the key or API access is rejected; 429 indicates a quota or rate limit. Restart the server after changing `.env.local`.
