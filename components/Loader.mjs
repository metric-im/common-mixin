import Component from './Component.mjs';


export default class Loader extends Component {

    async render(element) {
        await super.render(element)
        this.loader = this.div('loader', this.content)
        const loaderImage = document.createElement('img')
        loaderImage.src = '/assets/loader.gif'
        loaderImage.style.width = '2rem'
        this.loader.append(loaderImage)
    }

    show() {
        this.loader.style.display = 'flex'
    }

    hide() {
        this.loader.style.display = 'none'
    }
}