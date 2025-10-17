const core = require('@actions/core');
const github = require('@actions/github');

/**
 * Retries an async function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise<*>}
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Check if error is retryable (network errors, timeouts, 5xx errors)
      const isRetryable = 
        error.status === 408 || // Request timeout
        error.status >= 500 || // Server errors
        error.message?.includes('timeout') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('ETIMEDOUT') ||
        error.message?.includes('ENOTFOUND');
      
      if (!isRetryable) {
        // Don't retry on client errors (4xx) or other non-retryable errors
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, attempt);
      core.info(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}): ${error.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Creates a commit status for the current repository
 * @param {string} description - The description of the commit status
 * @param {string} state - The state of the commit status (pending, success, failure)
 * @returns {Promise<void>}
 */
async function createCommitStatus(description, state) {
  const octokit = github.getOctokit(core.getInput('github-token'));
  const context = github.context;

  const jobName = core.getInput('job-name') || context.job;
  console.log(`Commit status name: ${jobName}`);
  
  const { data } = await retryWithBackoff(async () => {
    return await octokit.rest.actions.listJobsForWorkflowRun({ ...context.repo, run_id: context.runId });
  });
  // the split is to support reusable workflows
  const job = data.jobs.find(({ name }) => name.split(/ \/ /).pop() === jobName);
  console.log("Job info:", job);
  
  if (!job) {
    throw new Error(`Job with name "${jobName}" not found in workflow run`);
  }
  
  console.log("Creating commit status with state:", state);
  const prNumber = context.payload.pull_request?.number;
  const targetUrl = prNumber ? `${job.html_url}?pr=${prNumber}` : job.html_url;
  await retryWithBackoff(async () => {
    return await octokit.rest.repos.createCommitStatus({
      ...context.repo,
      sha: context.payload.pull_request?.head.sha || context.sha,
      context: jobName,
      description: description,
      state: state,
      target_url: targetUrl,
    });
  });
  console.log("Commit status updated");
}

module.exports = {
  createCommitStatus
};