#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Building Frontend ---"
cd frontend
npm install
npm run build
cd ..

echo "--- Building Backend dependencies ---"
pip install -r backend/requirements.txt

echo "--- Build Completed Successfully ---"
