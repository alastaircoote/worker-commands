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

    if (existing === true && ifStatement.then) {
        console.info("Client if statement passed, executing 'then' commands");
        return fireCommand(ifStatement.then, event);
    } else if (existing === false && ifStatement.else) {
        console.info("Client if statement failed, executing 'else' commands");
        return fireCommand(ifStatement.else, event);
    } else if (existing) {
        console.warn("Client if statement passed, but there are no 'then' commands");
    } else {
        console.warn("Client if statement failed, but there are no 'else' commands");
    }
}
export function setup() {
    registerCommand("if.client", ifClient);
}
