import Component from "./Component.mjs";

export default class CodeBlock extends Component {
    constructor(props) {
        super(props);
    }
    async render(element) {
        await super.render(element);
        await this.installAce();
        if (this.props.title) {
            this.title = this.div('form-element-title');
            this.title.innerHTML = this.props.title;
        }
        this.code = this.div('code');
        this.editor=window.ace.edit(this.code.id);
        this.mode = this.props.interpreter || this.props.data.interpreter || 'plain_text';
        this.editor.setTheme('ace/theme/'+(this.props.theme || 'twilight'));
        this.editor.$blockScrolling = "Infinity";
        this.editor.renderer.setShowGutter(false);
        this.editor.session.setUseWrapMode(true);
        this.editor.setOptions({
            maxLines: "Infinity",
            minLines: 10,
            fontSize: "12pt"
        });
        this.value = this.props.data[this.props.name];
        this.element.addEventListener('change',()=>{
            this.props.data[this.props.name] = this.editor.getValue();
        })
    }
    async handleUpdate(attributeName) {
        await super.handleUpdate(attributeName);
        if (attributeName === 'derived' || attributeName === 'interpreter') {
            await this.update();
        } else if (this.props.name === attributeName) {
            this.editor.setValue(this.props.data[this.props.name]);
        }
    }
    get value() {
        return this.editor.getValue();
    }
    set value(_value) {
        return this.editor.setValue(_value||"");
    }
    set mode(_mode) {
        this.editor.getSession().setMode('ace/mode/'+_mode.toLowerCase());
    }

    async installAce() {
        if (typeof window.ace === "undefined") {
            let aceScript = window.document.createElement('script');
            aceScript.src = '/lib/ace/ace.js';
            window.document.body.append(aceScript);
            return new Promise((resolve,reject)=>{
                aceScript.addEventListener("load",()=>{
                    resolve();
                });
            });
        }
    }
}