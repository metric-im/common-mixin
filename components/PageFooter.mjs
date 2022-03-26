import Component from "./Component.mjs";
import MetricMorse from "./MetricMorse.mjs";

export default class PageFooter extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        let year = moment().format("YYYY");
        let version = this.props.context.version;
        this.element.innerHTML =
            `<span>&copy; Copyright ${year}, Metric Messenger, LLC</span>`+
            `<span class="version-label">version ${version}</span>`;
        let morse = document.createElement("div");
        morse.innerHTML = `<span>${MetricMorse.render("metric messenger llc",2.5)}</span>`;
        morse.style="position:absolute;bottom:-8px;left:300px;opacity:.25";
        this.element.append(morse);
    }
}
