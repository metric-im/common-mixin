import Component from "./Component.mjs";

export default class PageFooter extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        let year = moment().format("YYYY");
        let version = this.props.context.version;
        this.element.innerHTML =
            `<span>&copy; Copyright ${year}</span>`+
            `<span class="version-label">version ${version}</span>`;
    }
}
