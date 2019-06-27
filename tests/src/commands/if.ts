import { sendCommand } from "../../../";
import { expect } from "chai";
import { waitForMessage } from "../wait-for-message";

describe("If", function() {
    describe("Client", function() {
        it("will process true", async function() {
            await sendCommand({
                command: "if.client",
                options: {
                    match: {
                        url: "/"
                    },
                    then: {
                        command: "client.post-message",
                        options: {
                            message: {
                                test: "true"
                            }
                        }
                    },
                    else: {
                        command: "client.post-message",
                        options: {
                            message: {
                                test: "false"
                            }
                        }
                    }
                }
            });

            let value = await waitForMessage();

            expect(value.test).to.equal("true");
        });

        it("will process false", async function() {
            await sendCommand({
                command: "if.client",
                options: {
                    match: {
                        url: "/fakeURL"
                    },
                    then: {
                        command: "client.post-message",
                        options: {
                            message: {
                                test: "true"
                            }
                        }
                    },
                    else: {
                        command: "client.post-message",
                        options: {
                            message: {
                                test: "false"
                            }
                        }
                    }
                }
            });

            let value = await waitForMessage();

            expect(value.test).to.equal("false");
        });
    });
});
