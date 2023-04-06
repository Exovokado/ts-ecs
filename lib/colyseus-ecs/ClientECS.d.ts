import ECS from "../ecs/ECS";
import { Entity } from "../ecs/Entity";
import { State, SyncComponentContainer } from "./Containers";
export declare class ClientECS extends ECS {
    syncTable: Map<string, string>;
    synch(state: State): void;
    importEntity(componentContainer: SyncComponentContainer, id: Entity): string;
    removeImportedEntity(entity: Entity): void;
}
