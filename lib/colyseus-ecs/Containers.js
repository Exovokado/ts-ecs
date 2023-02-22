"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.SyncComponentContainer = void 0;
const schema_1 = require("@colyseus/schema");
const Components_1 = __importDefault(require("./Components"));
class SyncComponentContainer extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.syncMap = new schema_1.MapSchema();
    }
}
__decorate([
    (0, schema_1.type)({ map: Components_1.default })
], SyncComponentContainer.prototype, "syncMap", void 0);
exports.SyncComponentContainer = SyncComponentContainer;
class State extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.entities = new schema_1.MapSchema();
    }
}
__decorate([
    (0, schema_1.type)({ map: SyncComponentContainer })
], State.prototype, "entities", void 0);
exports.State = State;
//# sourceMappingURL=Containers.js.map