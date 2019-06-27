export interface RunCommand<T> {
    command: string;
    options?: T;
}
export declare type RunCommandOrRunCommandArray<T> = RunCommand<T> | RunCommand<T>[];
