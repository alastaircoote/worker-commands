import { fireCommand } from "./command-registry";

declare var self: ServiceWorkerGlobalScope;

async function handlePush(e: PushEvent) {
    if (!e.data) {
        return;
    }

    let json: any = await e.data.json();

    if (json.data && json.data.payload) {
        // This is specific to pushkin and how Firebase Cloud Messaging sends payloads.
        // Maybe we can standardise this at some point.
        json = JSON.parse(json.data.payload);
    } else if (json.notification && json.data && json.data.__isWorkerCommandPayload) {
        console.info("Received Firebase notification payload");
        await fireCommand({
            command: "notification.show",
            options: json.notification
        });
        return;
    }

    if (!json.__workerCommandPayload) {
        return;
    }
    console.info("Received push payload", json.__workerCommandPayload);
    try {
        await fireCommand(json.__workerCommandPayload);
    } catch (err) {
        console.error(err);
    }
}

export function setup() {
    self.addEventListener("push", function(e) {
        e.waitUntil(handlePush(e));
    });
}
