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
            drawer.innerHTML = block.title||block.name;
            drawer.setAttribute('index',index++);
            drawer.setAttribute('name',block.name);
            drawer.addEventListener('click',this.setActive.bind(this));
        }
    }
    async setActive(e) {
        await this.select(e.target.getAttribute('name'));
    }
    async selectByIndex(index) {
        await this.select(this.props.drawers[index].name);
    }
    async select(name) {
        this.drawerSet.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        let drawerTab = this.drawerSet.querySelector(`[name=${name}]`);
        let drawer = this.props.drawers.find(row=>row.name === name);
        if (drawer) {
            this.drawerContent.innerHTML = ""
            if (drawer.component) await drawer.component.render(this.drawerContent);
            drawerTab.classList.add('selected');
        }
    }
}
