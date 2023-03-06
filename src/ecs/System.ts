import ECS from "./ECS";
import { Event, EventClass } from "./Event";

export type SystemClass<SystemInstance extends System> = new (...args: any[]) => SystemInstance

/**
 * Run game logic code.
 */
export abstract class System<Message = any> {
    // Used to prioritize system execution.
    public readonly weight: number = 0;
    // If Yes, system will need at least one message to run in next update loop.
    public readonly filter: boolean = false;
    // If system is a debug systyem.
    public debug: boolean = false;

    // Message list.
    private messages: Array<any> = new Array();
    // Runtime Message list.
    private tmpMessages: Array<any> = new Array();
    private suspended = 0;
    private suspendedCallback: () => void = null;

    public ecs: ECS;

    public suspend(tick: number = -1, callback: () => void = null) {
        this.suspended = tick;
        if (callback) this.suspendedCallback = callback;
    }

    public enable() {
        this.suspended = 0;
        if (this.suspendedCallback) {
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
        if (this.isSuspended()) return false;
        if (this.filter && !this.messages.length) return false;
        this.tmpMessages = this.messages;
        this.messages = new Array();
        return true;
    }

    public getMessages(): Message[] {
        return this.tmpMessages;
    }

    public getMessage(): Message {
        return this.tmpMessages.pop();
    }

    public addMessage(message: Message = null): void {
        if(this.debug) this.ecs.logger.debug(message)
        this.messages.push(message ? message : "true");
    };

    public onClear(): void { 
        this.getMessages();
        if(this.debug) this.ecs.logger.debug("Clearing " + this.constructor.name + " system");
    };

    public init(): void {
        if(this.debug) this.ecs.logger.debug("Adding new " + this.constructor.name + " system");
    }

    public abstract update(delta: number | boolean): void;

    public listen<E extends Event<any>>(event: EventClass<E>, callback: (data: E['type']) => void) {
        this.ecs.eventManager.get(event).listen(this, callback);
    }
    
}
