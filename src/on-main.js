const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  octokit = github.getOctokit(core.getInput('github-token'));
  const context = github.context;
  
  const jobName = core.getInput('job-name') || context.job;
  console.log(`Commit status name: ${jobName}`);
  
  const { data } = await octokit.rest.actions.listJobsForWorkflowRun({ ...context.repo, run_id: context.runId });
  // the split is to support reusable workflows
  const job = data.jobs.find(({ name }) => name.split(/ \/ /).pop() === jobName);
  console.log("Job info: ", job);
  
  const newCommitStatusState = "pending";
  const newCommitStatusDescription = "running";
  
  console.log("Creating commit status with state: ", newCommitStatusState);
  await octokit.rest.repos.createCommitStatus({
    ...context.repo,
    sha: context.sha,
    context: jobName,
    description: newCommitStatusDescription,
    state: newCommitStatusState,
    target_url: `${job.html_url}?pr=${context.payload.pull_request.number}`,
  });
  console.log("Commit status created");
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}