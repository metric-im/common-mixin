import Component from "./Component.mjs";

export default class DataWall extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        let blocks = await this.mergeData();
        for (let block of blocks) {
            let frame = document.createElement('iframe');
            frame.src = block.src;
            frame.className = 'wallframe';
            if (typeof frame.grow === 'defined') element.style.flexGrow=frame.grow;
            this.element.appendChild(frame);
        }
    }
    async mergeData() {
        console.log('skipping macro');
        // let source = new FireMacro(this.props.blocks);
        // return await source.parse(this.props.data);
    }
}
