import Component from './Component.mjs'

export class InputText extends Component {
    constructor(props) {
        super(props)
    }
    async render(element) {
        await super.render(element);
        if (!this.props.hideTitle) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.input = document.createElement("input");
        this.input.placeholder = this.props.placeholder || "Enter "+(this.props.title||this.props.name);
        this.input.value = this.props.data[this.props.name]||"";
        this.element.appendChild(this.input);
        this.element.addEventListener('input',async e=>{
            this.props.data[this.props.name] = e.target.value;
            await this.announceUpdate(this.props.name);
        });
    }
    async handleUpdate(attributeName) {
        await super.handleUpdate(attributeName);
        if (this.props.name === attributeName) {
            this.input.value = this.props.data[this.props.name];
        }
    }
    get value() {
        return this.input.value;
    }
    set value(val) {
        this.input.value = val;
    }
}
export class InputID extends InputText {
    constructor(props) {
        super(props);
        this.name = props.name || "_id";
    }
    async render(element) {
        await super.render(element);
        this.value = this.props.data[this.name] || "";
        if (this.props.data[this.name]) {
            this.input.readOnly="readonly";
        }
    }
}
export class InputPass extends InputText {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        this.input.type = "password"
    }
}