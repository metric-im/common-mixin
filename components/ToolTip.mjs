import Component from './Component.mjs';

export default class ToolTip extends Component {
  constructor(props) {
    super(props);
  }
  async render(element) {
    await super.render(element);
    this.element.innerHTML = this.props.text;
  }
}
