/**
 * Structure holding entities data.
 */
export class Component {
    changed = () => { };
    update = () => { };
    isSync = false;
}
export class Locked extends Component {
}
export class Deleted extends Component {
}
//# sourceMappingURL=Component.js.map