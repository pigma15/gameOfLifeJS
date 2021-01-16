class GameOfLifeEngine {
    constructor (data) {
        this.DOM = document.querySelector(data.selector);
        this.spotsDOMs = null;

        this.memory = [];
        this.iteration = 0;
        this.isRandom = true;
        this.isRunning = false;
        this.isEqual = false;
        this.isSpots = false;

        this.equal = [];
        this.firstEqual = 0;
        this.lastEqual = 0;

        this.xAxis = +(document.querySelector('.xInput').value);
        this.yAxis = +(document.querySelector('.yInput').value);

        this.start = document.querySelector('.start');
        this.kill = document.querySelector('.kill');
        this.random = document.querySelector('.random');
        this.reset = document.querySelector('.reset');
        this.xInput = document.querySelector('.xInput');
        this.yInput = document.querySelector('.yInput');

        this.init();
    }
    init() {
        this.renderOne();
        this.spots();
        this.switches();
        this.changeDimensions();
        this.run();
    }
    switches() {
        this.random.onclick = () => (this.isRandom = true, this.isRunning = false, this.isEqual = false, this.isSpots = false, this.renderOne(), this.spots());
        this.reset.onclick = () => (this.isRandom = false, this.isRunning = false, this.isEqual = false, this.isSpots = false, this.renderOne(), this.spots());
        this.kill.onclick = () => {
            this.isRunning = false;
            this.isEqual = false;
            this.isRandom = false;
            this.spots();
        }
    }

    changeDimensions() {
        this.xInput.onclick = () => {
            this.xAxis = +(document.querySelector('.xInput').value);
            this.isRunning = false;
            this.isEqual = false;
            this.isSpots = false;
            this.renderOne();
            this.spots();
        }
        this.yInput.onclick = () => {
            this.yAxis = +(document.querySelector('.yInput').value);
            this.isRunning = false;
            this.isEqual = false;
            this.isSpots = false;
            this.renderOne();
            this.spots();
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
        this.isRandom = false;
        return;
    }

    run() {
        this.start.onclick = () => {
            if (this.isRunning) return;
            this.isRunning = true;
            this.isEqual = false;
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
                            this.firstEqual = check;
                            this.lastEqual = this.iteration;
                            this.equal = field;
                            this.isEqual = true;
                            return;
                        }
                    }
                }
            }, 150);
        }
        

    }

    spots() {
        if (this.isSpots) {
            return;
        }
        this.isSpots = true;
        for (let i = 0; i < this.spotsDOMs.length; i++) {
            const spot = this.spotsDOMs[i];
            spot.addEventListener('click', () => {
                if (this.isRunning) {
                    return;
                }
                let field = this.memory[0];
                this.isRandom = false;
                field[i] ? field[i] = false : field[i] = true;
                spot.classList.toggle('full');
                this.memory[0] = field;
                this.iteration = 0;
                console.log(spot);
            });
        }
    }
    
}

export { GameOfLifeEngine }