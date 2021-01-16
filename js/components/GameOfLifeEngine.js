class GameOfLifeEngine {
    constructor (data) {
        this.DOM = document.querySelector(data.selector);
        this.spotsDOMs = null;

        this.startBtn = document.querySelector('.start');
        this.killBtn = document.querySelector('.kill');
        this.xAxisBtn = document.querySelector('.xInput');
        this.yAxisBtn = document.querySelector('.yInput');
        this.resetBtn = document.querySelector('.reset');
        this.randomBtn = document.querySelector('.random');

        this.length = +(document.querySelector('.xInput').value);
        this.height = +(document.querySelector('.yInput').value);

        this.iteration = 0;
        this.memory = [0];

        this.isPlaying = false;
        this.isEditable = true;
        this.runCount = 0;
        this.isEqualFound = false;
        this.firstEqual = 0;
        this.lastEqual = 0; 

        this.fps = 1000 / 3;

        this.init();
    }
    init() {
        this.killBtn.disabled = true;
        this.renderOneField(true);
        this.changeDimensions();
        this.generateNewField();
        this.editField();
        this.start();
        this.kill();
    }
    isPlayingState(state) {
        if (state) {
            this.isPlaying = true;
            this.isEditable = false;
            this.isEqualFound = false;;
            this.startBtn.disabled = true;
            this.xAxisBtn.disabled = true;
            this.yAxisBtn.disabled = true;
            this.resetBtn.disabled = true;
            this.randomBtn.disabled = true;
            this.killBtn.disabled = false;
        } else {
            this.isPlaying = false;
            this.isEditable = true;
            this.killBtn.disabled = true;
            this.xAxisBtn.disabled = false;
            this.yAxisBtn.disabled = false;
            this.resetBtn.disabled = false;
            this.randomBtn.disabled = false;
            this.startBtn.disabled = false;         
        }
        return;
    }
    changeDimensions() {
        this.xAxisBtn.onclick = () => {
            if (this.isPlaying) return;
            this.length = +(document.querySelector('.xInput').value);
            this.height = +(document.querySelector('.yInput').value);
            this.renderOneField(true);
            this.isPlayingState(false);
            this.editField();
            this.runCount = 0;
            return;
        }
        this.yAxisBtn.onclick = () => {
            if (this.isPlaying) return;
            this.length = +(document.querySelector('.xInput').value);
            this.height = +(document.querySelector('.yInput').value);
            this.renderOneField(true);
            this.isPlayingState(false);
            this.editField();
            this.runCount = 0;
            return;
        }
    }
    generateNewField() {
        this.randomBtn.onclick = () => {
            if (this.isPlaying) return;
            this.renderOneField(true);
            this.isEditable = true;
            this.editField();
            this.runCount = 0;
            return;
        }
        this.resetBtn.onclick = () => {
            if (this.isPlaying) return;
            this.renderOneField(false);
            this.isEditable = true;
            this.editField();
            this.runCount = 0;
            return;
        }
    }
    renderOneField(random) {
        if (this.isPlaying) return;
        let field = [];
        const fieldSize = this.length * this.height;
        let HTML = `<div class="grid" style="grid-template-columns: repeat(${this.length}, 1fr); grid-template-rows: repeat(${this.height}, 1fr);">`;
        if (random === 'static') {
            field = this.memory[this.iteration];
            for (let i = 0; i < fieldSize; i++) {
                field[i] ? HTML += '<div class="spot full"></div>' : HTML += '<div class="spot"></div>';
            }
        } else if (random === 'last') {
            if (this.iteration > 1) this.iteration -= 1;
            field = this.memory[this.iteration - 1];
            for (let i = 0; i < fieldSize; i++) {
                field[i] ? HTML += '<div class="spot full"></div>' : HTML += '<div class="spot"></div>';
            }
        } else if (random) {
            for (let i = 0; i < fieldSize; i++) {
                Math.random() > 0.23 ? (HTML += '<div class="spot"></div>', field.push(false)) : (HTML += '<div class="spot full"></div>', field.push(true));
            }
        } else {
            for (let i = 0; i < fieldSize; i++) {
                HTML += '<div class="spot"></div>';
                field.push(false);
            }
        }
        
        this.memory = [0];
        this.memory[0] = field;
        HTML += `</div>`;
        this.DOM.innerHTML = HTML;
        this.spotsDOMs = document.querySelectorAll('.spot');
        return;
        
    }
    editField() {
        if (!this.isEditable) return;
        this.isEditable = false;
        for (let i = 0; i < this.spotsDOMs.length; i++) {
            const spot = this.spotsDOMs[i];
            spot.addEventListener('click', () => {
                if (this.isPlaying) return;
                let field = this.memory[0];
                field[i] ? field[i] = false : field[i] = true;
                spot.classList.toggle('full');
                this.memory[0][i] = field[i];
                this.isEqualFound = false;
            })
        }

    }
    start() {
        this.startBtn.onclick = () => {
            if (this.isPlaying) return;
            this.isPlayingState(true);
            let timer = time =>
            setTimeout(() => {
                if (!this.isPlaying) {
                    clearTimeout(time);
                    return;
                }
                this.iteration++;
                this.makeNewField();
                this.compareFields();
                this.postRender();
                !this.isPlaying ? clearTimeout(time) : timer();
            }, this.fps);
            timer();
            
        }
    }
    kill() {
        this.killBtn.onclick = () => {
            this.isPlayingState(false);
            this.renderOneField('last')
            this.isEditable = true;
            this.editField();
            this.iteration = 0;
            return;
        }
    }
    makeNewField() {
        if (this.isEqualFound) return;
        let field = [];
        const fieldSize = this.length * this.height;
        for (let i = 0; i < fieldSize; i++) {
            const prev = this.memory[this.iteration - 1];
            const spot = this.spotsDOMs[i];
            let checkNeigh = 0;
            if (i - this.length > -1) {
                if (i % this.length > 0) {
                    if (prev[i - this.length - 1]) checkNeigh++;
                }
                if (i % this.length < this.length - 1) {
                    if (prev[i - this.length + 1]) checkNeigh++;
                }
                if (prev[i - this.length]) checkNeigh++;
            }
            if (i + this.length < fieldSize) {
                if (i % this.length > 0) {
                    if (prev[i + this.length - 1]) checkNeigh++;
                }
                if (i % this.length < this.length - 1) {
                    if (prev[i + this.length + 1]) checkNeigh++;
                }
                if (prev[i + this.length]) checkNeigh++;
            }
            if (i % this.length > 0) {
                if (prev[i - 1]) checkNeigh++;
            }
            if (i % this.length < this.length - 1) {
                if (prev[i + 1]) checkNeigh++;
            }
            if (prev[i]) {
                (checkNeigh === 2 || checkNeigh === 3) ? (field.push(true), spot.classList.add('full')) : (field.push(false), spot.classList.remove('full'));
            } else {
                checkNeigh === 3 ? (field.push(true), spot.classList.add('full')) : (field.push(false), spot.classList.remove('full'));
            }
            this.memory[this.iteration] = field;
        }

    }
    compareFields() {
        if (this.isEqualFound) return;
        const fieldSize = this.length * this.height;
        for (let i = this.iteration - 1; i >= 0; i--) {
            const field = this.memory[this.iteration];
            this.firstEqual = i;
            this.lastEqual = this.iteration;
            const check = i;
            let checkCount = 0;
            for (let j = 0; j < fieldSize; j++) {
                if (this.memory[check][j] === field[j]) checkCount++;
            }
            if (checkCount === fieldSize) {
                if (this.lastEqual - this.firstEqual === 1) {
                    this.isPlayingState(false);
                    this.renderOneField('static')
                    this.isEditable = true;
                    this.editField();
                    this.iteration = 0;
                }
                this.isEqualFound = true;            
                return;
            }
        }
    }
    postRender() {
        if (!this.isPlaying) return;
        if (this.isEqualFound) {
            this.runCount++;
            let position = (this.runCount + 1) % (this.lastEqual - this.firstEqual);
            let field = [];
            const fieldSize = this.length * this.height;
            for (let i = 0; i < fieldSize; i++) {
                const spot = this.spotsDOMs[i];
                field.push(this.memory[this.firstEqual + position][i]);
                this.memory[this.firstEqual + position][i] ?  spot.classList.add('full', 'super') : spot.classList.remove('full', 'super');
            }
            this.memory[this.iteration] = field;
            return;
        }
    }

}

export { GameOfLifeEngine }