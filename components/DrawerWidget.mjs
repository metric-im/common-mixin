/**
 * Widget for organizing paged content through side tabs.
 * Drawers in props should contain a name, an optional title and an
 * instantiated component to render. Count is routed through the
 * url. eg /props.rootpath/props.drawers[index].name
 */
import Component from "./Component.mjs";

export default class DrawerWidget extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        this.drawerSet = this.div('drawerSet');
        this.drawerContent = this.div('drawerContent');
        let index=0;
        for (let block of this.props.drawers) {
            let drawer = this.div('drawer',this.drawerSet);
            drawer.innerHTML = block.title;
            drawer.setAttribute('path',block.path);
            drawer.addEventListener('click',(e)=>{
                window.location.href = this.props.rootPath+block.path;
            });
        }
        await this.select(this.props.context.path)
    }
    async select(path) {
        this.drawerSet.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        let index = this.props.drawers.findIndex(doc=>path.startsWith(doc.path));
        if (index<0) index = this.props.drawers.findIndex(doc=>doc.default===true);
        let drawer = this.props.drawers[index];
        let drawerTab = this.drawerSet.querySelector(`div:nth-child(${index+1})`);
        if (drawer.component) await drawer.component.render(this.drawerContent);
        drawerTab.classList.add('selected');
    }
}

