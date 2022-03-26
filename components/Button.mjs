import Component from './Component.mjs'

export class Button extends Component {
    constructor(props) {
        super(props)
    }
    async render(element) {
        await super.render(element);
        this.button = document.createElement('button');
        this.button.innerHTML = this.props.title;
        this.button.addEventListener('click',this.props.onClick);
        this.element.append(this.button);
    }
}
