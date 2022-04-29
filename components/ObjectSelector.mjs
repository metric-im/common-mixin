/**
 * ObjectSelector displays the id and description of a collection
 * to select relationships.
 *
 * "path" must be provided in properties to direct the source
 * of available objects.
 */
import Component from './Component.mjs'
import WikiParser from "./WikiParser.mjs";
import API from "./API.mjs";
import Text from "./Text.mjs";

export default class ObjectSelector extends Component {
    constructor(props) {
        super(props)
    }
    async render(element) {
        await super.render(element);
        if (!this.objects || this.objects.length===0) await this.load();
        if (!this.props.hideTitle) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title || this.props.name;
        }
        this.table = document.createElement('table');
        if (!this.props.data[this.props.name]) this.props.data[this.props.name] = [];
        let source = this.props.data[this.props.name];

        for (let o of this.objects) {
            let row = this.table.insertRow();
            row.id = o._id;
            let idcell = row.insertCell();
            idcell.innerHTML = `${o._id}`;
            let descriptionCell = row.insertCell();
            descriptionCell.innerHTML = `${WikiParser.summarize(o.description||"")}`;
            if (source.includes(o._id)) row.classList.add("selected");
            row.addEventListener('click',(e)=>{
                let tr = e.target.closest('TR');
                tr.classList.toggle("selected");
                if (tr.classList.contains("selected")) source.push(tr.id);
                else source = source.filter(id=>id!==tr.id);
            })
        }
        this.element.appendChild(this.table);
    }
    async load() {
        this.objects = await API.get(this.props.path);
    }

}