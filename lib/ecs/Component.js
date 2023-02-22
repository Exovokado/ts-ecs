"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deleted = exports.Locked = exports.Component = void 0;
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
//# sourceMappingURL=Component.js.map