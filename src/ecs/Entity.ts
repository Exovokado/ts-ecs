import { ComponentContainer } from "./Containers";

/**
 * Simple unique reference. Uniqueness ensured by ECS.
 */
export type Entity = string

export type Entities = Map<string, ComponentContainer>;
