!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.sendcommand={})}(this,function(e){"use strict";var n="__workerCommandPayload";e.PAYLOAD_KEY=n,e.sendClient=function(e){return window.navigator.serviceWorker.ready.then(function(r){if(!r.active)throw new Error("Received a worker registration but it has no active worker");var o=new MessageChannel,t=new Promise(function(e,n){o.port2.onmessage=function(r){r.data&&r.data instanceof Array||n(new Error("Did not recognise response from worker command call"));var o=r.data,t=o[0],a=o[1];t?n(new Error(t)):e(a)}}),a={};return a[n]=e,r.active.postMessage(a,[o.port1]),t})},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=send-command.js.map
