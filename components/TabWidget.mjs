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
            await block.component.render(this.tabContent);
            block.component.element.classList.add('contentComponent');
        }
        this.select(this.props.selected || 0);
    }
    setActive(e) {
        this.select(parseInt(e.target.getAttribute('index')));
    }
    select(index) {
        this.tabSet.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        this.tabContent.querySelectorAll('.selected').forEach(item=>item.classList.remove('selected'));
        let tab;
        if (typeof index === 'undefined') {
            tab = this.tabSet.querySelector(`:not(.hidden)`);
        } else {
            tab = this.tabSet.children[index];
            if (tab && tab.classList.contains('hidden')) tab = null;
        }
        if (tab) {
            tab.classList.add('selected');
            this.tabContent.children[index].classList.add('selected');
        }
    }

    hideTab() {
        let tabNames = Array.from(arguments);
        for (let tab of this.tabSet.children) {
            if (tabNames.includes(tab.innerHTML)) tab.classList.add('hidden');
        }
        this.select(0);
    }
    showTab() {
        let tabNames = Array.from(arguments);
        for (let tab of this.tabSet.children) {
            if (tabNames.includes(tab.innerHTML)) tab.classList.remove('hidden');
        }
        this.select(0);
    }
}
