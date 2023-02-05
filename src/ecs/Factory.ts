import ECS from "./ECS";
import { Entity } from "./Entity";

/**
 * Create an Entity with a pre defined set of components.
 */
export abstract class Factory {
    public ecs: ECS;
    /**
     * Generate entiy and register components.
     * @param args arguments given to the components.
     */
    public abstract create(args: any): Entity;
}

export type FactoryClass<T extends Factory> = new (...args: any[]) => T