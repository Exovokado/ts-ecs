import { Component, ComponentClass } from "../ecs/Component";
import ECS, { LogCallbacks } from "../ecs/ECS";
import { Entity } from "../ecs/Entity";
import { State } from "./Containers";
export default class ServerECS extends ECS {
    protected state: State;
    constructor(state: State, debug?: boolean, log?: LogCallbacks);
    protected destroyEntity(entity: Entity): void;
    addComponent(entity: Entity, component: Component): Component;
    removeComponent<T extends Component>(entity: Entity, component: ComponentClass<T>): void;
}
