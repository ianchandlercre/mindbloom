# 🌱 MindBloom - Adaptive Brain Training

A personalized brain training platform designed for seniors. Features 7 cognitive games that adapt to your abilities and interests.

## Quick Start

```bash
# Requires Node.js 18+
npm install
npm run dev
# Open http://localhost:3000
```

## Production Deployment

### Option 1: Vercel (Recommended)
```bash
npx vercel --yes
```

### Option 2: Railway / Render
Push to GitHub, then connect the repo. Both support Next.js with SQLite out of the box.

### Option 3: Self-Hosted
```bash
npm install
npm run build
npm start
# Runs on port 3000 by default
```

### Option 4: Docker
```bash
docker build -t mindbloom .
docker run -p 3000:3000 mindbloom
```

## Features

- **7 Brain Games**: Word Scramble, Word Connection, Memory Match, Sequence Recall, Pattern Finder, Number Crunch, Knowledge Quiz
- **Personality Survey**: 12-question survey that maps to cognitive dimensions and interest areas
- **Adaptive Engine**: Difficulty auto-adjusts based on performance and feedback
- **Profile Dashboard**: Radar chart of cognitive dimensions, stats, streaks, game history
- **Post-Game Feedback**: Enjoyment, difficulty, and replay ratings that influence recommendations
- **SQLite Database**: All data persists locally
- **AI-Ready**: Placeholder interfaces ready for Claude/Gemini API integration

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- SQLite via better-sqlite3
- TypeScript
