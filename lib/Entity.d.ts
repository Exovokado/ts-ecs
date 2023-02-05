import { ComponentContainer } from "./Containers";
/**
 * Simple unique reference. Uniqueness ensured by ECS.
 */
export declare type Entity = string;
export declare type Entities = Map<string, ComponentContainer>;
