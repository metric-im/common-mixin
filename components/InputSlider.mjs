import Component from './Component.mjs';

export class InputSlider extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        this.input = document.createElement("input");
        this.input.setAttribute("type","range");
        this.input.setAttribute("min",this.props.min || 0);
        this.input.setAttribute("max",this.props.max || 10);
        this.value = this.props.data[this.props.name]
        this.element.append(this.input);
    }
    get value() {
        return this.input.value;
    }
    set value(val) {
        this.input.value = val;
    }
}