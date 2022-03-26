import Component from "./Component.mjs";

export default class TabWidget extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        this.tabSet = this.div('tabSet');
        this.tabContent = this.div('tabContent')
        let index=0;
        for (let block of this.props.tabs) {
            let tab = this.div('tab',this.tabSet);
            tab.innerHTML = block.title;
            tab.setAttribute('index',index++);
            tab.addEventListener('click',this.setActive.bind(this));
        }
        this.select(this.props.selected || 0);
    }
    setActive(e) {
        this.select(e.target.getAttribute('index'));
    }
    select(index) {
        this.tabSet.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        this.tabContent.innerHTML="";
        this.tabContent.appendChild(this.props.tabs[index].element);
        this.tabSet.children[index].classList.add('selected');
    }
}
