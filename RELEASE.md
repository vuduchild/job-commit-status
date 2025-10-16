# Release Process

This document describes how to create a new release for the job-commit-status action.

## Current Version

The current version is **v1.2.0** as specified in `package.json`.

## Steps to Create a Release

### 1. Ensure all changes are committed and pushed

All changes should be committed to the main branch.

### 2. Create and push version tag

```bash
# Create the version tag
git tag -a v1.2.0 -m "Release v1.2.0"

# Push the tag to GitHub
git push origin v1.2.0
```

### 3. Update the major version tag

This allows users to reference `@v1` and automatically get the latest v1.x.x version:

```bash
# Update the v1 tag to point to v1.2.0
git tag -fa v1 -m "Update v1 to v1.2.0"

# Force push the updated tag
git push origin v1 --force
```

### 4. Create GitHub Release

1. Go to https://github.com/vuduchild/job-commit-status/releases/new
2. Select tag: `v1.2.0`
3. Release title: `v1.2.0`
4. Copy the relevant section from `CHANGELOG.md` for the release notes:

```markdown
## What's Changed

### Changed
- Use pull request head SHA when available instead of merge commit SHA (#26)
  - When running on a pull request, commit status now uses `github.event.pull_request.head.sha` instead of `github.sha`
  - Falls back to `github.sha` when not running on a pull request (e.g., on a branch or in the merge queue)
  - Ensures commit status is set on the actual commit being tested, not the temporary merge commit

**Full Changelog**: https://github.com/vuduchild/job-commit-status/compare/v1.1.0...v1.2.0
```

5. Click "Publish release"

## Automated Release (Alternative)

A GitHub Actions workflow has been added to automate the release process. To use it:

1. Go to Actions → Release workflow
2. Click "Run workflow"
3. Enter the version number (e.g., `1.2.0`)
4. Click "Run workflow"

The workflow will:
- Build the distribution files
- Create the version tag (e.g., `v1.1.0`)
- Update the major version tag (e.g., `v1`)
- Create a GitHub release with changelog

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (v1, v2, etc.): Incompatible API changes
- **MINOR** version (v1.1, v1.2, etc.): New functionality in a backward compatible manner
- **PATCH** version (v1.1.1, v1.1.2, etc.): Backward compatible bug fixes

## Major Version Tags

The major version tag (e.g., `v1`) should always point to the latest release in that major version. This allows users to reference the action as:

```yaml
uses: vuduchild/job-commit-status@v1
```

And automatically get bug fixes and new features without breaking changes.
