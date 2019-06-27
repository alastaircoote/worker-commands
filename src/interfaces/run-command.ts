export interface RunCommand<T> {
    command: string;
    options?: T;
}

export type RunCommandOrRunCommandArray<T> = RunCommand<T> | RunCommand<T>[];
