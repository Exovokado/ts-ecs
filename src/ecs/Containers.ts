import { Component } from "./Component";
/**
 * Structure holding all components of given entity, attach to by the ECS.
 */
export class ComponentContainer /* extends Schema */ {
    public map = new Map<string, Component>();
}