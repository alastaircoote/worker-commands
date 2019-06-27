import "./commands/cache";
import "./commands/custom-command";
import "./commands/notification";
import "./commands/client";
import "./commands/registration";
import "./commands/if";

function addRequestButton() {
    let button = document.createElement("button");
    button.innerHTML = "Start tests";
    button.onclick = async () => {
        await Notification.requestPermission();
        document.body.removeChild(button);
        runTests();
    };
    document.body.appendChild(button);
}

let runTests = async function() {
    let permission = (Notification as any).permission;

    if (permission !== "granted") {
        return addRequestButton();
    }

    console.info("Registering test worker...");
    await navigator.serviceWorker.register("./test-worker.js");
    mocha.run(async () => {
        console.info("Unregistering test worker...");
        let reg = await navigator.serviceWorker.register("./test-worker.js");
        if (reg) {
            reg.unregister();
        }
    });
};

runTests();
