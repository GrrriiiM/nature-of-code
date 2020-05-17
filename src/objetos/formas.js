import { Area } from "./area.js";

export class Forma extends Area {
    constructor(processador, opcoes) {
        super(processador, opcoes)
        opcoes = opcoes || {};
        this._.solido = opcoes.solido != undefined ? opcoes.solido : true;
        this._.m = opcoes.m !== undefined ? opcoes.m : (this._.w * this._.h) * 0.001;
        this._.cor = this._.p.color(255);
        this._.aceleracao = this._.p.createVector(0, 0);
        this._.velocidade = this._.p.createVector(0, 0);
        this._.vMax = opcoes.vMax !== undefined ? opcoes.vMax : 10;
        this._.colidirParede = opcoes.colidirParede !== undefined ? opcoes.colidirParede : true;
    }

    get processador() { return this._.p; }
    
    get m() { return this._.m; }
    get solido() { return this._.solido; }
    get vX() { return this._.velocidade.x; }
    set vX(v) { return this._.velocidade.x = v; }
    get vY() { return this._.velocidade.y; }
    set vY(v) { return this._.velocidade.y = v; }
    get v() { return this._.velocidade; }
    set v(v) { return this._.velocidade = v; }
    get colidirParede() { return this._.colidirParede }

    atualizar() {
        this._.velocidade.add(this._.aceleracao);
        this._.velocidade.limit(this._.vMax);
        this._.posicao.add(this._.velocidade);
        this._.aceleracao.mult(0);
    }

    desenhar() {
        this._desenhar();
    }

    aplicarForca(forca) {
        let f = this._.p.createVector(forca.x, forca.y);
        let a = f.div(this._.m);
        this._.aceleracao.add(a);
    }
}

export class Elipse extends Forma {
    constructor(processador, opcoes) {
        super(processador, opcoes);
    }

    _desenhar() {
        this._.p.ellipseMode(this._.p.CORNER);
        this._.p.fill(this._.cor);
        this._.p.noStroke();
        this._.p.ellipse(this._.posicao.x, this._.posicao.y, this._.w, this._.h);
    }
}

export class Retangulo extends Forma {
    constructor(processador, opcoes) {
        super(processador, opcoes);
    }

    _desenhar() {
        this._.p.fill(this._.cor);
        this._.p.noStroke();
        this._.p.rect(this._.posicao.x, this._.posicao.y, this._.w, this._.h);
    }
}