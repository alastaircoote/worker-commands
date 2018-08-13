import { setup, registerCommand, fireCommand } from "../../";
setup();

self.addEventListener("install", function() {
    (self as any).skipWaiting();
});

self.addEventListener("activate", function(e) {
    (e as any).waitUntil((self as any).clients.claim());
});

registerCommand("test-command", function(opts: any) {
    return Promise.resolve(opts.value);
});

declare var NotificationEvent: any;

registerCommand("dispatch-notification-event", async function(opts: any) {
    let notifications: Notification[] = await (self as any).registration.getNotifications();

    let event = new NotificationEvent(opts.type, {
        notification: notifications[opts.index],
        action: opts.action
    });

    let evtName = opts.type === "notificationclick" ? "process-click" : "process-close";

    fireCommand(
        {
            command: "notification." + evtName
        },
        event
    );
});

registerCommand("test-notification-transform", opts => {
    return Promise.resolve(opts.value);
});
