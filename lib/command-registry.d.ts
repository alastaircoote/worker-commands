import { RunCommand } from "./interfaces/run-command";
export declare type CommandListener = (opts: any, event?: NotificationEvent) => void;
export declare type CommandFunction = (opts: any, event?: NotificationEvent) => Promise<any>;
export declare function registerCommand(name: string, command: CommandFunction): void;
export declare function unregisterCommand(name: string): void;
export declare function fireCommand<T>(command: RunCommand<T> | RunCommand<T>[], event?: NotificationEvent): Promise<any>;
export declare function addListener(name: string, listener: CommandListener): void;
export declare function removeListener(name: string, listener: CommandListener): void;
