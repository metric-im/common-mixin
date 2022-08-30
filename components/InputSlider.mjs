import Component from './Component.mjs';

export class InputSlider extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        if (!this.props.hideTitle) {
            this.title = this.div("title");
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.input = document.createElement("input");
        this.input.setAttribute("type","range");
        this.value = this.props.data[this.props.name];
        this.element.append(this.input);
        if (this.props.values) {
            this.input.setAttribute("min",0);
            this.input.setAttribute("max",this.props.values.length-1);
            this.selectedText = this.div("value");
            this.selectedText.innerHTML = this.props.values[this.value];
        } else {
            this.input.setAttribute("min",this.props.min || 0);
            this.input.setAttribute("max",this.props.max || 10);
        }
        this.input.addEventListener('input',async (e)=>{
            if (this.selectedText) this.selectedText.innerHTML = this.props.values[this.value];
            await this.announceUpdate(this.props.name);
        })
    }
    get value() {
        return parseInt(this.input.value);
    }
    set value(val) {
        this.input.value = val;
    }
}