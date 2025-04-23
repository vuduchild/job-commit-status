# job-commit-status

GitHub Action that wraps a GitHub Actions Workflow job in a new commit status.

## Description

This action creates and updates a commit status for a GitHub Actions job. It will set the commit status to "pending" when the job starts and then update it to either "success" or "failure" when the job completes.

This becomes really useful when you want to create a required check for PRs, but want the implementation of the check to be in a reusable workflow (which then cannot be a required check on its own).

## Features

- Automatically creates a commit status with the job name
- Sets initial status to "pending" at the start of the job
- Updates the status to "success" or "failure" after the job completes
- Includes a link back to the job in the GitHub UI
- Supports custom job names and reusable workflows

## Usage

Add this action as a step at the beginning of your job:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set commit status
        uses: vuduchild/job-commit-status@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # Optional: Set a custom job name 
          # job-name: "Custom Job Name"
          
      # Your other steps go here
      - name: Run tests
        run: npm test
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `github-token` | GitHub token to use for authentication | Yes | `${{ github.token }}` |
| `job-name` | Custom job name to use instead of the default job name | No | Current job name |

## How it works

1. At the start of the job, it creates a "pending" commit status using the job name
2. At the end of the job, it automatically updates the commit status to "success" or "failure" based on the job's result
3. The commit status includes a link to the job in the GitHub UI

## Examples

### Basic Usage

```yaml
- name: Set commit status
  uses: your-username/job-commit-status@v1
```

### With Custom Job Name

```yaml
- name: Set commit status
  uses: your-username/job-commit-status@v1
  with:
    job-name: "Integration Tests"
```

## License

See the [LICENSE](LICENSE) file for details.
