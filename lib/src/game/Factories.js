"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerFactory = void 0;
const Components_1 = require("./Components");
const Factory_1 = require("../ecs/Factory");
class PlayerFactory extends Factory_1.Factory {
    create(args) {
        const entity = this.ecs.addEntity();
        this.ecs.addComponent(entity, new Components_1.Position());
        this.ecs.addComponent(entity, new Components_1.Secret());
        this.ecs.addComponent(entity, new Components_1.Player(args.sessionId));
        return entity;
    }
}
exports.PlayerFactory = PlayerFactory;
//# sourceMappingURL=Factories.js.map