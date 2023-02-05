import { Entity } from "./Entity";
import { Component, Locked, ComponentClass } from "./Component";
import ECS from "./ECS";

export type SystemClass<T extends System> = new (...args: any[]) => T

/**
 * Run game logic code.
 */
export abstract class System<T = any> {
    // Define here the components used to track entities.
    public readonly abstract componentsRequired: Set<Function>;
    public readonly componentsExcluded: Set<Function> = new Set([Locked]);
    // Used to prioritize system execution.
    public readonly weight: number = 0;
    // If Yes, system will need at least one message to run in next update loop.
    public readonly filter: boolean = false;
    // If system is a debug systyem.
    public readonly debug = false;

    // List of entities implementing required components.
    protected entities = new Set<Entity>();
    
    // Message list.
    private messages: Array<any> = new Array(); 
    // Runtime Message list.
    private tmpMessages: Array<any> = new Array();
    private suspended = 0;
    private suspendedCallback: () => void = null;
    protected ecs: ECS;

    public setECS(ecs: ECS) {
        this.ecs = ecs;
    }

    public suspend(tick: number = -1, callback: () => void = null) {
        this.suspended = tick;
        if(callback) this.suspendedCallback = callback;
    }

    public enable() {
        this.suspended = 0;
        if(this.suspendedCallback) {
            this.suspendedCallback();
            this.suspendedCallback = null;
        }        
    }

    private isSuspended(): boolean {
        if (!this.suspended) return false;
        if (this.suspended > 0) {
            this.suspended--;
            return true;
        }
        else this.enable();
        return false;
    }

    public check(): boolean {
        if(this.isSuspended()) return false;
        if (this.filter && !this.messages.length) return false;
        this.tmpMessages = this.messages;
        this.messages = new Array();
        return true;
    }

    /**
     * Run at each game tick.
     */
    public abstract update(delta: number | boolean): void;


    /**
     * Optional custom callback on entity registration in the system.
     */
    public setEntity(entity: Entity): void { };
    public unsetEntity(entity: Entity): void { };

    /**
     * Register entity on system list if it checks requirements.
     * @param entity entity id
     */
    public registerEntity(entity: Entity): void {
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
    public removeEntity(entity: Entity): void {
        if (this.entities.has(entity)) {
            this.unsetEntity(entity);
            this.entities.delete(entity);
        }
    }

    public getMessages(): T[] {
        return this.tmpMessages;
    }

    public getMessage(): T {
        return this.tmpMessages.pop();
    }

    public addMessage(message: T = null): void {
        this.messages.push(message ? message : "true");
    };

    public hasAny() {
        return this.entities.size ? true : false;
    }
}