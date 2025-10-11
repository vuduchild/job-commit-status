# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-11

### Fixed
- Fixed TypeError when PR number is null in merge queue contexts (#24)
  - Use optional chaining to safely access PR number
  - Conditionally construct target URL based on PR number availability
  - Maintains full functionality in PR contexts while gracefully handling scenarios where PR number is unavailable

## [1.0.0] - 2025-04-23

### Added
- Initial release
- Creates and updates commit status for GitHub Actions jobs
- Sets commit status to "pending" when job starts
- Updates status to "success" or "failure" when job completes
- Includes link back to job in GitHub UI
- Supports custom job names and reusable workflows
