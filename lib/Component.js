"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapComponent = exports.Locked = exports.Component = void 0;
/**
 * Structure holding entities data.
 */
class Component {
    constructor() {
        this.changed = () => { };
        this.update = () => { };
        this.isSync = false;
    }
}
exports.Component = Component;
class Locked extends Component {
}
exports.Locked = Locked;
class MapComponent extends Component {
    constructor() {
        super(...arguments);
        this.map = new Map();
    }
}
exports.MapComponent = MapComponent;
