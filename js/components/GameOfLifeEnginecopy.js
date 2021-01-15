class GameOfLifeEngine {
    constructor (data) {
        this.selector = data.selector;
        this.DOM = null;
        this.memory = [];

        this.xAxis = null;
        this.yAxis = null;

        this.start = document.querySelector('.start');
        this.kill = document.querySelector('.kill');
        this.random = document.querySelector('.random');
        this.manual = document.querySelector('.manual')

        this.isRunning = false;
        this.iteration = 0;

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
                    this.iteration++;
                    this.generateNewField();
                    this.renderNewField();
                    if (!this.isRunning) {
                        clearInterval(timer);
                        this.iteration = 0;
                        return;
                    }
                }, 300);
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
            console.log(`${this.memory[this.iteration][0][0]}`);
            return;
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
        let HTML = `<div class="grid" style="grid-template-columns: repeat(${this.xAxis}, 1fr); grid-template-rows: repeat(${this.yAxis}, 1fr);">`;
        let field = [];
        for (let y = 0; y < this.yAxis; y++) {
            let line = [];
            for (let x = 0; x < this.xAxis; x++) {
                if (Math.random() < 0.225) {
                    HTML += '<div class="spot full"></div>';
                    line.push(true);
                } else {
                    HTML += '<div class="spot"></div>';
                    line.push(false);
                }
            }
            field.push(line);
        }
        this.memory[0] = field;
        HTML += `</div>`;
        this.DOM.innerHTML = HTML;
        return;
    }

    generateNewField() {
        let field = [];
        for (let y = 0; y < this.yAxis; y++) {
            let line = [];
            for (let x = 0; x < this.xAxis; x++) {
                let checkNeigh = 0;
                if (y > 0) {
                    if (x > 0) {
                        if (this.memory[this.iteration - 1][y - 1][x - 1]) checkNeigh++;
                    }
                    if (x < this.xAxis - 1) {
                        if (this.memory[this.iteration - 1][y - 1][x + 1]) checkNeigh++;
                    }
                    if (this.memory[this.iteration - 1][y - 1][x]) checkNeigh++;
                }
                if (y < this.yAxis - 1) {
                    if (x > 0) {
                        if (this.memory[this.iteration - 1][y + 1][x - 1]) checkNeigh++;
                    }
                    if (x < this.xAxis - 1) {
                        if (this.memory[this.iteration - 1][y + 1][x + 1]) checkNeigh++;
                    }
                    if (this.memory[this.iteration - 1][y + 1][x]) checkNeigh++;
                }
                if (x > 0) {
                    if (this.memory[this.iteration - 1][y][x - 1]) checkNeigh++;
                }
                if (x < this.xAxis - 1) {
                    if (this.memory[this.iteration - 1][y][x + 1]) checkNeigh++;
                } 
                if (this.memory[this.iteration - 1][y][x]) {
                    if (checkNeigh === 2 || checkNeigh === 3) {
                        line.push(true);
                    } else {
                        line.push(false);
                    }
                } else {
                    if (checkNeigh === 3) {
                        line.push(true);
                    } else {
                        line.push(false);
                    }
                }
            }
            field.push(line);
        }
        this.memory.push(field);
        return;
    }

    renderNewField() {
        let spots = document.querySelectorAll('.grid .spot');
        for (let y = 0; y < this.yAxis; y++) {
            for (let x = 0; x < this.xAxis; x++) {
                this.memory[this.iteration][y][x] ? spots[(y * this.xAxis) + x].classList.add('full') : spots[(y * this.xAxis) + x].classList.remove('full');
            }
        }

    }
}

export { GameOfLifeEngine }