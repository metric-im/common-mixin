import Component from './Component.mjs';
import {InputText} from './InputText.mjs';
import {Button} from './Button.mjs';
/**
 * Inline table is for managing an array of objects is a collection entry.
 * Like other input components, it expects the data record and attribute name
 * passed as properties. Additionally, provide 'cols' which is an array of
 * objects that instructs the handling of each entry attribute. Name is
 * required, title and component are optional. If provided, component should
 * be a component class. InputText is the default.
 */
export default class InputInlineTable extends Component {
  constructor(props) {
    super(props);
  }
  async render(element) {
    await super.render(element);
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
    // create header row
    let headerRow = this.table.insertRow();
    headerRow.innerHTML = this.props.cols.map(cell=>`<th>${cell.title||cell.name}</th>`).join('\n');
    headerRow.innerHTML += "<th></th>"; // controls
    if (this.props.data[this.props.name]) {
      for (let entry of this.props.data[this.props.name]) {
        let row = this.table.insertRow();
        row.innerHTML = this.props.cols.map(cell=>`<td>${entry[cell.name]}</td>`).join('\n');
        let control = row.insertCell();
        let removeButton = new Button({icon:"circle-with-plus",onClick:this.removeRow.bind(this)});
        await removeButton.render(control);
      }
    }
    let newRow = this.table.insertRow();
    let newData = {};
    let components
    for (let cell of this.props.cols) {
      let td = newRow.insertCell();
      let component = new (cell.component||InputText)({name:cell.name,data:newData,hideTitle:true});
      td._component = component;
      await component.render(td);
    }
    let control = newRow.insertCell();
    let addButton = new Button({icon:"circle-with-plus",onClick:this.addRow.bind(this,newRow)});
    await addButton.render(control);
  }
  addRow(row) {
    let data = Array.from(row.cells).reduce((result,cell)=>{
      let component = cell._component;
      if (component) result[cell.name] = component.value;
    },{})
    this.table.insertRow(row);
  }
  removeRow(entry) {
    console.log(entry);
  }
  get value() {

  }
}