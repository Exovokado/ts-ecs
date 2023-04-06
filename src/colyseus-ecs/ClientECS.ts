import { Deleted } from "../ecs/Component";
import { ComponentContainer } from "../ecs/Containers";
import ECS from "../ecs/ECS";
import { Entity } from "../ecs/Entity";
import { State, SyncComponentContainer } from "./Containers";

export class ClientECS extends ECS {
    public syncTable = new Map<Entity, Entity>();

    public synch(state: State): void {
        state.entities.forEach((components, entity_id) => {
            this.importEntity(components, entity_id);
        });
        state.entities.onAdd = (components, entity_id) => {
            this.importEntity(components, entity_id);
        };
        state.entities.onRemove = (components, entity_id) => {
            this.removeImportedEntity(entity_id);
        };
    }

    public importEntity(componentContainer: SyncComponentContainer, id: Entity) {
        const components = new ComponentContainer();
        let done = [];

        for (const row of componentContainer.syncMap) {
            components.map.set(row[0], row[1]);
            done.push(row[1].constructor.name)
            row[1].changed = () => {}
            row[1].update = () => {}
            row[1].onChange = (changes) => {
                for (const change of changes) {
                    row[1].changed(change.field, change.value);
                }
                row[1].update();
            }
        }

        componentContainer.syncMap.onAdd = (component, key) => {
            if(done.includes(component.constructor.name)) return;
            components.map.set(key, component);
            component.changed = () => {}
            component.update = () => {}
            component.onChange = (changes) => {
                for (const change of changes) {
                    component.changed(change.field, change.value);
                }
                component.update();
            }
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
        this.syncTable.delete(entity);
    }
}

