import ECS from "../ecs/ECS";
import { SyncComponentContainer } from "./Containers";
export default class ServerECS extends ECS {
    state;
    constructor(state, debug = false, log = {
        warn: (msg) => { console.log(msg); },
        debug: (msg) => { console.log(msg); },
        error: (msg) => { console.log(msg); }
    }) {
        super(debug);
        this.state = state;
    }
    destroyEntity(entity) {
        for (const system of this.systems) {
            system[1].removeEntity(entity);
        }
        this.entitiesToDestroy.delete(entity);
        this.entities.delete(entity.toString());
        if (this.state.entities.has(entity))
            this.state.entities.delete(entity);
    }
    addComponent(entity, component) {
        const components = this.getComponents(entity);
        components.map.set(component.constructor.name, new Proxy(component, {
            set: (target, p, newValue, receiver) => {
                if (p === "isSync")
                    return;
                const last = target[p];
                target[p] = newValue;
                if (last !== newValue && typeof target[p] !== "function") {
                    target.changed(p, newValue);
                }
                return true;
            }
        }));
        if (component.isSync) {
            if (!this.state.entities.has(entity))
                this.state.entities.set(entity, new SyncComponentContainer());
            this.state.entities.get(entity).syncMap.set(component.constructor.name, component);
        }
        this.checkEntity(entity);
        return component;
    }
    removeComponent(entity, component) {
        const components = this.getComponents(entity);
        if (components.map.get(component.name).isSync) {
            if (this.state.entities.has(entity))
                this.state.entities.get(entity).syncMap.delete(component.name);
        }
        components.map.delete(component.name);
        this.checkEntity(entity);
    }
}
//# sourceMappingURL=ServerECS.js.map