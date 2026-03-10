# 🎬 CineMatch AI — Movie Recommendation System

AI-powered movie recommendation engine with explanation generation, multiple recommendation approaches, and evaluation metrics.

## Features

- **250-movie dataset** spanning 1927–2024 with rich metadata
- **Content-Based Filtering** — TF-IDF embeddings + cosine similarity
- **NLP Semantic Search** — natural language query matching
- **LLM-Powered** — Claude AI for conversational recommendations (optional)
- **Explanation generation** for every recommendation
- **4 input methods**: like/dislike, star ratings, natural language, genre filters
- **5 evaluation metrics**: Precision@K, NDCG, diversity, coverage, user satisfaction

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) For LLM mode, copy .env.example to .env and add your API key
cp .env.example .env
# Edit .env and add your Anthropic API key

# 3. Start the dev server
npm run dev
```

The app opens at **http://localhost:3000**.

## Usage

1. **Browse** the 250-movie catalog, filter by genre or search
2. **Like/dislike** or **star-rate** movies you've seen
3. Choose a recommendation mode:
   - **Content-Based** — works offline, uses TF-IDF similarity
   - **NLP Search** — type what you want in natural language
   - **LLM AI** — uses Claude for context-aware picks (needs API key)
4. Click **Get Recommendations**
5. Check the **Metrics** tab for evaluation scores

## API Key (Optional)

The LLM AI mode requires an Anthropic API key. Content-Based and NLP Search modes work fully without one.

1. Get a key at https://console.anthropic.com/
2. Create a `.env` file: `VITE_ANTHROPIC_API_KEY=sk-ant-...`

> **Note**: The `anthropic-dangerous-direct-browser-access` header is used for direct browser calls. For production, proxy API calls through a backend server.

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the build
```
