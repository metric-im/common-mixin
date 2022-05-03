import Component from './Component.mjs';

export class InputDate extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        if (!this.props.hideTitle) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.input = document.createElement("input");
        this.input.setAttribute('type','date');
        if (this.props.data[this.props.name]) {
            this.input.value = moment(this.props.data[this.props.name]).format("YYYY-MM-DD");
        }
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

export class InputSystemDate extends InputDate {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        this.input.readOnly="readonly";
    }
}

export class InputModifiedDate extends InputSystemDate {
    constructor(props) {
        super(props);
        this.props.name = '_modified';
        this.props.title = "Last Modified";
    }
    async render(element) {
        await super.render(element);
        this.input.readOnly="readonly";
    }
}