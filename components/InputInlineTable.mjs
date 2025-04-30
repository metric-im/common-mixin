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
          const input = cell.querySelector('input') || cell.querySelector('select')
          if (input) this.initValidator(input, {
            name: col.name,
            required: col.required ?? false,
            pattern: col.pattern,
            message: col.message || 'Enter correct value.',
            ignoreValidation: col.ignoreValidation ?? false,
          })
        }
        let control = row.insertCell()
        await this.draw(Button,{icon:"circle-with-minus",onClick:this.removeRow.bind(this,i++)},control);
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
        const input = e.target
        if (e.key === "Enter" && this.isValidInput(input)) {
          this.addRow();
        }
      })
      cell.addEventListener('focusout',async (e)=>{

        const input = e.target

        if (this.isValidInput(input)) {
          await this.addRow()
        }

        await this.switchRowBtn()

      })
      await component.render(cell);
      const input = cell.querySelector('input') || cell.querySelector('select')
      if (input) this.initValidator(input, {
        name: col.name,
        required: col.required ?? false,
        pattern: col.pattern,
        message: col.message || 'Enter correct value.',
        isNew: true,
        ignoreValidation: col.ignoreValidation ?? false
      })
    }
    let control = this.newRow.insertCell()
    this.newRowBtn = await this.draw(Button,{icon:"circle-with-plus",onClick:this.checkAndAddRow.bind(this)},control);
    this.newRowBtn.toAdd = true
  }

  async checkAndAddRow() {
    let isValid = true
    for (const cell of Array.from(this.newRow.cells)) {
      const input = cell.querySelector('input') || cell.querySelector('select')
      if (input && !this.isValidInput(input, false)) {
        isValid = false
        this.noticeInputErrors(input, false)
      }
    }
    if (isValid) await this.addRow()
    else window.toast.error('Please correct errors.')
  }

  async addRow(showMessage = true) {
    if (!this.isValidNewRow()) {
      if (showMessage) window.toast.error('Please correct errors.')
      return;
    };
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
    return this.data
  }

  initValidator(input, options) {
    if (options.pattern) input.pattern = options.pattern
    if (options.message) input.dataset.message = options.message
    if (options.isNew) input.dataset.isNew = true
    input.required = options.required
    input.dataset.ignoreValidation = options.ignoreValidation
    input.name = options.name

    if (this.makeBool(input.dataset.ignoreValidation)) input.addEventListener('focusout', async (e) => this.noticeInputWarnings(input, input.dataset.isNew))
    else input.addEventListener('focusout', async (e) => {
      console.log(input)
      this.noticeInputErrors(input, this.makeBool(input.dataset.isNew))
    })
  }

  isValidRows() {
    let isValid = true
    for (const row of Array.from(this.table.rows)) {
      for (const cell of Array.from(row.cells)) {
        const input = cell.querySelector('input') || cell.querySelector('select')
        if (input && !this.isValidInput(input, this.makeBool(input.dataset.isNew))) {
          this.noticeInputErrors(input, this.makeBool(input.dataset.isNew))
          isValid = false
        } else if (input && this.makeBool(input.dataset.ignoreValidation)) {
          this.noticeInputWarnings(input, this.makeBool(input.dataset.isNew))
        }
      }
    }
    return isValid
  }

  isValidNewRow() {
    let isValid = true
    for (const cell of Array.from(this.newRow.cells)) {
      const input = cell.querySelector('input') || cell.querySelector('select')
      if (input && !this.isValidInput(input, true)) {
        this.noticeInputErrors(input, true)
        isValid = false
      } else if (input && this.makeBool(input.dataset.ignoreValidation)) {
        this.noticeInputWarnings(input, true)
      }
    }
    return isValid
  }

  isValidInput(input, ignoreRequired = false) {
    if (this.makeBool(input.dataset.ignoreValidation)) return true
    if (ignoreRequired && !input.value || input.value == '0') return true;
    if (input.required && !input.value || input.value == '0') return false
    if (input.pattern && !input.checkValidity()) return false
    return true
  }

  getInputErrors(input, ignoreRequired = false) {
    const errors = []
    if (ignoreRequired && !input.value || input.value == '0') return errors;

    if (input.required && !input.value || input.value == '0') {
      errors.push(`The field ${input.name} is required.`)
    }

    if (input.value && input.pattern && !input.checkValidity()) {
      errors.push(input.dataset.message)
    }

    return errors

  }

  noticeInputErrors(input, ignoreRequired = false) {
    input.parentElement.querySelectorAll('.invalid-message').forEach(el => el.remove())
    input.classList.remove('invalid')

    const errors = this.getInputErrors(input, ignoreRequired)
    console.log(errors)

    if (errors.length > 0) {
      input.classList.add('invalid')
      errors.forEach(err => {
        const div = document.createElement('div')
        div.classList.add('invalid-message')
        div.innerText = err
        input.parentElement.appendChild(div)
        input.addEventListener('mouseleave',async (e)=>{
          this.noticeInputErrors(input, this.makeBool(input.dataset.isNew));
        })
      })
    }
  }

  noticeInputWarnings(input, ignoreRequired = false) {
    input.parentElement.querySelectorAll('.invalid-warning-message').forEach(el => el.remove())
    input.classList.remove('invalid-warning')

    const errors = this.getInputErrors(input, ignoreRequired)

    if (errors.length > 0) {
      input.classList.add('invalid-warning')
      errors.forEach(err => {
        const div = document.createElement('div')
        div.classList.add('invalid-warning-message')
        div.innerText = err
        input.parentElement.appendChild(div)
        input.addEventListener('mouseleave', async (e) => {
          this.noticeInputWarnings(input, this.makeBool(input.dataset.isNew));
        })
      })
    }
  }

  async switchRowBtn() {
    let isEmpty = true
    for (const cell of this.newRow.cells) {
      const _input = cell.querySelector('input') || cell.querySelector('select')
      if (_input && _input.value && _input.value != '0' && !['range'].includes(_input.type) && _input.name !== '_id') {
        isEmpty = false
        break
      }
    }
    if (isEmpty) {
      this.newRowBtn.props.icon = 'circle-with-plus'
      this.newRowBtn.props.onClick = this.checkAndAddRow.bind(this)
      this.newRowBtn.toAdd = true
    } else if (this.newRowBtn.toAdd) {
      this.newRowBtn.props.icon = 'circle-with-minus'
      this.newRowBtn.props.onClick = () => {
        for (const cell of this.newRow.cells) {
          const _input = cell.querySelector('input') || cell.querySelector('select')
          if (_input && _input.value && _input.value != '0' && !['range'].includes(_input.type) && _input.name !== '_id') {
            _input.value = null
            this.noticeInputErrors(_input, true)
            this.noticeInputWarnings(_input, true)
          }
        }
        this.switchRowBtn()
      }
      this.newRowBtn.toAdd = false
    }

    await this.newRowBtn.render()
  }

  get data() {
    return Array.from(this.table.rows).reduce((result, row) => {
      const item = Array.from(row.cells).reduce((_result, cell) => {
        let component = cell._component;
        if (component) _result[component.props.name] = component.value;
        return _result;
      }, {})
      return [...result, item]
    }, [])
  }

  makeBool(val) {
    return ['true', 'True', 1, '1', true].includes(val)
  }

}
