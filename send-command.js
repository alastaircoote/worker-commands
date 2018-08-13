(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.sendcommand = {})));
}(this, (function (exports) { 'use strict';

var PAYLOAD_KEY = "__workerCommandPayload";
// We're not using async here so that our client lib is as small as possible when
// compiled to ES5
function sendClient(cmd) {
    return window.navigator.serviceWorker.ready.then(function (reg) {
        if (!reg.active) {
            throw new Error("Received a worker registration but it has no active worker");
        }
        var replyChannel = new MessageChannel();
        var replyPromise = new Promise(function (fulfill, reject) {
            replyChannel.port2.onmessage = function (e) {
                if (!e.data || !(e.data instanceof Array)) {
                    reject(new Error("Did not recognise response from worker command call"));
                }
                var _a = e.data, err = _a[0], response = _a[1];
                if (err) {
                    reject(new Error(err));
                }
                else {
                    fulfill(response);
                }
            };
        });
        var msg = {};
        msg[PAYLOAD_KEY] = cmd;
        reg.active.postMessage(msg, [replyChannel.port1]);
        return replyPromise;
    });
}

exports.PAYLOAD_KEY = PAYLOAD_KEY;
exports.sendClient = sendClient;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=send-command.js.map
