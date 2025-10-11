#!/bin/bash
# Script to prepare and validate a release

set -e

echo "=== Release Preparation Checklist ==="
echo ""

# Check if we're on a clean working tree
if [[ -n $(git status -s) ]]; then
  echo "❌ Working tree is not clean. Commit or stash changes first."
  exit 1
fi
echo "✅ Working tree is clean"

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "✅ Version from package.json: $VERSION"

# Check if CHANGELOG.md exists and has an entry for this version
if [[ ! -f CHANGELOG.md ]]; then
  echo "❌ CHANGELOG.md not found"
  exit 1
fi

if ! grep -q "\[$VERSION\]" CHANGELOG.md; then
  echo "❌ CHANGELOG.md does not contain an entry for version $VERSION"
  exit 1
fi
echo "✅ CHANGELOG.md contains entry for $VERSION"

# Check if dist folder exists and is built
if [[ ! -d dist/main ]] || [[ ! -d dist/post ]]; then
  echo "❌ dist folder not properly built. Run 'npm run build'"
  exit 1
fi
echo "✅ dist folder is present"

# Run build to ensure it's up to date
echo ""
echo "Building to ensure dist is up to date..."
npm run build

if [[ -n $(git status -s) ]]; then
  echo "❌ dist folder was out of date. Please commit the updated dist folder."
  exit 1
fi
echo "✅ dist folder is up to date"

echo ""
echo "=== Release Ready ==="
echo ""
echo "Version: v$VERSION"
echo ""
echo "Next steps:"
echo "1. Merge this PR to main"
echo "2. Create and push tags:"
echo "   git tag -a v$VERSION -m 'Release v$VERSION'"
echo "   git push origin v$VERSION"
echo ""
echo "3. Update major version tag (v$(echo $VERSION | cut -d. -f1)):"
echo "   git tag -fa v$(echo $VERSION | cut -d. -f1) -m 'Update v$(echo $VERSION | cut -d. -f1) to v$VERSION'"
echo "   git push origin v$(echo $VERSION | cut -d. -f1) --force"
echo ""
echo "4. Create GitHub release at:"
echo "   https://github.com/vuduchild/job-commit-status/releases/new?tag=v$VERSION"
echo ""
echo "Or use the automated workflow:"
echo "   https://github.com/vuduchild/job-commit-status/actions/workflows/release.yml"
echo ""
