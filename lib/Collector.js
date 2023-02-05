"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const System_1 = require("./System");
class Collector extends System_1.System {
    constructor() {
        super(...arguments);
        this.changeOrUpdate = true;
        this.deleteMap = new Map();
    }
    setEntity(entity) {
        if (!this.map) {
            this.map = this.ecs.addEntity();
            this.ecs.addComponent(this.map, new this.mapComponent());
        }
        let key = this.print(entity);
        this.setRow(entity, key);
        const tracked = this.ecs.getComponent(entity, this.trackedComponent);
        const cb = () => {
            key = this.updateRow(entity, key, this.print(entity));
        };
        if (this.changeOrUpdate)
            tracked.changed = cb;
        else
            tracked.update = cb;
    }
    setRow(entity, key) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        let row = map.has(key) ? map.get(key) : new Set();
        row.add(entity);
        if (!map.has(key))
            map.set(key, row);
        this.deleteMap.set(entity, key);
    }
    updateRow(entity, from, to) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        let row = map.get(from);
        row.delete(entity);
        this.setRow(entity, to);
        this.deleteMap.set(entity, to);
        return to;
    }
    unsetEntity(entity) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        const row = map.get(this.deleteMap.get(entity));
        row.delete(entity);
        this.deleteMap.delete(entity);
    }
    has(key) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        return map.has(key);
    }
    get(key) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        return new Set(map.get(key));
    }
    update() { }
}
exports.Collector = Collector;
