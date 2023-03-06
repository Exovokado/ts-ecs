import ECS, { LogCallbacks } from "../ecs/ECS";
import { Entity } from "../ecs/Entity";
import { State, SyncComponentContainer } from "./Containers";
export declare class ClientECS extends ECS {
    syncTable: Map<string, string>;
    constructor(state: State, debug?: boolean, log?: LogCallbacks);
    importEntity(componentContainer: SyncComponentContainer, id: Entity): string;
    removeImportedEntity(entity: Entity): void;
}
