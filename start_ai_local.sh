#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if [ ! -f .env.local ]; then
  echo "MISSING .env.local"
  echo "Create it with: OPENAI_API_KEY=sk-proj-..."
  exit 1
fi
npm install
npm run dev
