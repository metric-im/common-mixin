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
            return `<option ${selected?"selected":""} value="${opt.index}">${opt.name}</option>`
        });
        this.element.appendChild(this.input);
        this.element.addEventListener('change',async e=>{
            this.props.data[this.props.name] = this.options[e.target.value].value;
            await this.announceUpdate(this.props.name);
            if (this.value !== this.originalValue) this.lock.add('exit');
            else this.lock.clear('exit');
        });
        this.lock.clear();
        this.originalValue = this.value;
    }
    async handleUpdate(attributeName) {
        await super.handleUpdate(attributeName);
        if (this.props.name === attributeName) this.value = this.props.data[this.props.name];
    }

    /**
     * NOTE,
     * @returns {string}
     */
    get value() {
        return this.options[this.input.value].value;
    }
    set value(val) {
        let option = this.options.find(opt=>opt.value===val);
        if (option) this.input.value = option.index;
    }
}