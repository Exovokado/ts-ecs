
/**
 * Structure holding entities data.
 */
export abstract class Component {
    changed: (prop: string, value: any) => void = () => { };
    update: () => void = () => { };
    isSync: boolean = false;
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T

export class Locked extends Component { }
export class Deleted extends Component { }