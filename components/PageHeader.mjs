import Component from "./Component.mjs";
import API from "./API.mjs";

export default class PageHeader extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        let context = await API.get("/session/context");
        this.title = "Metric /";

        this.element.innerHTML =
        `<img id="logo" alt="Blender logo" src="/assets/logo8.png" onclick="document.location='/'" style="cursor:pointer">
        <div id="page-header-context">
            <h1>${this.props.context.id||'Metric Messenger'}</h1>
            <p id='header-path'>Metric /${this.props.page}</p>
        </div>
        <div class="session-control">
            <span style='font-size:.8em' class="icon icon-user"></span>
            <span id="userId">${this.props.context.userId}</span>
            <button id="signout" class="k-button">Sign Out</button>
        </div>`;
        let sessionControl = this.element.querySelector('.session-control');
        let signout = this.element.querySelector('#signout');
        signout.addEventListener("click",this.signout.bind(this));
        sessionControl.style.display=this.props.context.id?'block':'none';
    }
    async update(props) {
        this.props = props;
        let path = this.element.querySelector("#header-path");
        path.innerHTML=`Metric /${this.props.page}`
    }
    async signout() {
        await API.get('/session/logout');
        document.location.replace('/')
    }
}
