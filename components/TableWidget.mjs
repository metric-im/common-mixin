import Component from "./Component.mjs";
import Text from "./Text.mjs";
import FireMacro from "/lib/firemacro";

// Unicode-safe base64 for use as an opaque DOM row id. Plain btoa() throws on characters
// outside Latin1 (e.g. emojis or en-dashes in Meta entity names), so encode to UTF-8 first.
function toRowId(v) {
    const s = String(v ?? '');
    return window.btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16))));
}

export default class TableWidget extends Component {
    constructor(props) {
        super(props);
        this.selector = this.props.selector || '_id';
        this.selected = null;
    }
    async render(element) {
        await super.render(element);
        this.table = document.createElement('table');
        this.header = this.table.insertRow();
        for (let col of this.props.columns) {
            this.header.innerHTML+=`<th style="${col.style}">${col.title||col.name}</th>`
        }
        for (let i = 0;i < this.props.data.length;i++) {
            let row = this.table.insertRow();
            row.id = toRowId(this.props.data[i][this.selector]);
            row._data = this.props.data[i];
            for (let col of this.props.columns) {
                let td = row.insertCell();
                if (col.style) td.style = col.style;
                if (col.component) {
                    let comp = this.new(col.component,{name:col.name,data:this.props.data[i],placeholder:col.placeholder||""})
                    await comp.render(td);
                } else {
                    let text = this.new(Text,{name:col.name,data:this.props.data[i],placeholder:col.placeholder||""})
                    await text.render(td);
                }

                if (col.icon) {
                    let style = 'vertical-align:top;margin-right:6px;height16px;width:16px'; // size should be variable
                    let fm = new FireMacro(col.icon);
                    let src = await fm.parse(this.props.data[i]);
                    td.innerHTML = `<img style=${style} src='${src}'>`+td.innerHTML;
                    td.querySelector('img').onerror = (event) => {
                        event.target.style.visibility = 'hidden';
                    }
                }
            }
            row.addEventListener('click',(e)=>{
                let tr = e.target.closest('TR');
                this._selectRow(tr);
            })
        }
        this.element.appendChild(this.table);
    }
    select(id) {
        this._select(toRowId(id));
    }
    selectLast() {
        let rows = this.table.rows;
        if (rows.length > 1) this._selectRow(rows[rows.length-1]);
    }
    _select(id) {
        this._selectRow(this.table.querySelector(`[id='${id}']`));
    }
    _selectRow(tr) {
        this.table.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        if (!tr || !tr._data) return;
        tr.classList.add('selected');
        this.selected = tr;
        if (this.props.onSelect) this.props.onSelect(tr._data);
    }
}
