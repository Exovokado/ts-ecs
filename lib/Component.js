"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapComponent = exports.SingleMapComponent = exports.MapComponentBase = exports.Deleted = exports.Locked = exports.Component = void 0;
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
class Deleted extends Component {
}
exports.Deleted = Deleted;
class MapComponentBase extends Component {
}
exports.MapComponentBase = MapComponentBase;
class SingleMapComponent extends MapComponentBase {
    constructor() {
        super(...arguments);
        this.map = new Map();
    }
}
exports.SingleMapComponent = SingleMapComponent;
class MapComponent extends MapComponentBase {
    constructor() {
        super(...arguments);
        this.map = new Map();
    }
}
exports.MapComponent = MapComponent;
