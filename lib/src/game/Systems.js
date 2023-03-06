"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mover = void 0;
const Components_1 = require("./Components");
const System_1 = require("../ecs/System");
const material_1 = require("../../tests/material");
class Mover extends System_1.System {
    constructor() {
        super(...arguments);
        this.filter = true;
    }
    update(delta) {
        const msg = this.getMessage();
        for (const entity of this.ecs.query(material_1.PositionQuery)) {
            const player = this.ecs.getComponent(entity, Components_1.Player);
            if (player.id === msg.playerId) {
                const position = this.ecs.getComponent(entity, Components_1.Position);
                if (msg.x !== 0)
                    position.x += msg.x * 10;
                if (msg.y !== 0)
                    position.y += msg.y * 10;
            }
        }
    }
}
exports.Mover = Mover;
//# sourceMappingURL=Systems.js.map