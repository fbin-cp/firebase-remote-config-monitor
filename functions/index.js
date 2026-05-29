const { onConfigUpdated } = require('firebase-functions/v2/remoteConfig');
const admin = require('firebase-admin');
const runner = require("./src/monitor_runner.js");

admin.initializeApp();

exports.sendRCChangesToSlack = onConfigUpdated(async (event) => {
  const project = { projectId: process.env.GCLOUD_PROJECT };
  return runner.run(project, event.data.versionNumber, event.data.updateUser);
});
