import { RunCommand } from "../interfaces/run-command";
export interface NotificationAction {
    action: string;
    title: string;
}
export interface TransformCacheValue {
    from: "cache";
    url: string;
}
export interface TransformCommandValue {
    from: "command";
    command: string;
    options: any;
}
export interface ShowNotification {
    title: string;
    badge?: string | TransformCacheValue | TransformCommandValue;
    icon?: string | TransformCacheValue | TransformCommandValue;
    image?: string | TransformCacheValue | TransformCommandValue;
    body: string;
    data?: any;
    tag?: string;
    actions?: NotificationAction[];
    events?: {
        [name: string]: RunCommand<any> | RunCommand<any>[];
    };
}
export interface RemoveNotificationOptions {
    tag?: string;
}
export declare function setup(): void;
