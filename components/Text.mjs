import Component from './Component.mjs';
import Identifier from '/lib/identifier';

export default class Text extends Component {
    constructor(props) {
        super(props);
        this.element = document.createElement('span');
        this.element.id = Identifier.new;
    }
    async render(element) {
        await super.render(element);
        this.element.innerHTML = this.value;
    }
    get value() {
        let placeholder = this.props.placeholder || "";
        return this.props.data[this.props.name] || `<i style='color:var(--text-quiet)'>${placeholder}</>`;
    }

    async handleUpdate(attributeName) {
        this.element.innerHTML = this.value;
    }
}