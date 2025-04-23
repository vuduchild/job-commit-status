const core = require('@actions/core');
const github = require('@actions/github');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function run() {
  octokit = github.getOctokit(core.getInput('github-token'));
  const context = github.context;

  const jobName = core.getInput('job-name') || context.job;
  console.log(`Commit status name: ${jobName}`);
  
  const { data } = await octokit.rest.actions.listJobsForWorkflowRun({ ...context.repo, run_id: context.runId });
  // the split is to support reusable workflows
  const job = data.jobs.find(({ name }) => name.split(/ \/ /).pop() === jobName);
  console.log("Job info:", job);

  // there's no good way to get an updated job status in javascript, so we take it from the hardcoded input in action.yml
  const jobStatus = core.getInput('__job-status-for-post-run-do-not-use')
  console.log("Job status:", jobStatus);
  const newCommitStatusDescription = jobStatus;
  const newCommitStatusState = (jobStatus === "success") && jobStatus || "failure";
  
  console.log("Creating commit status with state:", newCommitStatusState);
  await octokit.rest.repos.createCommitStatus({
    ...context.repo,
    sha: context.sha,
    context: jobName,
    description: newCommitStatusDescription,
    state: newCommitStatusState,
    target_url: `${job.html_url}?pr=${context.payload.pull_request.number}`,
  });
  console.log("Commit status updated");
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}