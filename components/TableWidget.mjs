import Component from "./Component.mjs";
import Text from "./Text.mjs";
import FireMacro from "./FireMacro.mjs";

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
            row.id = window.btoa(this.props.data[i][this.selector]);
            row._data = this.props.data[i];
            for (let col of this.props.columns) {
                let td = row.insertCell();
                if (col.style) td.style = col.style;
                let text = this.new(Text,{name:col.name,data:this.props.data[i],placeholder:col.placeholder||""})
                await text.render(td);
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
                this._select(tr.id);
            })
        }
        this.element.appendChild(this.table);
    }
    select(id) {
        this._select(window.btoa(id));
    }
    selectLast() {
        let last = this.props.data[this.props.data.length-1];
        this._select(window.btoa(last[this.selector]))
    }
    _select(id) {
        this.table.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        let tr = this.table.querySelector(`[id='${id}']`);
        if (!tr) return;
        tr.classList.add('selected');
        this.selected = tr;
        if (this.props.onSelect) this.props.onSelect(tr._data);
    }
}
