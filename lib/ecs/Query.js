"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const Component_1 = require("./Component");
class Query {
    constructor() {
        this.componentsExcluded = new Set([Component_1.Locked]);
        this.entities = new Set();
        this.debug = false;
    }
    removeEntity(entity) {
        this.entities.delete(entity);
    }
    registerEntity(entity) {
        if (this.ecs.hasAllComponents(entity, this.componentsRequired) && !this.ecs.hasAnyComponents(entity, this.componentsExcluded)) {
            if (!this.entities.has(entity)) {
                this.entities.add(entity);
                this.onAdd(entity);
            }
        }
        else if (this.entities.has(entity)) {
            this.onRemove(entity);
            this.removeEntity(entity);
        }
    }
    init() {
        if (this.debug)
            this.ecs.logger.debug("Adding new " + this.constructor.name + " system");
    }
    get() {
        return this.entities.values();
    }
    hasAny() {
        return this.entities.size ? true : false;
    }
    getRand() {
        const k = Math.floor(Math.random() * this.entities.size);
        return [...this.entities][k];
    }
    has(entity) {
        return this.entities.has(entity) ? true : false;
    }
    onAdd(entity) {
        if (this.debug)
            this.ecs.logger.debug('Adding entity ' + entity + ' to ' + this.constructor.name);
    }
    onRemove(entity) {
        if (this.debug)
            this.ecs.logger.debug('Removing entity ' + entity + ' from ' + this.constructor.name);
    }
    onClear() {
        if (this.debug)
            this.ecs.logger.debug('Clearing ' + this.constructor.name);
    }
}
exports.Query = Query;
//# sourceMappingURL=Query.js.map