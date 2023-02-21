var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Schema, MapSchema, type } from "@colyseus/schema";
import SyncComponent from "./Components";
export class SyncComponentContainer extends Schema {
    syncMap = new MapSchema();
}
__decorate([
    type({ map: SyncComponent })
], SyncComponentContainer.prototype, "syncMap", void 0);
export class State extends Schema {
    entities = new MapSchema();
}
__decorate([
    type({ map: SyncComponentContainer })
], State.prototype, "entities", void 0);
//# sourceMappingURL=Containers.js.map