import { Component, ComponentClass } from "src/ecs/Component";
import ECS, { LogCallbacks } from "../ecs/ECS";
import { Entity } from "../ecs/Entity";
import { State, SyncComponentContainer } from "./Containers";
import SyncComponent from "./Components";



export default class ServerECS extends ECS {
    protected state: State;

    constructor(state: State, debug: boolean = false, log: LogCallbacks = {
        warn: (msg) => { console.log(msg) },
        debug: (msg) => { console.log(msg) },
        error: (msg) => { console.log(msg) }
    }) {
        super(debug);
        this.state = state;
    }

    protected destroyEntity(entity: Entity) {
        for (const system of this.systems) {
            system[1].removeEntity(entity)
        }
        this.entitiesToDestroy.delete(entity);
        this.entities.delete(entity.toString());
        if(this.state.entities.has(entity)) this.state.entities.delete(entity);
    }

    public addComponent(entity: Entity, component: Component): Component {
        const components = this.getComponents(entity);
        components.map.set(component.constructor.name, new Proxy(component, {
            set: (target: Component, p: keyof typeof target, newValue: any, receiver: any): boolean => {
                if(p === "isSync") return;
                const last = target[p];
                target[p] = newValue;
                if (last !== newValue && typeof target[p] !== "function") {
                    target.changed(p, newValue);
                }
                return true;
            }
        }));

        if(component.isSync) {
            if(!this.state.entities.has(entity))
            this.state.entities.set(entity, new SyncComponentContainer());
            this.state.entities.get(entity).syncMap.set(component.constructor.name, component as SyncComponent);
        }

        this.checkEntity(entity);
        return component;
    }

    public removeComponent<T extends Component>(entity: Entity, component: ComponentClass<T>): void {
        const components = this.getComponents(entity);
        if(components.map.get(component.name).isSync) {
            if(this.state.entities.has(entity))
            this.state.entities.get(entity).syncMap.delete(component.name);
        }
        components.map.delete(component.name);
        this.checkEntity(entity);
    }
}