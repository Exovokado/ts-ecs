"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
/**
 * Run game logic code.
 */
class System {
    constructor() {
        // Used to prioritize system execution.
        this.weight = 0;
        // If Yes, system will need at least one message to run in next update loop.
        this.filter = false;
        // If system is a debug systyem.
        this.debug = false;
        // Message list.
        this.messages = new Array();
        // Runtime Message list.
        this.tmpMessages = new Array();
        this.suspended = 0;
        this.suspendedCallback = null;
    }
    suspend(tick = -1, callback = null) {
        this.suspended = tick;
        if (callback)
            this.suspendedCallback = callback;
    }
    enable() {
        this.suspended = 0;
        if (this.suspendedCallback) {
            this.suspendedCallback();
            this.suspendedCallback = null;
        }
    }
    isSuspended() {
        if (!this.suspended)
            return false;
        if (this.suspended > 0) {
            this.suspended--;
            if (!this.suspended)
                this.enable();
            return true;
        }
        else
            this.enable();
        return false;
    }
    check() {
        if (this.isSuspended())
            return false;
        if (this.filter && !this.messages.length)
            return false;
        this.tmpMessages = this.messages;
        this.messages = new Array();
        return true;
    }
    getMessages() {
        return this.tmpMessages;
    }
    getMessage() {
        return this.tmpMessages.pop();
    }
    addMessage(message = null) {
        if (this.debug)
            this.ecs.logger.debug(message);
        this.messages.push(message ? message : "true");
    }
    ;
    onClear() {
        this.getMessages();
        if (this.debug)
            this.ecs.logger.debug("Clearing " + this.constructor.name + " system");
    }
    ;
    init() {
        if (this.debug)
            this.ecs.logger.debug("Adding new " + this.constructor.name + " system");
    }
    listen(event, callback) {
        this.ecs.eventManager.get(event).listen(this.constructor.name, callback);
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map