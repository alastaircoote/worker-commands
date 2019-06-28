import { fireCommand } from "./command-registry";

declare var self: ServiceWorkerGlobalScope;

async function handlePush(e: PushEvent) {
    e.waitUntil(
        (async function() {
            if (!e.data) {
                return true;
            }
            let json: any = await e.data.json();

            if (json.data && json.data.payload) {
                // This is specific to pushkin and how Firebase Cloud Messaging sends payloads.
                // Maybe we can standardise this at some point.
                json = JSON.parse(json.data.payload);
            } else if (
                json.notification &&
                json.data &&
                json.data.__isWorkerCommandPayload &&
                !json.data.__workerCommandPayload
            ) {
                console.info("Received Firebase notification payload");
                await fireCommand({
                    command: "notification.show",
                    options: json.notification
                });
                return true;
            }

            let payload = json.__workerCommandPayload;

            if (!payload && json.data) {
                payload = json.data.__workerCommandPayload;
            }

            if (!payload) {
                return true;
            }

            if (typeof payload === "string") {
                payload = JSON.parse(payload);
            }

            console.info("Received push payload", payload);
            try {
                await fireCommand(payload);
            } catch (err) {
                console.error(err);
            }
            return true;
        })()
    );
}

export function setup() {
    self.addEventListener("push", function(e) {
        e.waitUntil(handlePush(e));
    });
}
