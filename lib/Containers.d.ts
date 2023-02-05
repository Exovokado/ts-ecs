import { Component } from "./Component";
/**
 * Structure holding all components of given entity, attach to by the ECS.
 */
export declare class ComponentContainer {
    map: Map<string, Component>;
}
