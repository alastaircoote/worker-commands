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
export declare type Transformable<T> = T | TransformCacheValue | TransformCommandValue;
export interface ShowNotification {
    title: Transformable<string>;
    badge?: Transformable<string>;
    icon?: Transformable<string>;
    image?: Transformable<string>;
    body: Transformable<string>;
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
