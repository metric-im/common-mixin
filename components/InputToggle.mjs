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
            this.checkbox.classList.toggle('checked');
            this.props.data[this.props.name] = this.checkbox.classList.contains('checked');
            await this.announceUpdate(this.props.name);
        })
    }
}