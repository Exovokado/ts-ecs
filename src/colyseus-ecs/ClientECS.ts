import { Deleted } from "../ecs/Component";
import { ComponentContainer } from "../ecs/Containers";
import ECS, { LogCallbacks } from "../ecs/ECS";
import { Entity } from "../ecs/Entity";
import { State, SyncComponentContainer } from "./Containers";

export class ClientECS extends ECS {
    public syncTable = new Map<Entity, Entity>();

    constructor(state: State, debug: boolean = false, log: LogCallbacks = {
        warn: (msg) => { console.log(msg) },
        debug: (msg) => { console.log(msg) },
        error: (msg) => { console.log(msg) }
    }) {
        super(debug, log);

        state.entities.forEach((components: SyncComponentContainer, entity_id: string) => {
            this.importEntity(components, entity_id);
        });
        state.entities.onAdd = (components: SyncComponentContainer, entity_id: string) => {
            this.importEntity(components, entity_id);
        };
        state.entities.onRemove = (components: SyncComponentContainer, entity_id: string) => {
            this.removeImportedEntity(entity_id);
        };
    }

    public importEntity(componentContainer: SyncComponentContainer, id: Entity) {
        const components = new ComponentContainer();
        for (const row of componentContainer.syncMap) {
            components.map.set(row[0], row[1]);
        }

        componentContainer.syncMap.onAdd = (component, key) => {
            components.map.set(key, component);
        };
        componentContainer.syncMap.onRemove = (component, key) => {
            components.map.delete(key);
        };

        let entity = this.addEntity();
        this.entities.set(entity, components);
        this.checkEntity(entity);
        this.syncTable.set(id, entity);
        return entity;
    }

    public removeImportedEntity(entity: Entity) {
        if (!this.syncTable.has(entity)) throw new Error("Synched entity does not exists.");
        const id = this.syncTable.get(entity);
        this.addComponent(id, new Deleted());
        this.entitiesToDestroy.add(id);
        this.syncTable.delete(id);
    }
}

