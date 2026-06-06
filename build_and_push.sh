#!/bin/bash
set -e

echo "Building and pushing Docker images for Vision Board 1.0"
echo "Target Docker Repository: asiffmahmad/todomain"

# Build the backend
echo "--- Building Backend ---"
cd backend
docker build -t asiffmahmad/todomain:backend-latest .
cd ..

# Build the frontend
echo "--- Building Frontend ---"
cd frontend
docker build -t asiffmahmad/todomain:frontend-latest .
cd ..

# Push images
echo "--- Pushing Images to Docker Hub ---"
docker push asiffmahmad/todomain:backend-latest
docker push asiffmahmad/todomain:frontend-latest

echo "Successfully built and pushed images!"
