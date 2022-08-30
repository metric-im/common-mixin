import Component from './Component.mjs'

export class InputText extends Component {
    constructor(props) {
        super(props)
        if (this.props.name) {
            let dot = this.props.name.split('.');
            if (dot.length > 1) {
                this.props.data = this.props.data[dot[0]];
                this.props.name = dot[1];
            }
        }
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
        if (this.props.options) {
            let datalist = document.createElement("datalist");
            datalist.id = this.props.name+"_datalist";
            for (let option of this.props.options) datalist.innerHTML+=`<OPTION>${option}</OPTION>`;
            this.element.appendChild(datalist);
            this.input.setAttribute("list",datalist.id);
        }
        this.element.appendChild(this.input);
        this.element.addEventListener('input',async e=>{
            this.props.data[this.props.name] = this.value;
            await this.announceUpdate(this.props.name);
            if (this.value !== this.originalValue) this.lock.add('exit');
            else this.lock.clear('exit');
        });
        this.lock.clear();
        this.originalValue = this.value;
    }
    async handleUpdate(attributeName) {
        await super.handleUpdate(attributeName);
        if (this.props.name === attributeName) {
            this.value = this.props.data[this.props.name];
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
        this.value = this.props.data[this.name]?this.props.data[this.name]||"":"";
        if (this.props.data[this.name] && ! this.props.allowEdit) {
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
export class InputNumber extends InputText {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        this.input.type = "number"
        this.element.addEventListener('input',async e=>{
            this.props.data[this.props.name] = Number(e.target.value);
            await this.announceUpdate(this.props.name);
        });
    }
    get value() {
        return Number(this.input.value);
    }
    set value(val) {
        this.input.value = val;
    }
}
export class InputTextArea extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        if (!this.props.hideTitle) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.input = document.createElement("textarea");
        this.input.setAttribute('rows','6');
        this.input.style.padding = 'var(--spacerhalf)';
        this.element.append(this.input);
    }
    async handleUpdate(attributeName) {
        await super.handleUpdate(attributeName);
        if (this.props.name === attributeName) {
            this.value = this.props.data[this.props.name];
        }
    }
    get value() {
        return this.input.value;
    }
    set value(val) {
        this.input.value = val;
    }
}