#!/usr/bin/env bash
set -e
rm -f data/generatedDrugs.ts
npm run extract:stahl
echo "Done. Restart with: npm run dev"
