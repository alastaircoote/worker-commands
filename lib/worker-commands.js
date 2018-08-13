(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['worker-commands'] = {})));
}(this, (function (exports) { 'use strict';

var storedCommands = {};
var listeners = {};
// Add a command to the internal registry. This is used by the library itself
// but also exposed so that you can register custom commands in an individual project.
function registerCommand(name, command) {
    if (storedCommands[name]) {
        throw new Error("Cannot add command '" + name + "', it already exists.");
    }
    storedCommands[name] = command;
}
function fireIndividualCommand(runCmd, event) {
    var command = runCmd.command, options = runCmd.options;
    if (!storedCommands[command]) {
        throw new Error("No such command '" + command + "'");
    }
    if (listeners[command]) {
        listeners[command].forEach(function (l) { return l(options, event); });
    }
    return storedCommands[command](options, event);
}
function fireCommand(command, event) {
    if (command instanceof Array) {
        return Promise.all(command.map(function (c) { return fireIndividualCommand(c, event); }));
    }
    return fireIndividualCommand(command, event);
}
function addListener(name, listener) {
    if (!listeners[name]) {
        listeners[name] = new Set();
    }
    listeners[name].add(listener);
}
function removeListener(name, listener) {
    if (!listeners[name]) {
        return;
    }
    listeners[name].delete(listener);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function transformOption(value) {
    return __awaiter(this, void 0, void 0, function () {
        var match, arrayBuffer_1, base64URL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!value || typeof value === "string") {
                        // it isn't a calculated value
                        return [2 /*return*/, value];
                    }
                    if (!(value.from === "command")) return [3 /*break*/, 2];
                    return [4 /*yield*/, fireCommand({
                            command: value.command,
                            options: value.options
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(value.from === "cache")) return [3 /*break*/, 6];
                    return [4 /*yield*/, caches.match(value.url)];
                case 3:
                    match = _a.sent();
                    if (!match) {
                        // If we don't have an entry in the cache we just try to use the remote
                        // URL instead. But log a warning, as this isn't intended behaviour.
                        console.warn("Notification tried to use " + value + ", but no cache entry present");
                        return [2 /*return*/, value.url];
                    }
                    return [4 /*yield*/, match.arrayBuffer()];
                case 4:
                    arrayBuffer_1 = _a.sent();
                    return [4 /*yield*/, new Promise(function (fulfill, reject) {
                            var reader = new FileReader();
                            reader.onerror = reject;
                            reader.onload = function (e) { return fulfill(reader.result); };
                            reader.readAsDataURL(new Blob([arrayBuffer_1]));
                        })];
                case 5:
                    base64URL = _a.sent();
                    // and then set the value on our notification options:
                    return [2 /*return*/, base64URL];
                case 6: throw new Error("Didn't understand object transform");
            }
        });
    });
}
function showNotification(options) {
    return __awaiter(this, void 0, void 0, function () {
        var title, events, icon, badge, image, nonTitleOptions, _a, transformedIcon, transformedBadge, transformedImage, finalOptions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!options.title || !options.body) {
                        throw new Error("Notification must, at at a minimum, provide title and body.");
                    }
                    title = options.title, events = options.events, icon = options.icon, badge = options.badge, image = options.image, nonTitleOptions = __rest(options, ["title", "events", "icon", "badge", "image"]);
                    return [4 /*yield*/, Promise.all([
                            transformOption(icon),
                            transformOption(badge),
                            transformOption(image)
                        ])];
                case 1:
                    _a = _b.sent(), transformedIcon = _a[0], transformedBadge = _a[1], transformedImage = _a[2];
                    finalOptions = Object.assign({}, nonTitleOptions, {
                        icon: transformedIcon,
                        image: transformedImage,
                        badge: transformedBadge
                    });
                    finalOptions.data = Object.assign(finalOptions.data || {}, {
                        // We add this so that when we're looking at notificationclick etc. events
                        // we can check whether this is a notification generated by this library
                        // or not.
                        __workerCommandNotification: true,
                        __events: events
                    });
                    return [4 /*yield*/, self.registration.showNotification(title, finalOptions)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function removeNotifications(removeOptions, event) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, currentNotifications;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = removeOptions ? removeOptions.tag : undefined;
                    if (!tag && event) {
                        event.notification.close();
                    }
                    else if (!tag) {
                        throw new Error("Must provide a notificationevent or tag to remove notification");
                    }
                    return [4 /*yield*/, self.registration.getNotifications({ tag: tag })];
                case 1:
                    currentNotifications = _a.sent();
                    currentNotifications.forEach(function (n) {
                        if (checkIfLibraryNotification(n) === true) {
                            n.close();
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function processNotificationClick(empty, e) {
    return __awaiter(this, void 0, void 0, function () {
        var notification, eventName, targetEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!e) {
                        throw new Error("Cannot process notification click without also sending event");
                    }
                    notification = e.notification;
                    if (checkIfLibraryNotification(notification) === false) {
                        // This notification was not generated by our library, so ignore it.
                        return [2 /*return*/];
                    }
                    if (!notification.data.__events) {
                        // This notification does not have any event listeners.
                        console.warn("Notification received a click event but has no events attached.");
                        return [2 /*return*/];
                    }
                    eventName = "click";
                    if (e.action) {
                        eventName = e.action;
                    }
                    targetEvent = notification.data.__events["on" + eventName];
                    if (!targetEvent) {
                        console.error("Notification received on" + eventName + " event, but no listener was attached");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fireCommand(targetEvent, e)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function processNotificationClose(empty, e) {
    return __awaiter(this, void 0, void 0, function () {
        var notification;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!e) {
                        throw new Error("Cannot process notification click without also sending event");
                    }
                    notification = e.notification;
                    if (checkIfLibraryNotification(notification) === false) {
                        // This notification was not generated by our library, so ignore it.
                        return [2 /*return*/];
                    }
                    if (!notification.data.__events || !notification.data.__events.onclose) {
                        // Only 'info' level here because it isn't necessarily a mistake.
                        console.info("Notification received a close event with no events attached.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fireCommand(notification.data.__events.onclose, e)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkIfLibraryNotification(notification) {
    // We don't want to mess with any notifications not sent through this
    // library - so we can do this simple check:
    return notification.data && notification.data.__workerCommandNotification === true;
}
function setup() {
    registerCommand("notification.show", showNotification);
    registerCommand("notification.close", removeNotifications);
    registerCommand("notification.process-click", processNotificationClick);
    registerCommand("notification.process-close", processNotificationClose);
    // We have these set up as specific commands so that we can attach listeners
    // for things like analytics later on.
    self.addEventListener("notificationclick", function (e) {
        e.waitUntil(fireCommand({ command: "notification.process-click" }, e));
    });
    self.addEventListener("notificationclose", function (e) {
        e.waitUntil(fireCommand({ command: "notification.process-close" }, e));
    });
}

function filterURL(url, options) {
    var editable = new URL(url);
    if (options.ignoreQuery === true) {
        editable.search = "";
    }
    if (options.ignoreHash === true) {
        editable.hash = "";
    }
    return editable.href;
}
function getExistingWindow(url, options) {
    return __awaiter(this, void 0, void 0, function () {
        var clients, urlToSearch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.clients.matchAll({
                        includeUncontrolled: true
                    })];
                case 1:
                    clients = _a.sent();
                    urlToSearch = filterURL(url, options);
                    return [2 /*return*/, clients.find(function (c) { return filterURL(c.url, options) === url && c instanceof WindowClient; })];
            }
        });
    });
}
function focusWindow(options) {
    return __awaiter(this, void 0, void 0, function () {
        var allClients, firstClient, absoluteURL, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!options || !options.url)) return [3 /*break*/, 3];
                    return [4 /*yield*/, self.clients.matchAll()];
                case 1:
                    allClients = _a.sent();
                    firstClient = allClients.find(function (c) { return c instanceof WindowClient; });
                    if (!firstClient) {
                        throw new Error("Tried to focus, but there were no client windows");
                    }
                    return [4 /*yield*/, firstClient.focus()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    absoluteURL = new URL(options.url, self.location.href).href;
                    return [4 /*yield*/, getExistingWindow(absoluteURL, options)];
                case 4:
                    match = _a.sent();
                    if (!match) return [3 /*break*/, 6];
                    return [4 /*yield*/, match.focus()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 6:
                    if (!(options.openIfNotExisting === true)) return [3 /*break*/, 8];
                    return [4 /*yield*/, self.clients.openWindow(absoluteURL)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    console.error("Tried to focus a window that didn't exist! " + absoluteURL);
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function openWindow(options) {
    return __awaiter(this, void 0, void 0, function () {
        var absoluteURL, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    absoluteURL = new URL(options.url, self.location.href).href;
                    if (!!options.focusIfExisting) return [3 /*break*/, 2];
                    return [4 /*yield*/, self.clients.openWindow(options.url)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2: return [4 /*yield*/, getExistingWindow(absoluteURL, options)];
                case 3:
                    match = _a.sent();
                    if (!match) return [3 /*break*/, 5];
                    return [4 /*yield*/, match.focus()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, self.clients.openWindow(options.url)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function postMessage(options) {
    return __awaiter(this, void 0, void 0, function () {
        var allClients;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.clients.matchAll()];
                case 1:
                    allClients = _a.sent();
                    if (options.url) {
                        allClients = allClients.filter(function (c) { return c.url === options.url; });
                    }
                    allClients.forEach(function (c) { return c.postMessage(options.message); });
                    return [2 /*return*/];
            }
        });
    });
}
function setup$1() {
    registerCommand("client.focus", focusWindow);
    registerCommand("client.open", openWindow);
    registerCommand("client.post-message", postMessage);
}

function update() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.registration.update()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function unregister() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, self.registration.unregister()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setup$2() {
    registerCommand("registration.update", update);
    registerCommand("registration.unregister", unregister);
}

function handlePush(e) {
    return __awaiter(this, void 0, void 0, function () {
        var json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!e.data) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, e.data.json()];
                case 1:
                    json = _a.sent();
                    if (!(json.data && json.data.payload)) return [3 /*break*/, 2];
                    // This is specific to pushkin and how Firebase Cloud Messaging sends payloads.
                    // Maybe we can standardise this at some point.
                    json = JSON.parse(json.data.payload);
                    return [3 /*break*/, 4];
                case 2:
                    if (!(json.notification && json.data && json.data.__isWorkerCommandPayload)) return [3 /*break*/, 4];
                    console.info("Received Firebase notification payload");
                    return [4 /*yield*/, fireCommand({
                            command: "notification.show",
                            options: json.notification
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    if (!json.__workerCommandPayload) {
                        return [2 /*return*/];
                    }
                    console.info("Received push payload", json.__workerCommandPayload);
                    return [4 /*yield*/, fireCommand(json.__workerCommandPayload)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setup$3() {
    self.addEventListener("push", function (e) {
        e.waitUntil(handlePush(e));
    });
}

function cacheAdd(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!opts) {
                        throw new Error("Options not provided");
                    }
                    if (!opts.cacheName) {
                        throw new Error("Cache name not provided");
                    }
                    if (!opts.urls) {
                        throw new Error("Cache URLs not provided");
                    }
                    return [4 /*yield*/, caches.open(opts.cacheName)];
                case 1:
                    cache = _a.sent();
                    return [2 /*return*/, cache.addAll(opts.urls)];
            }
        });
    });
}
function cacheDelete(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var cache, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!opts) {
                        throw new Error("Options not provided");
                    }
                    if (opts.urls && opts.deleteWholeCache === true) {
                        throw new Error("Cannot specify both urls and deleteWholeCache options");
                    }
                    if (!opts.cacheName) {
                        throw new Error("Cache name not provided");
                    }
                    if (opts.deleteWholeCache === true) {
                        return [2 /*return*/, caches.delete(opts.cacheName)];
                    }
                    else if (!opts.urls) {
                        throw new Error("Must provide URLs if not using deleteWholeCache");
                    }
                    return [4 /*yield*/, caches.open(opts.cacheName)];
                case 1:
                    cache = _a.sent();
                    promises = opts.urls.map(function (url) { return cache.delete(url); });
                    return [2 /*return*/, Promise.all(promises)];
            }
        });
    });
}
function setup$4() {
    registerCommand("cache.add", cacheAdd);
    registerCommand("cache.delete", cacheDelete);
}

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

function setup$5() {
    var _this = this;
    self.addEventListener("message", function (event) { return __awaiter(_this, void 0, void 0, function () {
        var e, returnPort, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e = event;
                    if (!e.data || !e.data[PAYLOAD_KEY]) {
                        return [2 /*return*/];
                    }
                    returnPort = e.ports[0];
                    if (!returnPort) {
                        throw new Error("Send worker command payload with no reply port");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fireCommand(e.data[PAYLOAD_KEY])];
                case 2:
                    result = _a.sent();
                    returnPort.postMessage([null, result]);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    returnPort.postMessage([err_1.message, null]);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}

function setup$6() {
    setup();
    setup$1();
    setup$2();
    setup$3();
    setup$4();
    setup$5();
}

exports.setup = setup$6;
exports.fireCommand = fireCommand;
exports.registerCommand = registerCommand;
exports.addListener = addListener;
exports.removeListener = removeListener;
exports.sendCommand = sendClient;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=worker-commands.js.map
