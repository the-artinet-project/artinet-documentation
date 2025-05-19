#!/bin/bash
set -e  # Exit on any error

echo "Starting documentation build process..."

# Make sure we're in the artinet-documentation directory
cd "$(dirname "$0")"

# Update the versions.md file with the latest CHANGELOG content
echo "Updating version history from CHANGELOG.md..."
if [ -f "../artinet-sdk/CHANGELOG.md" ]; then
    # Extract content from CHANGELOG.md
    CHANGELOG_CONTENT=$(cat "../artinet-sdk/CHANGELOG.md")
    
    # Create a temporary file with the updated content
    cat > temp_changelog.md << EOF
<!-- BEGIN CHANGELOG -->
$CHANGELOG_CONTENT
<!-- END CHANGELOG -->
EOF
    
    # Use awk to replace the content between markers
    awk '
    /<!-- BEGIN CHANGELOG -->/ { print; system("cat temp_changelog.md"); skip=1; next }
    /<!-- END CHANGELOG -->/ { skip=0 }
    !skip { print }
    ' docs/versions.md > docs/versions.md.new
    
    # Replace the original file with the new one
    mv docs/versions.md.new docs/versions.md
    rm temp_changelog.md
    echo "Version history updated from CHANGELOG.md"
else
    echo "Warning: CHANGELOG.md not found. Skipping version history update."
fi

# Generate API documentation from source code
echo "Generating API documentation from source code..."
if [ -f "generate-api-docs.js" ]; then
    node generate-api-docs.js
else
    echo "Warning: generate-api-docs.js not found. Skipping API docs generation."
fi

# Update mkdocs.yml to include the examples and tests sections
echo "Updating MkDocs configuration..."
# Create a backup of the original file
cp mkdocs.yml mkdocs.yml.bak

# Update the navigation section to properly include examples and tests
cat > mkdocs.yml << 'EOF'
site_name: Artinet SDK Documentation
site_url: https://the-artinet-project.github.io/artinet-documentation/
use_directory_urls: false
repo_url: https://github.com/the-artinet-project/artinet-sdk
repo_name: the-artinet-project/artinet-sdk
site_description: Documentation and API reference for the Artinet SDK - Agent2Agent Protocol Implementation

theme:
  name: material
  logo: images/artinet-logo.png
  favicon: images/artinet-logo.ico
  custom_dir: docs/overrides
  palette:
    primary: black
    accent: black
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.expand
    - navigation.top
    - search.highlight
    - content.code.copy
  icon:
    repo: fontawesome/brands/github

extra_css:
  - stylesheets/extra.css

extra_javascript:
  - javascript/extra.js

extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/the-artinet-project/artinet-sdk
      name: Artinet SDK on GitHub

nav:
  - Home: index.md
  - SDK:
    - Quickstart: sdk/quickstart.md
    - Core: sdk/core.md
    - Examples:
      - Overview: sdk/examples/index.md
      - Basic Server: sdk/examples/basic-server.md
      - Basic Usage: sdk/examples/basic-usage.md
      - Code Deployment: sdk/examples/code-deployment.md
      - File Storage Client: sdk/examples/file-storage-client.md
      - File Storage Client (Continued): sdk/examples/file-storage-client-continued.md
      - File Storage Server: sdk/examples/file-storage-server.md
      - Streaming Updates: sdk/examples/streaming-updates.md
      - Task Resubscribe: sdk/examples/task-resubscribe.md
      - Task Wrapper: sdk/examples/task-wrapper.md
    - Tests:
      - Overview: sdk/tests/index.md
      - A2A Protocol: sdk/tests/a2a-protocol.test.md
      - Bundler: sdk/tests/bundler.test.md
      - Client: sdk/tests/client.test.md
      - Common Errors: sdk/tests/common-errors.test.md
      - File Storage: sdk/tests/file-storage.test.md
      - HTTP Utils: sdk/tests/http-utils.test.md
      - Integration: sdk/tests/integration.test.md
      - Register: sdk/tests/register.test.md
      - RPC Client: sdk/tests/rpc-client.test.md
      - Server: sdk/tests/server.test.md
      - Server Error Handling: sdk/tests/server-error-handling.test.md
      - Server Impl: sdk/tests/server-impl.test.md
      - Streaming: sdk/tests/streaming.test.md
  - Agents:
    - Quick Agents: agents/quick_agents.md
  - API:
    - Overview: api/index.md
    - A2AClient: api/client.md
    - A2AServer: api/server.md
    - Task Context: api/task-context.md
    - Agent Bundler: api/bundler.md
  - Version History: versions.md
  - Contributing:
    - Code Documentation: contributing/code-documentation.md

markdown_extensions:
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - admonition
  - tables
  - pymdownx.details
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.emoji:
      emoji_index: !!python/name:material.extensions.emoji.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg

plugins:
  - search
EOF

echo "MkDocs configuration updated"

# Generate Doxygen documentation
echo "Generating Doxygen documentation..."
if [ -f "Doxyfile" ]; then
    doxygen Doxyfile
else
    echo "Warning: Doxyfile not found. Skipping Doxygen documentation."
fi

# Clean and build MkDocs site
echo "Building MkDocs site..."
mkdocs build --clean

echo "Documentation build complete!"
echo "Run 'mkdocs serve' to preview the site locally."