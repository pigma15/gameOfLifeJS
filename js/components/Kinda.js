class GameOfLifeEngine {
    constructor (data) {
        this.selector = data.selector;
        this.DOM = null;
        this.spotsDOMs = null;
        this.memory = [];

        this.xAxis = +(document.querySelector('.xInput').value);
        this.yAxis = +(document.querySelector('.yInput').value);

        this.start = document.querySelector('.start');
        this.kill = document.querySelector('.kill');
        this.random = document.querySelector('.random');
        this.manual = document.querySelector('.manual');

        this.isRunning = false;
        this.iteration = 0;

        this.init();
    }
    init() {
        this.isValidDOM();
        this.generateEmptyField();
        this.clickSpot();
        this.transport();
    }

    isValidDOM() {
        this.DOM = document.querySelector(this.selector);
        return this.DOM !== null ? true : false;
    }

    generateEmptyField() {
        if (!this.isValidDOM() || this.isRunning) return;
        this.iteration = 0;
        let HTML = `<div class="grid" style="grid-template-columns: repeat(${this.xAxis}, 1fr); grid-template-rows: repeat(${this.yAxis}, 1fr);">`;
        let field = [];
        let fieldSize = this.xAxis * this.yAxis;
        for (let i = 0; i < fieldSize; i++) {
            HTML += '<div class="spot"></div>';
            field.push(false);
        }
        this.memory[0] = field;
        HTML += `</div>`;
        this.DOM.innerHTML = HTML;
        this.spotsDOMs = document.querySelectorAll('.spot');
        return;
    }

    clickSpot() {
        for (let i = 0; i < this.spotsDOMs.length; i++) {
            const spot = this.spotsDOMs[i];
            const field = this.memory[0];
            spot.addEventListener('click', () => {
                if (this.isRunning) return;
                field[i] ? field[i] = false : field[i] = true;
                spot.classList.toggle('full');
            });
        }
    }

    transport() {
        this.start.onclick = () => {
            this.isRunning = true;
            let timer = 
            setInterval(() => {
                console.log(this.memory);
                if (!this.isRunning) {
                    clearInterval(timer);
                    this.memory[0] = this.memory[this.iteration];
                    this.iteration = 0;
                    return;
                }
                this.iteration++;
                this.run();
            }, 500)
        }
        this.kill.onclick = () => {
            this.isRunning = false;
            return;
        }
    }

    run() {
        let field = [];
        const fieldSize = this.xAxis * this.yAxis;
        for (let i = 0; i < fieldSize; i++) {
            const spot = this.spotsDOMs[i];
            let check = this.memory[this.iteration - 1];
            let checkNeigh = 0;
            if (i - this.xAxis > -1) {
                if (i % this.xAxis > 0) {
                    if (check[i - this.xAxis - 1]) checkNeigh++;
                }
                if (i % this.xAxis < this.xAxis - 1) {
                    if (check[i - this.xAxis + 1]) checkNeigh++;
                }
                if (check[i - this.xAxis]) checkNeigh++;
            }
            if (i + this.xAxis < fieldSize) {
                if (i % this.xAxis > 0) {
                    if (check[i + this.xAxis - 1]) checkNeigh++;
                }
                if (i % this.xAxis < this.xAxis - 1) {
                    if (check[i + this.xAxis + 1]) checkNeigh++;
                }
                if (check[i + this.xAxis]) checkNeigh++;
            }
            if (i % this.xAxis > 0) {
                if (check[i - 1]) checkNeigh++;
            }
            if (i % this.xAxis < this.xAxis - 1) {
                if (check[i + 1]) checkNeigh++;
            }
            if (check[i]) {
                (checkNeigh === 2 || checkNeigh === 3) ? (field.push(true), spot.classList.add('full')) : (field.push(false), spot.classList.remove('full'));
            } else {
                checkNeigh === 3 ? (field.push(true), spot.classList.add('full')) : (field.push(false), spot.classList.remove('full'));
            }
        }
        this.memory[this.iteration] = field;
    }

}

export { GameOfLifeEngine }