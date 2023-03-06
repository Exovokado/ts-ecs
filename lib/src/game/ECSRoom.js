"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECSRoom = void 0;
const colyseus_1 = require("colyseus");
const Factories_1 = require("./Factories");
const Systems_1 = require("./Systems");
const ServerECS_1 = __importDefault(require("../colyseus-ecs/ServerECS"));
const Containers_1 = require("../colyseus-ecs/Containers");
const material_1 = require("../../tests/material");
class ECSRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.players = new Map();
    }
    onCreate(options) {
        const state = new Containers_1.State();
        this.setState(state);
        this.ecs = new ServerECS_1.default(state, true);
        this.ecs.addQuery(new material_1.PositionQuery());
        this.ecs.addSystem(new Systems_1.Mover());
        this.ecs.addFactory(new Factories_1.PlayerFactory);
        this.onMessage("move", (client, message) => {
            this.ecs.getSystem(Systems_1.Mover).addMessage({
                playerId: client.sessionId,
                x: message.x !== undefined ? message === null || message === void 0 ? void 0 : message.x : 0,
                y: message.y !== undefined ? message === null || message === void 0 ? void 0 : message.y : 0
            });
            this.ecs.update();
        });
    }
    onJoin(client, options) {
        this.ecs.logger.debug(client.sessionId + "joined!");
        this.players.set(client.sessionId, this.ecs.getFactory(Factories_1.PlayerFactory).create({ sessionId: client.sessionId }));
    }
    onLeave(client, consented) {
        this.ecs.logger.debug(client.sessionId + " left!");
        this.ecs.removeEntity(this.players.get(client.sessionId));
        this.ecs.update();
    }
    onDispose() {
        this.ecs.logger.debug("room " + this.roomId + " disposing...");
    }
}
exports.ECSRoom = ECSRoom;
//# sourceMappingURL=ECSRoom.js.map