import Component from "./Component.mjs";

export class InputToggle extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        if (!this.props.hideTitle) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.checkbox = this.div('checkbox');
        this.checkbox.innerHTML = "<span class='icon icon-check'></span>"
        if (this.props.data[this.props.name]) this.checkbox.classList.add('checked');
        this.checkbox.addEventListener('click',async ()=>{
            this.value = !this.value;
            this.props.data[this.props.name] = this.value;
            await this.announceUpdate(this.props.name);
            if (this.value !== this.originalValue) this.lock.add('exit');
            else this.lock.clear('exit');
        })
        this.originalValue = this.value;
    }
    get value() {
        return this.checkbox.classList.contains('checked')
    }
    set value(val) {
        if (val) this.checkbox.classList.add('checked')
        else this.checkbox.classList.remove('checked')
    }
}