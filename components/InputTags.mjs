import Component from "./Component.mjs";
import {InputText} from "./InputText.mjs";
import {InputSelect} from "./InputSelect.mjs";
import API from './API.mjs';
import {Button} from "./Button.mjs";

export default class InputTags extends Component {
  constructor(props) {
    super(props);
  }
  async render(element) {
    await super.render(element);
    this.tags = this.props.data[this.props.name];

    if (!this.props.hideTitle) {
      this.title = this.div('form-element-title');
      this.title.innerHTML = this.props.title || this.props.name;
    }
    this.tray = this.div('tray');
    this.container = this.div('container',this.tray);
    for (let name of this.tags) {
      let tag = new Tag(this);
      await tag.render(name);
    }
    this.newTag = new Tag(this);
    await this.newTag.render();
  }
  async handleUpdate(attributeName) {
    await super.handleUpdate(attributeName);
    if (attributeName === this.props.name) await this.update();
  }
}
class Tag {
  constructor(parent) {
    this.parent = parent;
  }
  async render(name) {
    this.element = this.parent.div('tag-element',this.parent.container);
    this.tag = await this.parent.draw(InputText,{name:'tag',hideTitle:true},this.element);
    this.control = this.parent.div('tag-control',this.element);
    this.control.innerHTML=`<span class='icon icon-plus'></span>`;
    this.control.addEventListener('click',this.toggle.bind(this))
  }
  async toggle() {
    if (this.element.classList.contains('defined')) {
      this.element.remove();
    } else {
      if (!this.tag.value) {
        window.toast.warning('Please enter a tag name');
        return;
      }
      this.parent.tags.push(this.tag.value);
      this.element.classList.add('defined');
      this.control.innerHTML=`<span class='icon icon-minus'></span>`;
      this.parent.newTag = new Tag(this.parent);
      await this.parent.newTag.render();
    }
  }
}
