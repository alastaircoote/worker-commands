import { sendCommand, registerCommand } from "../../../";
import { expect } from "chai";
import { waitForMessage } from "../wait-for-message";
import * as base64 from "base64-js";

async function getNotifications() {
    let reg = await navigator.serviceWorker.getRegistration();
    return reg!.getNotifications();
}

describe("Notifications", function() {
    afterEach(async () => {
        let notifications = await getNotifications();
        notifications.forEach(n => n.close());
        await self.caches.delete("test-cache");
    });

    it("can show a notification", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test"
            }
        });

        let notifications = await getNotifications();
        expect(notifications.length).to.equal(1);
        expect(notifications[0].body).to.equal("test");
    });

    it("can close a notification", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification"
            }
        });

        await sendCommand({
            command: "notification.close",
            options: {
                tag: "test-notification"
            }
        });

        let notifications = await getNotifications();
        expect(notifications.length).to.equal(0);
    });

    it("processes click events", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification",
                events: {
                    onclick: {
                        command: "client.post-message",
                        options: {
                            message: {
                                success: true
                            }
                        }
                    }
                }
            }
        });

        await sendCommand({
            command: "dispatch-notification-event",
            options: {
                index: 0,
                type: "notificationclick"
            }
        });

        let value = await waitForMessage();
        expect(value.success).to.equal(true);
    });

    it("processes click-action events", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification",
                actions: [
                    {
                        action: "testaction",
                        title: "test action"
                    }
                ],
                events: {
                    ontestaction: {
                        command: "client.post-message",
                        options: {
                            message: {
                                success: true
                            }
                        }
                    }
                }
            }
        });

        await sendCommand({
            command: "dispatch-notification-event",
            options: {
                index: 0,
                type: "notificationclick",
                action: "testaction"
            }
        });

        let value = await waitForMessage();
        expect(value.success).to.equal(true);
    });

    it("processes close events", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification",
                events: {
                    onclose: {
                        command: "client.post-message",
                        options: {
                            message: {
                                success: true
                            }
                        }
                    }
                }
            }
        });

        await sendCommand({
            command: "dispatch-notification-event",
            options: {
                index: 0,
                type: "notificationclose"
            }
        });

        let value = await waitForMessage();
        expect(value.success).to.equal(true);
    });

    it("processes command transforms for images, icons and badges", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                title: "test notification",
                body: "test",
                icon: {
                    from: "command",
                    command: "test-notification-transform",
                    options: {
                        value: "https://www.example.com/test-icon-value"
                    }
                },
                image: {
                    from: "command",
                    command: "test-notification-transform",
                    options: {
                        value: "https://www.example.com/test-image-value"
                    }
                },
                badge: {
                    from: "command",
                    command: "test-notification-transform",
                    options: {
                        value: "https://www.example.com/test-badge-value"
                    }
                }
            }
        });

        let reg = await navigator.serviceWorker.ready;
        let notifications: any[] = await reg.getNotifications();

        expect(notifications[0].icon).to.eq("https://www.example.com/test-icon-value");
        if ("image" in Notification.prototype) {
            expect(notifications[0].image).to.eq("https://www.example.com/test-image-value");
        } else {
            console.warn("No image functionality in Notification. Can't test it.");
        }
        expect(notifications[0].badge).to.eq("https://www.example.com/test-badge-value");
    });

    it("processes cache transforms for images, icons and badges", async () => {
        let testArray = new Uint8Array([1, 2, 3, 4]);
        let toCompare = "data:;base64," + base64.fromByteArray(testArray);
        let testResponse = new Response(testArray);
        let cache = await self.caches.open("test-cache");
        await cache.put("/test-response", testResponse);

        await sendCommand({
            command: "notification.show",
            options: {
                title: "test notification",
                body: "test",
                icon: {
                    from: "cache",
                    url: "/test-response"
                },
                image: {
                    from: "cache",
                    url: "/test-response"
                },
                badge: {
                    from: "cache",
                    url: "/test-response"
                }
            }
        });

        let reg = await navigator.serviceWorker.ready;
        let notifications: any[] = await reg.getNotifications();

        expect(notifications[0].icon).to.eq(toCompare);
        if ("image" in Notification.prototype) {
            expect(notifications[0].image).to.eq(toCompare);
        } else {
            console.warn("No image functionality in Notification. Can't test it.");
        }
        expect(notifications[0].badge).to.eq(toCompare);
    });
});
