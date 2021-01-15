class GameOfLifeEngine {
    constructor (data) {
        this.selector = data.selector;
        this.DOM = null;
        this.memory = [[[]]];

        this.xAxis = null;
        this.yAxis = null;

        this.start = document.querySelector('.start');
        this.kill = document.querySelector('.kill');
        this.random = document.querySelector('.random');
        this.manual = document.querySelector('.manual')

        this.isRunning = false;

        this.init();
    }
    init() {
        this.isValidSelector();
        this.renderRandomField();
        this.onClick();
    }

    onClick() {
        this.start.onclick = () => {
            this.isRunning = true;
            let timer = 
                setInterval(() => {
                    this.renderField();
                    if (!this.isRunning) {
                        clearInterval(timer);
                        return;
                    }
                }, 500);
        }
        this.kill.onclick = () => {
            this.isRunning = false;
            return;
        }
        this.random.onclick = () => {
            this.renderRandomField();
            return;
        }
        this.manual.onclick = () => {
            console.log(this.memory[0]);
        }
    }

    isValidSelector() {
        this.DOM = document.querySelector(`${this.selector}`);
        return !this.DOM ? false : true;
    }

    renderRandomField() {
        if (!this.isValidSelector()) return;
        this.xAxis = +(document.querySelector('.xInput').value);
        this.yAxis = +(document.querySelector('.yInput').value);
        let HTML = `<div class="grid" style="grid-template-columns: repeat(${this.xAxis}, 1fr); grid-template-rows: repeat(${this.yAxis});">`;
        const fieldSize = this.xAxis * this.yAxis;
        for (let i = 0; i < fieldSize; i ++) {
            if (Math.random() < 0.225) {
                HTML += '<div class="spot full"></div>';
                this.memory[0][i] = true;
            } else {
                HTML += '<div class="spot"></div>';
                this.memory[0][i] = false;
            } 
        }
        HTML += `</div>`;
        this.DOM.innerHTML = HTML;
    }

    renderField() {
        console.log('render field');
    }
}

export { GameOfLifeEngine }