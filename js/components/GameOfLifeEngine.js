class GameOfLifeEngine {
    constructor (data) {
        this.selector = data.selector;
        this.DOM = null;
        this.xAxis = data.xAxis;
        this.yAxis = data.yAxis;

        this.init();
    }
    init() {
        this.isValidSelector();
        this.renderField();
    }

    isValidSelector() {
        if (this.selector === '' || this.selector === undefined) {
            console.warn('Wrong selector');
            return;
        }
        this.DOM = document.querySelector('#field');
    }

    renderField() {
        let HTML = `<div class="grid">`;
        const fieldSize = this.xAxis * this.yAxis;
        for (let i = 0; i < fieldSize; i ++) {
            Math.random() < 0.225 ? HTML += '<div class="spot full"></div>' : HTML += '<div class="spot"></div>';
        }
        HTML += `</div>`;
        this.DOM.innerHTML = HTML;



    }
}

export { GameOfLifeEngine }