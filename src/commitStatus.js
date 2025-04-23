const core = require('@actions/core');
const github = require('@actions/github');

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
  
  const { data } = await octokit.rest.actions.listJobsForWorkflowRun({ ...context.repo, run_id: context.runId });
  // the split is to support reusable workflows
  const job = data.jobs.find(({ name }) => name.split(/ \/ /).pop() === jobName);
  console.log("Job info:", job);
  
  console.log("Creating commit status with state:", state);
  await octokit.rest.repos.createCommitStatus({
    ...context.repo,
    sha: context.sha,
    context: jobName,
    description: description,
    state: state,
    target_url: `${job.html_url}?pr=${context.payload.pull_request.number}`,
  });
  console.log("Commit status updated");
}

module.exports = {
  createCommitStatus
};