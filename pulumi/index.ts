import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config("gcp");
const project = config.require("project");
const region = config.require("region");

// GCS bucket to store function source code
const sourceBucket = new gcp.storage.Bucket("rc-monitor-source", {
    project,
    location: region,
    uniformBucketLevelAccess: true,
});

// Upload function source as zip
const sourceArchive = new gcp.storage.BucketObject("rc-monitor-source-zip", {
    bucket: sourceBucket.name,
    source: new pulumi.asset.FileArchive("../functions"),
});

// Gen 2 Cloud Function with Remote Config trigger
const fn = new gcp.cloudfunctionsv2.Function("sendRCChangesToSlack", {
    name: "sendRCChangesToSlack",
    project,
    location: region,
    buildConfig: {
        runtime: "nodejs24",
        entryPoint: "sendRCChangesToSlack",
        source: {
            storageSource: {
                bucket: sourceBucket.name,
                object: sourceArchive.name,
            },
        },
    },
    serviceConfig: {
        maxInstanceCount: 100,
        availableMemory: "256M",
        timeoutSeconds: 60,
    },
    eventTrigger: {
        eventType: "google.firebase.remoteconfig.remoteConfig.v1.updated",
        triggerRegion: region,
        retryPolicy: "RETRY_POLICY_DO_NOT_RETRY",
    },
});

export const functionName = fn.name;
export const functionUrl = fn.serviceConfig.apply(s => s?.uri ?? "");
