class GameOfLifeEngine {
    constructor (data) {
        this.DOM = document.querySelector(data.selector);
        this.spotsDOMs = null;

        this.memory = [];
        this.iteration = 0;
        this.isRandom = true;
        this.isRunning = false;
        this.isEqual = false;

        this.xAxis = +(document.querySelector('.xInput').value);
        this.yAxis = +(document.querySelector('.yInput').value);

        this.start = document.querySelector('.start');
        this.kill = document.querySelector('.kill');
        this.random = document.querySelector('.random');
        this.reset = document.querySelector('.reset');
        this.xInput = document.querySelector('.xInput');
        this.yInput = document.querySelector('.yInput');

        // keiciant rezoliucija perpiesia nauja random if random arba tuscia if manual
        // paspaudus start pradeda tikrinti esama field ir is jo sukuria nauja, tada ji tikrina ar nepasikartojo

        this.init();
    }
    init() {
        this.renderOne();
        this.randomSwitch();
        this.changeDimensions();
        this.run();
    }
    randomSwitch() {
        this.random.onclick = () => (this.isRandom = true, this.renderOne());
        this.reset.onclick = () => (this.isRandom = false, this.renderOne());
        this.kill.onclick = () => {
            this.isRunning = false;
        }
    }

    changeDimensions() {
        this.xInput.onclick = () => {
            this.xAxis = +(document.querySelector('.xInput').value);
            this.renderOne();
        }
        this.yInput.onclick = () => {
            this.yAxis = +(document.querySelector('.yInput').value);
            this.renderOne();
        }
    }

    renderOne() {
        if (this.isRunning) return;
        this.iteration = 0;
        this.memory = [0]
        let field = [];
        const fieldSize = this.xAxis * this.yAxis;
        let HTML = `<div class="grid" style="grid-template-columns: repeat(${this.xAxis}, 1fr); grid-template-rows: repeat(${this.yAxis}, 1fr);">`;
        if (this.isRandom) {
            for (let i = 0; i < fieldSize; i++) {
                Math.random() > 0.23 ? (HTML += '<div class="spot"></div>', field.push(false)) : (HTML += '<div class="spot full"></div>', field.push(true));
            }
        } else {
            for (let i = 0; i < fieldSize; i++) {
                HTML += '<div class="spot"></div>';
                field.push(false);
            }
        }
        this.memory[0] = field;
        HTML += `</div>`;
        this.DOM.innerHTML = HTML;
        this.spotsDOMs = document.querySelectorAll('.spot');
        return;
    }

    run() {
        this.start.onclick = () => {
            if (this.isRunning) return;
            this.isRunning = true;
            const fieldSize = this.xAxis * this.yAxis;
            let timer =
            setInterval(() => {
                if(!this.isRunning) {
                    clearInterval(timer);
                    const lastFrame = this.memory[this.iteration];
                    this.memory = [0];
                    this.memory[0] = lastFrame;
                    this.iteration = 0;
                    return;
                }
                this.iteration++;
                let field = [];
                for (let i = 0; i < fieldSize; i++) {
                    const prev = this.memory[this.iteration - 1];
                    const spot = this.spotsDOMs[i];
                    let checkNeigh = 0;
                    if (i - this.xAxis > -1) {
                        if (i % this.xAxis > 0) {
                            if (prev[i - this.xAxis - 1]) checkNeigh++;
                        }
                        if (i % this.xAxis < this.xAxis - 1) {
                            if (prev[i - this.xAxis + 1]) checkNeigh++;
                        }
                        if (prev[i - this.xAxis]) checkNeigh++;
                    }
                    if (i + this.xAxis < fieldSize) {
                        if (i % this.xAxis > 0) {
                            if (prev[i + this.xAxis - 1]) checkNeigh++;
                        }
                        if (i % this.xAxis < this.xAxis - 1) {
                            if (prev[i + this.xAxis + 1]) checkNeigh++;
                        }
                        if (prev[i + this.xAxis]) checkNeigh++;
                    }
                    if (i % this.xAxis > 0) {
                        if (prev[i - 1]) checkNeigh++;
                    }
                    if (i % this.xAxis < this.xAxis - 1) {
                        if (prev[i + 1]) checkNeigh++;
                    }
                    if (prev[i]) {
                        (checkNeigh === 2 || checkNeigh === 3) ? (field.push(true), spot.classList.add('full')) : (field.push(false), spot.classList.remove('full'));
                    } else {
                        checkNeigh === 3 ? (field.push(true), spot.classList.add('full')) : (field.push(false), spot.classList.remove('full'));
                    }
                }
                this.memory[this.iteration] = field;
                if (!this.isEqual) {
                    for (let i = this.iteration - 1; i >= 0; i--) {
                        let checkCount = 0;
                        const check = i;
                        for (let j = 0; j < fieldSize; j++) {
                            if (this.memory[check][j] === field[j]) checkCount++;
                        }
                        if (checkCount === fieldSize) {
                            this.isEqual = true;
                            return;
                        }
                    }
                }
            }, 150);
        }
        

    }
    
}

export { GameOfLifeEngine }