import { registerCommand } from "../command-registry";
import { RunCommandOrRunCommandArray } from "../interfaces/run-command";
import { fireCommand } from "../command-registry";

declare var self: ServiceWorkerGlobalScope;

interface IfOptions<Command, Options> {
    then?: RunCommandOrRunCommandArray<Command>;
    else?: RunCommandOrRunCommandArray<Command>;
    match: Options;
}

interface IfClientOptions {
    url: string;
    focused?: boolean;
    includeUncontrolled?: boolean;
}

async function ifClient<T>(ifStatement: IfOptions<T, IfClientOptions>, event?: NotificationEvent) {
    if (!ifStatement.match) {
        throw new Error("Must provide options to if statement");
    }
    const clients = await self.clients.matchAll({
        includeUncontrolled: ifStatement.match.includeUncontrolled || false,
        type: "window"
    });

    const check = new RegExp(ifStatement.match.url);

    const existing = clients.some(c => {
        if (check.exec(c.url) === null) {
            return false;
        }
        if (ifStatement.match.focused !== undefined) {
            return (c as WindowClient).focused === ifStatement.match.focused;
        }
        return true;
    });

    if (existing && ifStatement.then) {
        fireCommand(ifStatement.then, event);
    } else if (ifStatement.else) {
        fireCommand(ifStatement.else, event);
    }
}
export function setup() {
    console.log("setting up if");
    registerCommand("if.client", ifClient);
}
