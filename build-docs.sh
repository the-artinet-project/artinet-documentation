#!/bin/bash

# Make sure we have the SDK repository
if [ -d "../artinet-sdk" ]; then
    echo "Updating SDK repository..."
    cd ../artinet-sdk
    git pull
    cd ../artinet-wiki
else
    echo "Cloning SDK repository..."
    cd ..
    git clone https://github.com/the-artinet-project/artinet-sdk.git
    cd artinet-wiki
fi

# Generate Doxygen documentation
echo "Generating Doxygen documentation..."
doxygen Doxyfile

# Build MkDocs site
echo "Building MkDocs site..."
mkdocs build

echo "Documentation build complete!"