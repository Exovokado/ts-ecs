"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
class SyncComponent extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.changed = () => { };
        this.update = () => { };
        this.isSync = true;
    }
}
exports.default = SyncComponent;
//# sourceMappingURL=Components.js.map