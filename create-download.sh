#!/bin/bash

# Create a downloadable version of the project with fixed port configuration
echo "Creating downloadable package..."

# Create a temporary directory for the fixed version
mkdir -p /tmp/eduassess-fixed

# Copy all files except node_modules and .git
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' . /tmp/eduassess-fixed/

# Fix the port configuration in server/index.ts
sed -i 's/const port = 5000;/const port = process.env.PORT || 5000;/' /tmp/eduassess-fixed/server/index.ts
sed -i 's/port,/port: parseInt(port.toString()),/' /tmp/eduassess-fixed/server/index.ts

# Create tar.gz file
cd /tmp
tar -czf eduassess-platform-fixed.tar.gz eduassess-fixed/

# Move to current directory
mv eduassess-platform-fixed.tar.gz /workspace/

echo "Fixed package created: eduassess-platform-fixed.tar.gz"
echo "This includes the port configuration fix for Render deployment"