import Component from "./Component.mjs";
import {Button} from "./Button.mjs";
import TableWidget from "./TableWidget.mjs";
import API from "./API.mjs";
import {InputText,InputID} from "./InputText.mjs";

export default class EditCollection extends Component {
  constructor(props,collection) {
    super(props);
    this.collection = collection
    this.items = [];
    this.item = null;
    this.hub = true;
  }
  async render(element) {
    await super.render(element);
    if (!this.items || this.items.length===0) await this.load();
    this.element.classList.add('content-element');
    this.content = this.div('page-content');
    this.controls = this.div('page-controls');
    this.btnSave = this.new(Button,{title:"save",icon:"save",onClick:this.save.bind(this)});
    await this.btnSave.render(this.controls);
    this.btnNew = this.new(Button,{title:"new",icon:"circle-with-plus",onClick:this.newItem.bind(this)});
    await this.btnNew.render(this.controls);
    this.btnRemove = this.new(Button,{title:"remove",icon:"trash",onClick:this.removeItem.bind(this)});
    await this.btnRemove.render(this.controls);
    this.table = this.new(TableWidget,{name:`${this.collection} List`,data:this.items,
      columns:this.columns,onSelect:this.selectItem.bind(this)});
    await this.table.render(this.content);

    // add property details
    this.details = this.div('properties',this.content);
    await this.renderProperties();
  }
  get columns() {
    return [
      {name:'_id',title:'Id',style:'width:25%',placeholder:'new '+this.collection},
      {name:'name',title:'Name',style:'width:25%'}
    ]
  }

  async renderProperties() {
    if (!this.item) {
      this.details.innerHTML = `<i>select ${this.collection}</a>`;
      return;
    } else this.details.innerHTML = "";

    let propertySet = this.div('property-set',this.details);
    this.inputId = await this.draw(InputID,{data:this.item,name:"_id",title:`New ${this.collection}`},propertySet);
    this.inputName = await this.draw(InputText,{data:this.item,name:"name",title:"Full Name"},propertySet);
    return propertySet;
  }
  async load() {
    this.items = await API.get('/data/'+this.collection);
    if (this.item) this.item = this.items.find(a=>a._id===this.item._id);
  }
  async selectItem(data) {
    if (await this.lock.test('exit')) {
      this.item = data;
      await this.renderProperties();
      this.lock.clear()
    }
  }
  async save() {
    try {
      if (await this.lock.test('save')) {
        await this._save();
        await this.render();
        window.toast.success('saved');
      }
    } catch(e) {
      window.toast.error(e.response?e.response.message:e);
    }
  }
  async _save() {
    try {
      if (await this.lock.test('save')) {
        this.scrub(this.item);
        await API.put(`/data/${this.collection}/${this.item._id}`,this.item);
        this.lock.clear();
        await this.load();
      }
    } catch(e) {
      window.toast.error(e.response?e.response.message:e);
    }
  }
  async newItem() {
    this.items.push({name:''});
    await this.update();
    await this.announceUpdate();
    this.table.selectLast();
  }
  async removeItem() {
    try {
      if (this.item) {
        if (await window.toast.prompt('Confirm delete of '+this.item._id)) {
          await API.remove(`/data/${this.collection}/${this.item._id}`, this.item);
          this.item = null;
          await this.load();
          await this.update();
        }
      }
    } catch(e) {
      console.log(e);
    }
  }
  async handleUpdate(attributeName) {
    await super.handleUpdate(attributeName);
    if (attributeName === 'homepage') await this.update();
  }
}
