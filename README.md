# ts-ecs
A small Entity-Component-System engine written in typescript.

**Entity-Component Management**:

- Entities are unique strings
- Components class define how data is stored. 
- Game objects are set of components wich can be modified at runtime.

Most of the data pass through simple components. 

**Systems**: 

- Holds entity lists based on a set of required / excluded components class.
- Can run at each update or on message call (optionnaly providing more data) from other systems, or both.

**The Benefits**:

It's a fairly simple ecs. Seems to fit for a very small game. It has been build and used for a more complex TBS games with success.   
Also work with Colyseus js! use ServerECS and ClientECS instances, and "SyncComponent" instead of "Component" class to create a syncable component.

**Major Downsides**:

There is no dynamic query system implemented. 

Entity listing is done on entity creation / update / deletetion, and entity reference is duplicated in each system. This simple approch wont work in many cases, like with complex entities that have many components and relations. I'm working on moving lists directly into the "ecs" root object to avoid most duplicates. 

Also systems loops trough unordered entities lists. If you need a more suble approach, you can use "system.setEntity", "component.changed" and "system.unsetEntity" to implement a custom listing based on components values. 
 
**Basic CRUD**:

```typescript
class Position extends Component {
    x: number;
    y: number;
    constructor(args: {x: number, y: number} = {x: 0, y: 0}) {
        super();
        this.x = args.x;
        this.y = args.y;
    }
}

const entity = ecs.addEntity();
ecs.addComponent(entity, new Position({ x: 3, y: 2 }));
const position = ecs.getComponent(entity, Position);
position.x = 2;
ecs.removeComponent(entity, Position);
ecs.removeEntity(entity);
```

**Basic system**:
```typescript
export class Mover extends System {
    componentsRequired = new Set([Position]);
    weight = 0;
    filter = true; // Won't run if not called.
    debug = true; // Allow message and entities update logging.

    // Update loop.
    public update(): void {
        for (const entity of this.entities) {
            const position = this.ecs.getComponent(entity, Position);
            position.x++;
            position.y++;
            position.update();
            this.ecs.getSystem(Drawer).addMessage(entity);
        }
    }

    public setEntity(entity: string): void {
        // State tracking example. 
        const position = this.ecs.getComponent(entity, Position);
        position.changed = () => {
            if(this.isDefended(position)) this.ecs.addComponent(entity, new Defended());
            else this.ecs.removeComponent(entity, Defended);
        }
    }

    private isDefended (position: Position) {
        return position.x % 2 === 0 ? true : false;
    }
}
```
See test folder for detailed examples. 
