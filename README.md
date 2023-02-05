# ts-ecs
A small Entity-Component-System engine written in typescrit.

**Entity-Component Management**:

- Entities are unique strings
- Components class define how data is stored. 
- Game objects are set of components wich can be modified at runtime.

Most of the data pass through simple components. 
"Tagging" is also done with components. 

**Systems**: 

- Holds entity lists based on a set of required / excluded components class.
- Can run at each update or on message call from other systems, or both.
- Implements methods on entity adding / removal / change to allow custom mapping for further optimized queries
- Stystems marked as "Debug" needs an ECS with debug = true to run.

A "MapCollector" system is implemented to showcase simple mapping of a set of components. Up to you to implement here some structures like Btree ( or even a small database ? ) for optimized query management.

**Basic CRUD**:
```
class Position extends Component {
    x: number;
    y: number;
    constructor(args: {x: number, y: number} = {x: 0, y: 0}) {
        super();
        this.x = args.x;
        this.y = args.y;
    }
}

  let entity = ecs.addEntity();
  ecs.addComponent(entity, new Position({ x: 3, y: 2 }));
  ecs.updateComponent(entity, Position, { x: 4, y: 6 });
  const position = ecs.getComponent(entity, Position);
  ecs.removeComponent(entity, Position);
  ecs.removeEntity(entity);
```

See main test file for detailed examples. 
