"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ECS_1 = __importDefault(require("../ecs/ECS"));
const Containers_1 = require("./Containers");
class ServerECS extends ECS_1.default {
    constructor(state, debug = false, log = {
        warn: (msg) => { console.log(msg); },
        debug: (msg) => { console.log(msg); },
        error: (msg) => { console.log(msg); }
    }) {
        super(debug);
        this.state = state;
    }
    destroyEntity(entity) {
        for (const query of this.queries) {
            query[1].onRemove(entity);
            query[1].removeEntity(entity);
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
                this.state.entities.set(entity, new Containers_1.SyncComponentContainer());
            this.state.entities.get(entity).syncMap.set(component.constructor.name, component);
        }
        this.checkEntity(entity);
        return component;
    }
    removeComponent(entity, component) {
        const components = this.getComponents(entity);
        if (!components.map.get(component.name))
            throw new Error("Component " + component.name + " not present in entity " + entity + ".");
        if (components.map.get(component.name).isSync) {
            if (this.state.entities.has(entity))
                this.state.entities.get(entity).syncMap.delete(component.name);
        }
        components.map.delete(component.name);
        this.checkEntity(entity);
    }
}
exports.default = ServerECS;
//# sourceMappingURL=ServerECS.js.map