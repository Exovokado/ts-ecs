"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const Component_1 = require("./Component");
/**
 * Run game logic code.
 */
class System {
    constructor() {
        this.componentsExcluded = new Set([Component_1.Locked]);
        // Used to prioritize system execution.
        this.weight = 0;
        // If Yes, system will need at least one message to run in next update loop.
        this.filter = false;
        // If system is a debug systyem.
        this.debug = false;
        // List of entities implementing required components.
        this.entities = new Set();
        // Message list.
        this.messages = new Array();
        // Runtime Message list.
        this.tmpMessages = new Array();
        this.suspended = 0;
        this.suspendedCallback = null;
    }
    setECS(ecs) {
        this.ecs = ecs;
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
    /**
     * Optional custom callback on entity registration in the system.
     */
    setEntity(entity) { }
    ;
    unsetEntity(entity) { }
    ;
    /**
     * Register entity on system list if it checks requirements.
     * @param entity entity id
     */
    registerEntity(entity) {
        if (this.ecs.hasAllComponents(entity, this.componentsRequired) && !this.ecs.hasAnyComponents(entity, this.componentsExcluded)) {
            if (!this.entities.has(entity)) {
                this.entities.add(entity);
                this.setEntity(entity);
            }
        }
        else {
            this.removeEntity(entity);
        }
    }
    /**
     * Remove entity from system list.
     * @param entity entity id
     */
    removeEntity(entity) {
        if (this.entities.has(entity)) {
            this.unsetEntity(entity);
            this.entities.delete(entity);
        }
    }
    getMessages() {
        return this.tmpMessages;
    }
    getMessage() {
        return this.tmpMessages.pop();
    }
    addMessage(message = null) {
        this.messages.push(message ? message : "true");
    }
    ;
    hasAny() {
        return this.entities.size ? true : false;
    }
}
exports.System = System;
