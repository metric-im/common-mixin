import Component from './Component.mjs';
import {InputText} from './InputText.mjs';
import {Button} from './Button.mjs';
import ToolTip from "./ToolTip.mjs";

/**
 * Inline table is for managing an array of objects in a collection entry.
 * Like other input components, it expects the data record and attribute name
 * passed as properties. Additionally, provide 'cols' which is an array of
 * objects that instructs the handling of each entry attribute. Name is
 * required, title and component are optional. If provided, component should
 * be a component class. InputText is the default.
 */
export default class InputInlineTable extends Component {
  constructor(props) {
    super(props);
    if (!this.props.data[this.props.name]) this.props.data[this.props.name] = [];
  }
  async render(element) {
    await super.render(element);
    if (this.props.title) {
      let title = this.div('attribute-title')
      title.innerHTML = this.props.title;
    }
    if (this.props.tip) {
      await this.draw(ToolTip,{text:this.props.tip},this.element);
    }
    // as default set columns to name value of data attribute
    if (!this.props.cols) {
      this.props.cols = Object.keys(this.props.data[this.props.data.name]).map(key=>{
        return {name:key,title:key.charAt(0).toUpperCase() + key.slice(1)}
      })
    }
    this.table = document.createElement('table');
    this.element.append(this.table);
    await this.updateTable();
  }
  async updateTable() {
    this.table.innerHTML = "";
    if (!this.props.noHeader) {
      let headerRow = this.table.insertRow();

      headerRow.innerHTML = this.props.cols.map(col=>`<th style="${col.style}">${col.title||col.name}</th>`).join('\n');
    }
    if (this.props.data[this.props.name]) {
      let i = 0;
      for (let entry of this.props.data[this.props.name]) {
        let row = this.table.insertRow();
        for (let col of this.props.cols) {
          let cell = row.insertCell();
          if (col.style) cell.style = col.style;
          let component = new (col.component||InputText)({name:col.name,data:entry,hideTitle:true});
          component.element.classList='quiet'
          cell._component = component;
          await component.render(cell);
        }
        await this.draw(Button,{icon:"circle-with-minus",onClick:this.removeRow.bind(this,i++)},row);
      }
    }
    let newData = {};
    this.newRow = this.table.insertRow();
    for (let col of this.props.cols) {
      let cell = this.newRow.insertCell();
      if (col.style) cell.style = col.style;
      let component = new (col.component||InputText)({name:col.name,data:newData,hideTitle:true});
      cell._component = component;
      cell.addEventListener('keypress',(e)=>{
        if (e.key === "Enter") {
          this.addRow();
        }
      })
      await component.render(cell);
    }
    await this.draw(Button,{icon:"circle-with-plus",onClick:this.addRow.bind(this)},this.newRow);
  }
  async addRow() {
    let data = Array.from(this.newRow.cells).reduce((result,cell)=>{
      let component = cell._component;
      if (component) result[component.props.name] = component.value;
      return result;
    },{})
    if (!this.props.data[this.props.name]) this.props.data[this.props.name] = [];
    this.props.data[this.props.name].push(data);
    await this.updateTable();
  }
  async removeRow(entry) {
    this.props.data[this.props.name].splice(entry,1)
    await this.updateTable();
  }
  get value() {

  }
}
