/**
 * InputSelect is a standard option list. Props must include
 * an array of possible values. If the option value is a string
 * the value and displayed name are the same. If the option is
 * an object it should declare both name and value attributes.
 */
import Component from './Component.mjs'

export class InputSelect extends Component {
    constructor(props) {
        super(props)
        this.options = props.options.map((opt,index)=>{
            if (typeof opt === "string") opt = {name:opt,value:opt}
            if (!opt.type) opt.type = typeof opt.value;
            opt.index = index;
            return opt;
        })
    }
    async render(element) {
        await super.render(element);
        if (!this.props.hideTitle) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.input = document.createElement("select");
        this.input.innerHTML = this.options.map(opt=>{
            let selected = (opt.value===this.props.data[this.props.name]);
            return `<option ${selected?"selected":""} value="${opt.value}">${opt.name}</option>`
        });
        this.input.value = this.options.findIndex(item=>item.value===this.props.data[this.props.name]);
        this.element.appendChild(this.input);
        this.element.addEventListener('change',async e=>{
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
        return this.options[parseInt(this.input.value)].value;
    }
    set value(val) {
        this.input.value = this.options.findIndex(item=>item.value===val);
    }
}