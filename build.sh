
#!/bin/bash

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Build Docker image
docker build -t lovable-app:$VERSION .

echo "Docker image built successfully: lovable-app:$VERSION"
