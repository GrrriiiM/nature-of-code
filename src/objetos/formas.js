import { Area } from "./area.js";

export class Forma extends Area {
    constructor(processador, opcoes) {
        super(processador, opcoes)
        opcoes = opcoes || {};
        this._.m = opcoes.massa || (this._.w * this._.h) / 100;
        this._.cor = this._.p.color(255);
        this._.aceleracao = this._.p.createVector(0, 0);
        this._.velocidade = this._.p.createVector(0, 0);
        this._.aMax = 5;
    }

    get processador() { return this._.p; }
    get x() { return this._.posicao.x; }
    get y() { return this._.posicao.y; }
    get massa() { return this._.m; }

    desenhar() {
        this._.aceleracao.limit(this._.aMax);
        this._.velocidade.add(this._.aceleracao);
        this._.posicao.add(this._.velocidade);
        this.rebaterSaida();
        this._desenhar();
        this._.aceleracao.mult(0);
    }

    // _desenhar() {
    //     this._.p.fill(255, 255, 255, 255 * 0.5);
    //     this._.p.noStroke();
    //     this._.p.rect(this._.posicao.x, this._.posicao.y, this._.h, this._.w);
    // }



    rebaterSaida() {
        if (this.direita > this._.aW) {
            this._.velocidade.x = this._.velocidade.x * -1
            this._.posicao.x = this._.aW - this._.w;
        }
        else if (this.esquerda < 0) {
            this._.velocidade.x = this._.velocidade.x * -1
            this._.posicao.x = 0;
        }
        if (this.inferior > this._.aH) {
            this._.velocidade.y = this._.velocidade.y * -1
            this._.posicao.y = this._.aH - this._.h;
        }
        else if (this.superior < 0) {
            this._.velocidade.y = this._.velocidade.y * -1
            this._.posicao.y = 0;
        }
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