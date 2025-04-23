const core = require('@actions/core');
const { createCommitStatus } = require('./commitStatus');

async function run() {
  await createCommitStatus("running", "pending");
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}