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
- Implements methods on entity adding / removal / change to allow custom mapping for further optimized queries

** The plus :**

Also work with Colyseus js! use ServerECS and ClientECS instances, and "SyncComponent" instead of "Component" class to create a syncable component.

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

See test folder for detailed examples. 
