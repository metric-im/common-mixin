/**
 *
 */
import Component from './Component.mjs';
import PageHeader from './PageHeader.mjs';
import PageFooter from './PageFooter.mjs';
import PageMenu from './PageMenu.mjs';
import PageBody from './PageBody.mjs';
import SignIn from './SignIn.mjs';
import API from "./API.mjs";
import {menu} from "./Manifest.mjs"

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.context = {};
        this.parsePath(window.location.href);
        window.addEventListener("hashchange",async (e)=>{
            this.parsePath(e.newURL);
            await this.body.update({context:this.context});
            await this.header.update({context:this.context});
        });
    }
    async render(element) {
        await super.render(element);
        this.context = Object.assign(this.context,await API.get("/session/context"));
        this.header = await this.new(PageHeader,{context:this.context,title:"Home"});
        this.header.render(this.element);
        let pageMain = this.div('page-main');
        await this.new(PageFooter,{context:this.context}).render(this.element);
        if (this.context.id) {
            await this.new(PageMenu,{context:this.context,menu:menu}).render(pageMain);
            this.body = this.new(PageBody,{context:this.context});
            await this.body.render(pageMain);
        } else {
            await this.new(SignIn).render(pageMain);
        }
        await Component.init(this.element);
    }
    parsePath(location='') {
        let hash = location.split('#')[1];
        if (!hash) {
            this.context.page = "Home";
            this.context.path = '';
        } else {
            let match = hash.match(/^([A-Za-z0-9-_]*)(.*)/);
            this.context.page = match[1];
            this.context.path = match[2];
        }
    }
}

