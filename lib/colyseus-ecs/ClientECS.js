"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientECS = void 0;
const Component_1 = require("../ecs/Component");
const Containers_1 = require("../ecs/Containers");
const ECS_1 = __importDefault(require("../ecs/ECS"));
class ClientECS extends ECS_1.default {
    constructor() {
        super(...arguments);
        this.syncTable = new Map();
    }
    synch(state) {
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
    importEntity(componentContainer, id) {
        const components = new Containers_1.ComponentContainer();
        let done = [];
        for (const row of componentContainer.syncMap) {
            components.map.set(row[0], row[1]);
            done.push(row[1].constructor.name);
            row[1].changed = () => { };
            row[1].update = () => { };
            row[1].onChange = (changes) => {
                for (const change of changes) {
                    row[1].changed(change.field, change.value);
                }
                row[1].update();
            };
        }
        componentContainer.syncMap.onAdd = (component, key) => {
            if (done.includes(component.constructor.name))
                return;
            components.map.set(key, component);
            component.changed = () => { };
            component.update = () => { };
            component.onChange = (changes) => {
                for (const change of changes) {
                    component.changed(change.field, change.value);
                }
                component.update();
            };
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
    removeImportedEntity(entity) {
        if (!this.syncTable.has(entity))
            throw new Error("Synched entity does not exists.");
        const id = this.syncTable.get(entity);
        this.addComponent(id, new Component_1.Deleted());
        this.entitiesToDestroy.add(id);
        this.syncTable.delete(entity);
    }
}
exports.ClientECS = ClientECS;
//# sourceMappingURL=ClientECS.js.map