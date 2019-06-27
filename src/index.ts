export { fireCommand, registerCommand, addListener, removeListener } from "./command-registry";
import { setup as notificationSetup } from "./commands/notification";
import { setup as clientSetup } from "./commands/client";
import { setup as registrationSetup } from "./commands/registration";
import { setup as pushSetup } from "./push";
import { setup as cacheSetup } from "./commands/cache";
import { setup as setupWorker } from "./bridge/worker-side";
import { setup as setupIf } from "./commands/if";

export { ShowNotification, NotificationAction, RemoveNotificationOptions } from "./commands/notification";
export { RunCommand } from "./interfaces/run-command";
export { sendClient as sendCommand } from "./bridge/client-side";

export function setup() {
    notificationSetup();
    clientSetup();
    registrationSetup();
    pushSetup();
    cacheSetup();
    setupWorker();
    setupIf();
}
