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
exports.Secret = exports.Player = exports.Position = void 0;
const Components_1 = __importDefault(require("../colyseus-ecs/Components"));
const schema_1 = require("@colyseus/schema");
const Component_1 = require("../ecs/Component");
class Position extends Components_1.default {
    constructor() {
        super(...arguments);
        this.x = 0;
        this.y = 0;
    }
}
__decorate([
    (0, schema_1.type)("number")
], Position.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)("number")
], Position.prototype, "y", void 0);
exports.Position = Position;
class Player extends Components_1.default {
    constructor(id) {
        super();
        this.id = id;
    }
}
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "id", void 0);
exports.Player = Player;
class Secret extends Component_1.Component {
    constructor() {
        super(...arguments);
        this.number = Math.floor(Math.random() * 10);
    }
}
exports.Secret = Secret;
//# sourceMappingURL=Components.js.map