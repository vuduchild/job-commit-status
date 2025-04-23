const core = require('@actions/core');
const { createCommitStatus } = require('./commitStatus');

async function run() {
  // there's no good way to get an updated job status in javascript, so we take it from the hardcoded input in action.yml
  const jobStatus = core.getInput('__job-status-for-post-run-do-not-use')
  console.log("Job status:", jobStatus);
  const newCommitStatusDescription = jobStatus;
  const newCommitStatusState = (jobStatus === "success") && jobStatus || "failure";

  await createCommitStatus(newCommitStatusDescription, newCommitStatusState);
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}